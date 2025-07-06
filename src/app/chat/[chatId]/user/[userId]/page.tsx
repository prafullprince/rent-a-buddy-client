/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import {
  fetchMessage,
  fetchOtherUser,
  fetchUserDetailsById,
} from "@/service/apiCall/chat.api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect, useParams, usePathname, useRouter } from "next/navigation";
import React, { memo, useEffect, useRef, useState } from "react";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";
import wspLogo from "../../../../../../public/assets/wssupLogo.png";
import {
  IoArrowBackSharp,
  IoCallOutline,
  IoCallSharp,
  IoSendSharp,
  IoVideocamOutline,
} from "react-icons/io5";
import toast from "react-hot-toast";
import SendMoneyModal from "@/components/Chat/SendMoneyModal";
import Receiver from "@/components/Chat/Message/Receiver";
import Sender from "@/components/Chat/Message/Sender";
import { useDispatch } from "react-redux";
import { setOpenChatMobile } from "@/redux/slice/chat.slice";
import { AnimatePresence, motion } from "framer-motion";
import { FaVideo } from "react-icons/fa";
import { SlCallEnd } from "react-icons/sl";
import socket from "@/utills/socket";
import { MicIcon } from "lucide-react";

// Define types for better maintainability
interface Message {
  _id: string;
  text: any;
  sender: string;
  receiver: string;
  type: string;
  createdAt: string;
  isSeen: boolean;
  order?: string;
}

interface User {
  _id: string;
  username: string;
  image: string;
}

// ChatPage
const Page = () => {
  // hooks
  const { chatId, userId } = useParams();
  const { data: session } = useSession();
  const divRef = useRef<HTMLDivElement>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const router = useRouter();
  const chatRef = useRef<string>("");
  const pathName = usePathname();
  const dispatch = useDispatch();

  // state
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [refreshButton, setRefreshButton] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [isCallStart, setIsCallStart] = useState(false);
  const [isIncomingCall, setIncomingCall] = useState(false);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState<any>(null);
  const [isCallModal, setIsCallModal] = useState(false);
  const [isRemote, setIsRemote] = useState(true);
  const [isAudioCall, setIsAudioCall] = useState(false);
  const [seenMessage, setSeenMessage] = useState(false);

  // --- WebRTC Setup ---
  const setupPeerConnection = () => {
    if (!socket.connected) socket.connect();

    // createPeerConnection
    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    // add-ice-candidate
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("add-ice-candidate", {
          chatId,
          userId: userId,
          candidate: event.candidate,
        });
      }
    };

    // Prepare remote stream to accumulate tracks
    remoteStreamRef.current = new MediaStream();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }

    // Add incoming track to remote stream
    pc.ontrack = (event) => {
      remoteStreamRef.current?.addTrack(event.track);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        // event.streams[0] or remoteStreamRef.current -> contains the remote stream (coming from the other user)
      }
    };

    return pc;
  };

  // handleVideoCall
  const handleVideoCall = async () => {
    if (!chatId || !userDetails?._id) return;

    if (!socket.connected) socket.connect();

    // createPeerConnection
    const pc = setupPeerConnection();

    // Get local media stream and add to peer connection
    try {
      setIsCallStart(true);
      // stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // save stream in localStreamRef
      localStreamRef.current = stream;

      // add tracks to peer connection for receiver
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // show local video
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Failed to get local media stream:", err);
      setIsCallStart(false);
      return;
    }

    // When negotiation needed, create and send offer
    pc.onnegotiationneeded = async () => {
      try {
        // createOffer
        const offer = await pc.createOffer();

        // set offer in LocalDescription
        await pc.setLocalDescription(offer);

        // send offer to server for receiver
        if (socket) {
          socket.emit("createOffer", {
            chatId,
            userId: userId,
            offer: pc.localDescription,
          });
        }

        return;
      } catch (err) {
        console.error("Error during negotiation:", err);
      }
    };
  };

  // handleAudioCall
  const handleAudioCall = async () => {
    if (!chatId || !userDetails?._id || !socket || !isAudioCall) return;
    setIsAudioCall(true);

    // Create PeerConnection
    const pc = setupPeerConnection(); // setup ICE, ontrack, etc.

    // Get local media (mic + camera)
    try {
      // stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      // save stream in localStreamRef
      localStreamRef.current = stream;

      // Add tracks to PeerConnection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Show local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log(error);
    }

    // When negotiation needed, create and send offer
    pc.onnegotiationneeded = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket?.send(
          JSON.stringify({
            type: "createOffer",
            payload: {
              chatId,
              userId: userDetails?._id,
              offer: pc.localDescription,
            },
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
  };

  // handleAccept
  const handleAccept = async () => {
    if (!isIncomingCall || !chatId || !userDetails?._id || !incomingOffer)
      return;

    if (!socket.connected) socket.connect();
    setIsCallAccepted(true);

    // 1. Create PeerConnection
    const pc = setupPeerConnection(); // setup ICE, ontrack, etc.

    // 2. Get local media (mic + camera)
    try {
      // stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // save stream in localStreamRef
      localStreamRef.current = stream;

      // Add tracks to PeerConnection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Show local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Failed to get local media:", error);
      return;
    }

    // set offer in remoteDescription
    await pc.setRemoteDescription(incomingOffer);

    // 4. Create answer
    const answer = await pc.createAnswer();

    // set answer in LocalDescription
    await pc.setLocalDescription(answer);

    // 5. Send answer back to caller
    if (socket) {
      socket.emit("createAnswer", {
        chatId,
        userId: userId,
        answer: pc.localDescription,
      });
      setIncomingCall(false);
    }
  };

  // handleReject
  const handleReject = () => {
    if (!socket.connected) socket.connect();

    // Cleanup peer connection and streams
    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setIsCallStart(false);
    setIncomingCall(false);
    setIsCallAccepted(false);
    setIsCallModal(false);

    // notify other user
    socket.emit("rejectCall", { chatId, userId: userId });

    toast.error("Call rejected");
  };

  // handleCallEnd
  const handleCallEnd = () => {
    if (!socket.connected) socket.connect();

    // 1. Stop local media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // 2. Close the PeerConnection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    // 3. Reset video refs
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // 5. end from other user too
    if (socket) {
      socket.emit("endCall", { chatId, userId: userId });
    }

    // 6. Reset UI states
    setIsCallStart(false);
    setIsCallAccepted(false);
    setIncomingOffer(null);
    setIsCallModal(false);

    toast.success("Call ended");
  };

  // Fetch Messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetchMessage(chatId, session?.serverToken);
      setMessages(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // sendMessage
  const sendMessage = () => {
    // validation
    const message = chatRef.current.trim();
    if (!socket || !message) return;

    // msg payload
    const messagePayload = {
      chatId: chatId,
      sender: userDetails?._id,
      receiver: userId,
      text: message,
      type: "text",
    };

    // send message
    setMsgLoading(true);
    socket.emit("sendMessage", messagePayload);

    chatRef.current = ""; // clear ref manually
    const inputElement = document.querySelector<HTMLInputElement>("input");
    if (inputElement) inputElement.value = ""; // clear UI input
  };

  // Fetch User Details
  const fetchUserDetails = async () => {
    try {
      const response = await fetchUserDetailsById(session?.serverToken);
      setUserDetails(response);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch Other User
  const fetchOtherUsers = async () => {
    try {
      const response = await fetchOtherUser(userId);
      setOtherUser(response);
    } catch (error) {
      console.error("Error fetching other user:", error);
    }
  };

  // Fetch Data
  useEffect(() => {
    if (!chatId || !session || !userId) return;
    fetchMessages();
    fetchOtherUsers();
  }, [chatId, session?.serverToken, refreshButton, userId]);

  // fetchUserDetails
  useEffect(() => {
    if (!session) return;
    fetchUserDetails();
  }, [session?.serverToken]);

  // handle socket connection
  useEffect(() => {
    if (!userDetails || !chatId) return;

    // handle connect
    const handleConnect = () => {
      // registerUserInChat
      socket.emit("registerUserInChat", {
        chatId: chatId,
        userId: userDetails._id,
      });
    };

    // handle disconnect
    const handleDisconnect = () => {
      console.log("disconnected");
    };

    // handle error
    const handleError = () => {
      console.log("error");
      toast.error("Socket error");
    };

    // handle connected
    const handleConnected = () => {
      toast.success("connected");
    };

    // handle receiveMessage
    const handleReceiveMessage = (data: any) => {
      setMessages((prev) => [...prev, data]);
      setMsgLoading(false);
    };

    // handle reloadChat
    const handleReloadChat = () => {
      fetchMessages();
    };

    // handleAcceptIceCandidate
    const handleAcceptIceCandidate = ({ candidate }: any) => {
      console.log("handleAcceptIceCandidate");
      pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    };

    // handleAcceptOffer
    const handleAcceptOffer = async ({ offer }: any) => {
      console.log("handleAcceptOffer");
      setIncomingCall(true);
      setIsCallModal(true);
      setIncomingOffer(offer);
    };

    // handleAcceptAnswer
    const handleAcceptAnswer = ({ answer }: any) => {
      console.log("handleAcceptAnswer");
      pcRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
      setIncomingCall(false);
      setIsCallAccepted(true);
    };

    // handleRejectCall
    const handleRejectCall = () => {
      console.log("handleRejectCall");
      pcRef.current?.close();
      pcRef.current = null;

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;

      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

      setIsCallStart(false);
      setIncomingCall(false);
      setIsCallAccepted(false);
      setIsCallModal(false);

      toast.error("Call rejected");
    };

    // handleCallEnd
    const handleCallEnd = () => {
      console.log("handleCallEnd");
      // 1. Stop local media tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }

      // 2. Close the PeerConnection
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }

      // 3. Reset video refs
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      // 6. Reset UI states
      setIsCallStart(false);
      setIsCallAccepted(false);
      setIncomingOffer(null);
      setIsCallModal(false);

      toast.success("Call ended");
    };

    // socket handlers
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("error", handleError);
    socket.on("Connected", handleConnected);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("reloadChat", handleReloadChat);
    socket.on("accept-ice-candidate", handleAcceptIceCandidate);
    socket.on("acceptOffer", handleAcceptOffer);
    socket.on("acceptAnswer", handleAcceptAnswer);
    socket.on("rejectCall", handleRejectCall);
    socket.on("endCall", handleCallEnd);

    // socket connection
    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    // when user in particular chat
    socket.emit("openChat", { chatId, userId: userDetails._id });

    // cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("error", handleError);
      socket.off("Connected", handleConnected);
      socket.emit("closeChat", { chatId, userId: userDetails._id });
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("reloadChat", handleReloadChat);
      socket.off("accept-ice-candidate", handleAcceptIceCandidate);
      socket.off("acceptOffer", handleAcceptOffer);
      socket.off("acceptAnswer", handleAcceptAnswer);
      socket.off("rejectCall", handleRejectCall);
      socket.off("endCall", handleCallEnd);
    };
  }, [chatId, userDetails]);

  // Auto-scroll to the latest message
  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // localStreaming
  useEffect(() => {
    if (
      (isCallStart || isCallAccepted) &&
      localVideoRef.current &&
      localStreamRef.current
    ) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [isCallStart, isCallAccepted]);

  // Handle Enter Key for Sending Message
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
      chatRef.current = "";
    }
  };

  // shift video
  useEffect(() => {
    if (remoteVideoRef.current) {
      if (isRemote) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      } else {
        remoteVideoRef.current.srcObject = localStreamRef.current;
      }
    }
    if (localVideoRef.current) {
      if (isRemote) {
        localVideoRef.current.srcObject = localStreamRef.current;
      } else {
        localVideoRef.current.srcObject = remoteStreamRef.current;
      }
    }
  }, [isRemote, remoteStreamRef, localStreamRef]);

  // on hard refresh
  useEffect(() => {
    // Check for hard reload or first load
    const navEntries = window.performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    const isHardRefresh =
      navEntries.length > 0 && navEntries[0].type === "reload";

    if (isHardRefresh) {
      if (window.innerWidth < 640) {
        dispatch(setOpenChatMobile(true));
      }
    }
  }, [dispatch]);

  return (
    <motion.div
      className="flex flex-col items-start rounded-xl max-w-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Bar */}
      <div className="h-16 px-1 py-2 flex items-center justify-between bg-slate-50 w-full sm:rounded-tr-xl">
        {/* left */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              dispatch(setOpenChatMobile(false));
              router.push("/chat");
            }}
            className="px-2 py-2 block sm:hidden"
          >
            <IoArrowBackSharp className="text-2xl text-slate-500" />
          </button>

          <div className="flex items-start gap-2 lg:gap-4">
            <Image
              className="rounded-full min-w-8 min-h-8 max-h-8 max-w-8"
              alt="dp"
              src={otherUser?.image || fallbackImage}
              width={40}
              height={40}
              priority
            />
            <div className="text-base font-medium text-black">
              {otherUser?.username}
            </div>
          </div>
        </div>

        {/* icon */}
        <div className="flex items-center gap-6 mr-4">
          <button onClick={handleAudioCall} className="cursor-pointer">
            <IoCallOutline className="text-2xl text-slate-950" />
          </button>

          <button onClick={handleVideoCall} className="cursor-pointer">
            <IoVideocamOutline className="text-3xl text-slate-900" />
          </button>
        </div>
      </div>

      {/* Message Box */}
      <div className="w-full relative">
        {loading ? (
          <div
            className="max-h-[calc(100dvh-115px)] min-h-[calc(100dvh-115px)] sm:max-h-[calc(100dvh-180px)] sm:min-h-[calc(100dvh-180px)] p-4 overflow-auto bg-gray-800 bg-center bg-cover"
            style={{ backgroundImage: `url(${wspLogo.src})` }}
          >
            <div className="flex justify-center items-center py-6">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
            </div>
          </div>
        ) : (
          <div
            className="max-h-[calc(100dvh-120px)] min-h-[calc(100dvh-120px)] sm:max-h-[calc(100dvh-180px)] sm:min-h-[calc(100dvh-180px)] p-4 overflow-y-auto bg-gray-800"
            style={{ backgroundImage: `url(${wspLogo.src})` }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center">
                No message found. Let's chat
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div key={msg._id} className="flex flex-col gap-1">
                    {/* Receiver */}
                    <Receiver
                      msg={msg}
                      userDetails={userDetails}
                      socket={socket}
                      setAcceptLoading={setAcceptLoading}
                      acceptLoading={acceptLoading}
                      chatId={chatId}
                      current={userDetails?._id}
                      other={userId}
                    />

                    {/* Sender */}
                    <Sender
                      msg={msg}
                      userDetails={userDetails}
                      socket={socket}
                      setModalData={setModalData}
                      session={session}
                      seenMessage={seenMessage}
                      chatId={chatId}
                      current={userDetails?._id}
                      other={userId}
                    />
                  </div>
                ))}
              </div>
            )}
            <div ref={divRef}></div>
          </div>
        )}
      </div>

      {/* Send Message */}
      <div className="w-full bg-gray-300 px-4 py-2 flex items-center gap-2 rounded-br-xl">
        <input
          type="text"
          defaultValue=""
          onChange={(e) => (chatRef.current = e.target.value)}
          placeholder="Type a message and press enter"
          onKeyDown={handleKeyDown}
          className="bg-white w-full h-10 px-4 rounded-lg outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2 rounded-lg text-xl cursor-pointer"
        >
          <IoSendSharp />
        </button>
      </div>

      {/* video */}
      {(isCallStart || isCallAccepted) && !isAudioCall && (
        <div className="absolute top-0 right-0 left-0 bottom-1 z-20 flex items-center justify-center rounded-sm shadow-2xl overflow-hidden">
          {/* Remote Video (full screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-screen h-full object-cover z-30 bg-slate-200"
          ></video>

          {/* Local Video (small overlay) */}
          <video
            onClick={() => setIsRemote((prev: any) => !prev)}
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-4 right-4 w-36 h-40 lg:w-40 lg:h-44 rounded-xl border-1 border-slate-300 shadow-xl object-cover z-40"
          ></video>

          {/* call managing */}
          <div className="absolute bottom-4 z-50 left-2 flex gap-4 bg-gray-700 px-3 py-2 rounded-md items-center">
            <button
              onClick={handleCallEnd}
              className="bg-red-600 text-base text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-all duration-300 w-9 h-9 cursor-pointer"
            >
              <SlCallEnd />
            </button>
            <button className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-900 text-base cursor-pointer">
              <MicIcon />
            </button>

            <button className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-900 text-base cursor-pointer">
              <FaVideo />
            </button>
          </div>
        </div>
      )}

      {/* audio */}
      {(isCallStart || isCallAccepted) && isAudioCall && (
        <div className="absolute top-0 right-0 left-0 bottom-1 z-20 flex items-center justify-center rounded-sm shadow-2xl overflow-hidden">
          {/* Remote audio (full screen) */}
          <audio
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover z-30 bg-slate-200"
          ></audio>

          {/* call managing */}
          <div className="absolute top-4 z-50 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              onClick={handleCallEnd}
              className="bg-red-600 text-xl text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-all duration-300 px-4 py-[10px]"
            >
              <SlCallEnd />
            </button>
            {/* <button className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-700">
              <MicIcon />
            </button> */}
          </div>
        </div>
      )}

      {/* accept/ decline */}
      <AnimatePresence mode="wait">
        {isCallModal && !isCallAccepted && (
          <motion.div
            className="flex items-center gap-3 bg-slate-200 z-50 px-4 py-3 rounded-md absolute top-12 shadow-xl left-[50%] right-[50%] -translate-x-[50%] w-fit"
            initial={{ y: -20 }}
            animate={{ y: 28 }}
            exit={{ y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleAccept}
              className="cursor-pointer px-3 py-2 rounded-2xl bg-green-800 text-white text-xs font-semibold"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              className="cursor-pointer px-3 py-2 rounded-2xl bg-red-500 text-slate-900 text-xs font-semibold"
            >
              Decline
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* sendMoneyModal */}
      {modalData && (
        <SendMoneyModal
          modalData={modalData}
          setModalData={setModalData}
          setRefreshButton={setRefreshButton}
          socket={socket}
          chatId={chatId}
        />
      )}
    </motion.div>
  );
};

export default memo(Page);

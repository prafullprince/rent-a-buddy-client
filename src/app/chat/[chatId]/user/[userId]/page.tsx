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
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { memo, useEffect, useRef, useState } from "react";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";
import wspLogo from "../../../../../../public/assets/wssupLogo.png";
import { IoArrowBackSharp, IoCallSharp, IoSendSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import SendMoneyModal from "@/components/Chat/SendMoneyModal";
import Receiver from "@/components/Chat/Message/Receiver";
import Sender from "@/components/Chat/Message/Sender";
import { useDispatch } from "react-redux";
import { setOpenChatMobile } from "@/redux/slice/chat.slice";
import { AnimatePresence, motion } from "framer-motion";
import { FaVideo } from "react-icons/fa";
import { SlCallEnd } from "react-icons/sl";

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
  const socketRef = useRef<WebSocket | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const RECONNECT_INTERVAL = 3000;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const PING_INTERVAL = 25000; // 25 seconds
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
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

  // --- WebRTC Setup ---
  const setupPeerConnection = () => {
    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    // add-ice-candidate
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "add-ice-candidate",
            payload: {
              chatId,
              userId: userId,
              candidate: event.candidate,
            },
          })
        );
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
    if (!chatId || !userDetails?._id || !socketRef.current) return;

    setIsCallStart(true);

    const pc = setupPeerConnection();

    // Get local media stream and add to peer connection
    try {
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
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(
            JSON.stringify({
              type: "createOffer",
              payload: {
                chatId,
                userId: userId,
                offer: pc.localDescription,
              },
            })
          );
        }
      } catch (err) {
        console.error("Error during negotiation:", err);
      }
    };
  };

  // handleAccept
  const handleAccept = async () => {
    if (!socketRef.current || !incomingOffer || !chatId || !userDetails?._id)
      return;

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

    // 3. Set remote description with caller's offer
    await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));

    // 4. Create answer
    const answer = await pc.createAnswer();

    // set answer in LocalDescription
    await pc.setLocalDescription(answer);

    // 5. Send answer back to caller
    socketRef.current.send(
      JSON.stringify({
        type: "createAnswer",
        payload: {
          chatId,
          userId: userId,
          sdp: pc.localDescription,
        },
      })
    );
  };

  // handleReject
  const handleReject = () => {
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
  };

  // handleCallEnd
  const handleCallEnd = () => {
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
  
    // 5. Reset UI states
    setIsCallStart(false);
    setIsCallAccepted(false);
    setIncomingOffer(null);
    setIsCallModal(false);
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
    const message = chatRef.current.trim();
    if (!socketRef.current || !message) return;

    const messagePayload = {
      type: "sendMessage",
      payload: {
        chatId: chatId,
        sender: userDetails?._id,
        receiver: userId,
        text: message,
        type: "text",
      },
    };

    console.log("first");

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      setMsgLoading(true);
      console.log("second");
      socketRef.current.send(JSON.stringify(messagePayload));
    } else {
      toast.error("Connection lost. Refresh the page to reconnect.");
      // connectWebSocket();
    }
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

  useEffect(() => {
    if (!session) return;
    fetchUserDetails();
  }, [session?.serverToken]);

  // Handle WebSocket Connection
  useEffect(() => {
    if (!chatId || !userDetails?._id) return;

    let socket: WebSocket;

    const connectWebSocket = () => {
      socket = new WebSocket("wss://rent-a-buddy-server-1.onrender.com");
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("WebSocket connected");

        // Register user
        socket.send(
          JSON.stringify({
            type: "register",
            payload: {
              userId: userDetails?._id,
              chatId: chatId,
            },
          })
        );

        // Start pinging
        pingIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "ping" }));
          }
        }, PING_INTERVAL);

        // reconnect
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      socket.onclose = (event) => {
        console.log("❌ WebSocket closed", event.reason || event.code);

        // Stop pinging
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        // Schedule reconnection
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("🔁 Attempting to reconnect...");
            connectWebSocket();
          }, RECONNECT_INTERVAL);
        }
      };
      socket.onerror = (error) => console.error("WebSocket Error", error);

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "receiveMessage") {
          setMessages((prev) => [...prev, data.payload]);
          setMsgLoading(false);
        }

        // reload chat
        if (data.type === "reloadChat") {
          fetchMessages();
        }

        if (data.type === "orderAccepted") {
          toast.success(data.payload.message);
          setRefreshButton((prev) => !prev);
          setAcceptLoading(false);
        }

        if (data?.type === "pong") {
          console.log("🏓 Pong received from server");
        }

        // on receiver from sender -> incoming call
        if (data.type === "createOffer") {
          setIncomingOffer(data.payload);
          setIsCallModal(true);
        }

        // on sender from receiver -> call accepted
        if (data.type === "createAnswer") {
          if (pcRef.current) {
            // const sdp = data.payload;
            await pcRef.current.setRemoteDescription(data.payload);
            setIsCallAccepted(true);
          }
        }

        // add-ice-candidate
        if (data.type === "add-ice-candidate") {
          // const { candidate } = data.payload;
          pcRef.current?.addIceCandidate(data.payload);
        }
      };
    };
    connectWebSocket();

    // cleanup
    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socket.onmessage = null;
    };
  }, [chatId, userDetails?._id]);

  // open chat and close chat
  useEffect(() => {
    if (!chatId || !userDetails?._id) return;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "openChat",
          payload: { chatId, userId: userDetails._id },
        })
      );
    }

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "closeChat",
            payload: { chatId, userId: userDetails._id },
          })
        );
      }
    };
  }, [chatId, userDetails?._id]);

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

  return (
    <motion.div
      className="flex flex-col items-start rounded-xl max-w-full relative"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top Bar */}
      <div className="h-16 px-2 py-2 flex items-center justify-between bg-gray-200 w-full sm:rounded-tr-xl">
        {/* left */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // back to prev page
              // router.back();
              dispatch(setOpenChatMobile(false));
              router.push("/chat");
            }}
            className="px-2 py-2 block sm:hidden"
          >
            <IoArrowBackSharp className="text-2xl" />
          </button>
          <div className="flex items-center gap-2">
            <Image
              className="rounded-full min-w-10 min-h-10 max-h-10 max-w-10 border-1 border-blue-300"
              alt="dp"
              src={otherUser?.image || fallbackImage}
              width={40}
              height={40}
              priority
            />
            <div>{otherUser?.username}</div>
          </div>
        </div>

        {/* icon */}
        <div className="flex items-center gap-6 mr-4">
          <button className="cursor-pointer">
            <IoCallSharp className="text-2xl text-slate-600" />
          </button>

          <button onClick={handleVideoCall} className="cursor-pointer">
            <FaVideo className="text-2xl text-slate-600" />
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
                      socketRef={socketRef}
                      setAcceptLoading={setAcceptLoading}
                      acceptLoading={acceptLoading}
                    />

                    {/* Sender */}
                    <Sender
                      msg={msg}
                      userDetails={userDetails}
                      socketRef={socketRef}
                      setModalData={setModalData}
                      session={session}
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
      {(isCallStart || isCallAccepted) && (
        <div className="absolute top-10 right-10 left-10 bottom-10 z-20 flex items-center justify-center rounded-2xl shadow-2xl overflow-hidden">
          {/* Remote Video (full screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          ></video>

          {/* Local Video (small overlay) */}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-4 right-4 w-32 h-36 lg:w-40 lg:h-44 rounded-xl border-2 border-white shadow-lg object-cover"
          ></video>

          {/* call managing */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button onClick={handleCallEnd} className="bg-red-600 text-lg text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-all duration-300 px-3 py-[6px]">
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
            className="flex items-center gap-3 bg-slate-200 z-50 px-4 py-3 rounded-md absolute top-18 shadow-xl left-[50%] right-[50%] -translate-x-[50%] w-fit"
            initial={{ y: -20 }}
            animate={{ y: 72 }}
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
          socketRef={socketRef}
          chatId={chatId}
        />
      )}
    </motion.div>
  );
};

export default memo(Page);

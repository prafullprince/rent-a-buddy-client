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
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";
import wspLogo from "../../../../../../public/assets/wssupLogo.png";
import { IoArrowBackSharp, IoSendSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import SendMoneyModal from "@/components/Chat/SendMoneyModal";
import Receiver from "@/components/Chat/Message/Receiver";
import Sender from "@/components/Chat/Message/Sender";

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
  const RECONNECT_INTERVAL = 3000;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const PING_INTERVAL = 25000; // 25 seconds
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // state
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<string>("");
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [refreshButton, setRefreshButton] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [transaction, setTransaction] = useState<any>(null);


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

  // Send Message
  const sendMessage = () => {
    if (!socketRef.current || !chat.trim()) return;

    const messagePayload = {
      type: "sendMessage",
      payload: {
        chatId: chatId,
        sender: userDetails?._id,
        receiver: userId,
        text: chat,
        type: "text",
      },
    };

    socketRef.current.send(JSON.stringify(messagePayload));
    setChat("");
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
    fetchMessages();
    fetchOtherUsers();
  }, [chatId, session, refreshButton]);

  useEffect(() => {
    fetchUserDetails();
  }, [session]);

  // Handle WebSocket Connection
  useEffect(() => {
    if (!chatId || !userDetails?._id) return;

    let socket: WebSocket;

    const connectWebSocket = () => {
      socket = new WebSocket("ws://localhost:4000");
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
        }

        // reload chat
        if (data.type === "reloadChat") {
          setLoading(true);
          try {
            const response = await fetchMessage(chatId, session?.serverToken);
            setMessages(Array.isArray(response) ? response : []);
          } catch (error) {
            console.error("Error fetching messages:", error);
          } finally {
            setLoading(false);
          }
        }

        if (data.type === "orderAccepted") {
          toast.success(data.payload.message);
          setRefreshButton((prev) => !prev);
          setAcceptLoading(false);
        }

        if (data?.type === "pong") {
          console.log("🏓 Pong received from server");
        }
      };
    };
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [chatId, userDetails?._id]);

  useEffect(() => {
    if (!chatId || !userDetails?._id) return;
  
    const interval = setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: "openChat",
          payload: { chatId: chatId, userId: userDetails._id },
        }));
        clearInterval(interval); // only run once after open
      }
    }, 300);
  
    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: "closeChat",
          payload: { chatId: chatId, userId: userDetails._id },
        }));
      }
      clearInterval(interval);
    };
  }, [chatId, userDetails?._id]);
  

  // Auto-scroll to the latest message
  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Enter Key for Sending Message
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
      setChat("");
    }
  };

  return (
    <div className="flex flex-col items-start rounded-xl max-w-full">
      {/* Top Bar */}
      <div className="h-16 px-2 py-2 flex items-center justify-between bg-gray-200 w-full sm:rounded-tr-xl">
        <div className="">
          <div className="flex items-center gap-2">
            <button onClick={() => {}} className="px-2 py-2">
              <IoArrowBackSharp className="text-2xl" />
            </button>
            <div className="flex items-center gap-2">
              <Image
                className="rounded-full min-w-10 min-h-10 max-h-10 max-w-10"
                alt="dp"
                src={otherUser?.image || fallbackImage}
                width={40}
                height={40}
                priority
              />
              <div>{otherUser?.username}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Box */}
      <div className="w-full">
        {loading ? (
          <div
            className="max-h-[600px] min-h-[600px] p-4 overflow-auto bg-gray-800 bg-center bg-cover"
            style={{ backgroundImage: `url(${wspLogo.src})` }}
          >
            Loading....
          </div>
        ) : (
          <div
            className="sm:max-h-[600px] sm:min-h-[600px] h-[80dvh] p-4 overflow-y-auto overflow-hidden bg-gray-800 relative"
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
          value={chat}
          onChange={(e) => setChat(e.target.value)}
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

      {modalData && (
        <SendMoneyModal
          modalData={modalData}
          setModalData={setModalData}
          setTransaction={setTransaction}
          setRefreshButton={setRefreshButton}
        />
      )}
    </div>
  );
};

export default Page;

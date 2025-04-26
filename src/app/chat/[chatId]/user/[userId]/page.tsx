/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */

"use client";
import {
  fetchMessage,
  fetchOrdersOfParticularChat,
  fetchOtherUser,
  fetchUserDetailsById,
} from "@/service/apiCall/chat.api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";
import wspLogo from "../../../../../../public/assets/wssupLogo.png";
import { IoMdDoneAll } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import { GrEmoji } from "react-icons/gr";
import { FaHandsHelping } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import toast from "react-hot-toast";
import PlanetSpinner from "@/loading/PageLoadingSpinner";
import SendMoneyModal from "@/components/Chat/SendMoneyModal";
import Timer from "@/components/Chat/Timer";
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
  const socketRef = useRef<WebSocket | null>(null); // Persist socket instance

  // state
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<string>("");
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [orders, setOrders] = useState<any>([]);
  const [refreshButton, setRefreshButton] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [startTime, setStartTime] = useState<any>(null);
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

  // fetchOrdersOfParticularChat
  const fetchOrdersOfParticularChatId = async () => {
    try {
      const result = await fetchOrdersOfParticularChat(
        chatId,
        session?.serverToken
      );
      setOrders(result);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch Data
  useEffect(() => {
    fetchMessages();
    fetchOtherUsers();
  }, [chatId, session]);

  useEffect(() => {
    if(socketRef.current) {
      fetchOrdersOfParticularChatId();
    }
  }, [refreshButton, chatId, session]);

  useEffect(() => {
    fetchUserDetails();
  }, [session]);

  // Handle WebSocket Connection
  useEffect(() => {
    if (!chatId || !userDetails?._id) return;

    const socket = new WebSocket("ws://localhost:4000");
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
    };

    socket.onclose = () => console.log("WebSocket closed");
    socket.onerror = (error) => console.error("WebSocket Error", error);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "receiveMessage") {
        setMessages((prev) => [...prev, data.payload]);
      }

      if (data.type === "orderAccepted") {
        toast.success(data.payload.message);
        setRefreshButton((prev) => !prev);
        setAcceptLoading(false);
      }
    };

    return () => {
      socket.close();
    };
  }, [chatId, userDetails?._id]);

  // Auto-scroll to the latest message
  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
      const startTimeIso = localStorage.getItem("startTime");
      if (startTimeIso) {
        setStartTime(JSON.parse(startTimeIso));
      }
  }, [modalData]);

  // Handle Enter Key for Sending Message
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
      setChat("");
    }
  };

  return (
    <div className="flex flex-col items-start rounded-xl">
      {/* Top Bar */}
      <div className="h-16 px-4 py-2 flex items-center justify-between bg-gray-200 w-full rounded-tr-xl">
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

      {/* Message Box */}
      <div className="w-full flex-1">
        {loading ? (
          <div
            className="max-h-[700px] min-h-[700px] p-4 overflow-auto bg-gray-800 bg-center bg-cover"
            style={{ backgroundImage: `url(${wspLogo.src})` }}
          >
            Loading....
          </div>
        ) : (
          <div
            className="max-h-[700px] min-h-[700px] p-4 overflow-auto bg-gray-800 relative"
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
                    <Receiver msg={msg} userDetails={userDetails} socketRef={socketRef} setAcceptLoading={setAcceptLoading} acceptLoading={acceptLoading} orders={orders} />

                    {/* Sender */}
                    <Sender msg={msg} userDetails={userDetails} socketRef={socketRef} orders={orders} setModalData={setModalData} session={session} />
                  </div>
                ))}
              </div>
            )}
            <div ref={divRef}></div>
            <div className="absolute top-2 left-[45%] bg-gray-400 px-3 py-2 rounded-xl">
              <Timer startTimeISO={startTime} />
            </div>
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
        {/* <button
          onClick={sendMessage}
          className="text-gray-500 hover:text-yellow-400"
        >
          <GrEmoji className="text-2xl" />
        </button> */}
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2 rounded-lg text-xl cursor-pointer"
        >
          <IoSendSharp />
        </button>
      </div>

      {modalData && (
        <SendMoneyModal modalData={modalData} setModalData={setModalData} setStartTime={setStartTime} setTransaction={setTransaction} />
      )}
    </div>
  );
};

export default Page;

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
import { IoMdDoneAll } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import { GrEmoji } from "react-icons/gr";
import { PiCurrencyInrBold } from "react-icons/pi";

// Define types for better maintainability
interface Message {
  _id: string;
  text: any;
  sender: string;
  receiver: string;
  type: string;
  createdAt: string;
  isSeen: boolean;
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
  }, [chatId]);

  useEffect(() => {
    fetchUserDetails();
  }, [session?.serverToken]);

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
    };

    return () => {
      socket.close();
    };
  }, [chatId, userDetails?._id]);

  // Auto-scroll to the latest message
  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  return (
    <div className="flex flex-col items-start">
      {/* Top Bar */}
      <div className="h-16 px-4 py-2 flex items-center justify-between bg-gray-200 w-full">
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
            className="max-h-[700px] min-h-[700px] p-4 overflow-auto bg-gray-800"
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
                    {msg?.receiver === userDetails?._id && (
                      <div className="flex justify-start">
                        <div
                          className={`max-w-[75%] relative text-black rounded-lg rounded-tl-none ${
                            msg.type === "text"
                              ? "bg-white px-3 pt-1"
                              : "bg-white min-w-xs max-w-sm"
                          }`}
                        >
                          <div
                            className={`absolute left-0 top-0 border-t-[10px] border-t-transparent border-l-[10px] ${
                              msg.type === "text"
                                ? "border-white"
                                : "border-l-gray-400"
                            } w-0 h-0 rotate-180 -translate-x-2 translate-y-0`}
                          ></div>
                          {msg.type === "text" ? (
                            <div className="pr-14 pb-2">{msg.text}</div>
                          ) : (
                            <div
                              className={`${
                                msg?.type === "text" ? "pr-14" : "pr-0"
                              } pb-8`}
                            >
                              <div className="flex flex-col gap-2">

                                {/* topbar */}
                                <div className="flex items-center justify-between bg-gray-400 h-14 px-2">
                                  {/* left */}
                                  <div className="flex items-start gap-2">
                                    <Image
                                      src={
                                        msg?.text?.subId?.subCategoryId
                                          ?.imageUrl || fallbackImage
                                      }
                                      alt="subSectionImage"
                                      width={40}
                                      height={30}
                                      className="rounded-lg aspect-square"
                                    />
                                    <div className="flex flex-col gap-1">
                                      {/* name */}
                                      <div className="text-black text-xs font-semibold">
                                        {msg?.text?.subId?.subCategoryId?.name}
                                      </div>

                                      {/* price */}
                                      <div className="flex items-center gap-1">
                                        <p className="text-xs font-medium text-gray-600">
                                          {msg?.text?.subId?.price}
                                          /hr
                                        </p>
                                      </div>
                                      {/* about */}
                                    </div>
                                  </div>

                                  {/* right */}
                                  
                                </div>

                                {/* Info */}
                                <div className="flex flex-col gap-1 px-2">
                                  {/* date */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-sm text-black font-semibold">
                                      Date:{" "}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {msg?.text?.date}
                                    </p>
                                  </div>

                                  {/* time */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-sm text-black font-semibold">
                                      Time:{" "}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {msg?.text?.time}
                                    </p>
                                  </div>

                                  {/* venue */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-sm text-black font-semibold">
                                      Location:{" "}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {msg?.text?.location}
                                    </p>
                                  </div>

                                  {/* additionalInfo */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-sm text-black font-semibold">
                                      Info:{" "}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {msg?.text?.additionalInfo}
                                    </p>
                                  </div>

                                  {/* cabFare */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-sm text-black font-semibold">
                                      CabFare:{" "}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {msg?.text?.cabFare}
                                    </p>
                                  </div>

                                  {/* FinalPrice */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-sm text-black font-semibold">
                                      FinalPrice:{" "}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {msg?.text?.totalPrice}.00 Rs
                                    </p>
                                  </div>
                                </div>

                                {/* buttons */}
                                <div className="px-2 py-1 flex items-center gap-1 mt-2">
                                  <button onClick={()=>{
                                    socketRef.current?.send(
                                      JSON.stringify({
                                        type: "Accept",
                                        payload: {
                                          msgId: msg?._id
                                        }
                                      })
                                    )
                                  }} className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-semibold cursor-pointer">
                                    Accept
                                  </button>
                                  <button onClick={()=>{
                                    socketRef.current?.send(
                                      JSON.stringify({
                                        type: "Reject",
                                        payload: {
                                          msgId: msg?._id
                                        }
                                      })
                                    )
                                  }} className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-semibold ml-2 cursor-pointer">
                                    Reject
                                  </button>
                                </div>

                              </div>
                            </div>
                          )}
                          {/* dateTime */}
                          <span className="text-right text-xs text-gray-500 text-richblack-25 font-bold absolute bottom-1 right-2">
                            {new Date(msg?.createdAt).toLocaleString("en-us", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }) === "Invalid Date" ? (
                              <>23:59</>
                            ) : (
                              <>
                                {new Date(msg?.createdAt).toLocaleString(
                                  "en-us",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )}
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Sender */}
                    {msg?.sender === userDetails?._id && (
                      <div className="flex justify-end">
                        <div
                          className={`max-w-[75%] relative text-black rounded-lg rounded-tr-none ${
                            msg?.type === "text"
                              ? "bg-green-200 px-3 pt-1"
                              : "bg-white min-w-xs max-w-sm"
                          }`}
                        >
                          <div
                            className={`absolute right-0 top-0 border-t-[10px] border-t-transparent border-l-[10px] ${
                              msg.type !== "text"
                                ? "border-l-gray-400"
                                : "border-l-green-200"
                            } w-0 h-0 rotate-90 translate-x-2 translate-y-0`}
                          ></div>
                          {msg?.type === "text" ? (
                            <div className="pr-14 pb-2">{msg.text}</div>
                          ) : (
                            <div
                              className={`${
                                msg?.type === "text" ? "pr-14" : "pr-0"
                              } pb-8`}
                            >
                              <div className="flex flex-col gap-2">
                                {/* topbar */}
                                <div className="flex items-center justify-between bg-gray-400 h-14 px-2">
                                  {/* left */}
                                  <div className="flex items-start gap-2">
                                    <Image
                                      src={
                                        msg?.text?.subId?.subCategoryId
                                          ?.imageUrl || fallbackImage
                                      }
                                      alt="subSectionImage"
                                      width={40}
                                      height={30}
                                      className="rounded-lg aspect-square"
                                    />
                                    <div className="flex flex-col gap-1">
                                      {/* name */}
                                      <div className="text-black text-xs font-semibold">
                                        {msg?.text?.subId?.subCategoryId?.name}
                                      </div>

                                      {/* price */}
                                      <div className="flex items-center gap-1">
                                        <p className="text-xs font-medium text-gray-600">
                                          {msg?.text?.subId?.price}
                                          /hr
                                        </p>
                                      </div>
                                      {/* about */}
                                    </div>
                                  </div>

                                  {/* right */}
                                  <div className="px-2 py-1 text-[8px] bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                                      Waiting for response
                                  </div>
                                </div>

                                {/* Info */}
                                <div className="flex flex-col gap-1 px-2">
                                  {/* date */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-sm text-black font-semibold">
                                      Date:{" "}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {msg?.text?.date}
                                    </p>
                                  </div>

                                  {/* time */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-sm text-black font-semibold">
                                      Time:{" "}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {msg?.text?.time}
                                    </p>
                                  </div>

                                  {/* venue */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-sm text-black font-semibold">
                                      Location:{" "}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {msg?.text?.location}
                                    </p>
                                  </div>

                                  {/* additionalInfo */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-sm text-black font-semibold">
                                      Info:{" "}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {msg?.text?.additionalInfo}
                                    </p>
                                  </div>

                                  {/* cabFare */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-sm text-black font-semibold">
                                      CabFare:{" "}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {msg?.text?.cabFare}
                                    </p>
                                  </div>

                                  {/* FinalPrice */}
                                  <div className="flex items-center gap-1">
                                    <div className="text-sm text-black font-semibold">
                                      FinalPrice:{" "}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {msg?.text?.totalPrice}.00 Rs
                                    </p>
                                  </div>
                                </div>

                                {/* buttons */}
                                <div className="flex items-center gap-1 mt-2">
                                  <button className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-semibold ml-2 cursor-pointer">
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* dateTime */}
                          <span className="text-right text-xs text-gray-500 text-richblack-25 font-bold absolute bottom-1 right-6">
                            {new Date(msg?.createdAt).toLocaleString("en-us", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }) === "Invalid Date" ? (
                              <>23:59</>
                            ) : (
                              <>
                                {new Date(msg?.createdAt).toLocaleString(
                                  "en-us",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )}
                              </>
                            )}
                          </span>

                          {/* checkMark */}
                          <span className="absolute right-1 bottom-1">
                            <IoMdDoneAll
                              className={
                                msg.isSeen ? "text-blue-500" : "text-gray-500"
                              }
                            />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div ref={divRef}></div>
          </div>
        )}
      </div>

      {/* Send Message */}
      <div className="w-full bg-gray-300 px-4 py-2 flex items-center gap-2">
        <input
          type="text"
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          placeholder="Type a message"
          className="bg-white w-full h-10 px-4 rounded-lg outline-none"
        />
        <button
          onClick={sendMessage}
          className="text-gray-500 hover:text-yellow-400"
        >
          <GrEmoji className="text-2xl" />
        </button>
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-1 rounded-lg"
        >
          <IoSendSharp />
        </button>
      </div>
    </div>
  );
};

export default Page;

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ChatSidebar from "@/components/Chat/ChatSidebar";
import { fetchUserDetailsById } from "@/service/apiCall/user.api";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Layout = ({ children }: { children: any }) => {
  const { data: session, status } = useSession();
  const socketref = useRef<WebSocket | null>(null);
  const RECONNECT_INTERVAL = 3000;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const PING_INTERVAL = 25000;
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { openChatMobile } = useSelector((state: any) => state.chat);

  // state
  const [allChat, setAllChat] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>({});
  const [chatLoading, setChatLoading] = useState(false);
  const [numOfUnseenMessages, setNumOfUnseenMessages] = useState<any[]>([]);

  // refs for latest state
  const allChatRef = useRef<any[]>([]);
  const userDetailsRef = useRef<any>({});

  // update refs when state changes
  useEffect(() => {
    allChatRef.current = allChat;
  }, [allChat]);

  useEffect(() => {
    userDetailsRef.current = userDetails;
  }, [userDetails]);

  const fetchUserDetails = async () => {
    try {
      const result = await fetchUserDetailsById(session?.serverToken);
      setUserDetails(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getUnseenMessages = () => {
    const socket = socketref.current;
    const chatList = allChatRef.current;
    const user = userDetailsRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (!user?._id || chatList.length === 0) {
      console.log("⏳ Skipping getUnseenMessages: data not ready");
      return;
    }

    const chatIds = chatList.map((chat: any) => chat._id);
    console.log("📩 Sending unseen message request", { userId: user._id, chatIds });

    socket.send(
      JSON.stringify({
        type: "unseenMessageOfParticularChatIdOfUser",
        payload: { userId: user._id, chatIds },
      })
    );
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchUserDetails();
  }, [status]);

  // socket connection
  useEffect(() => {
    if (!userDetails?._id) return;

    let socket: WebSocket;

    const connectWebSocket = () => {
      socket = new WebSocket("wss://rent-a-buddy-server-1.onrender.com");
      socketref.current = socket;
      setChatLoading(true);

      socket.onopen = () => {
        console.log("✅ WebSocket connected");

        // Ping + unseen message check every 25 seconds
        pingIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "ping" }));
            getUnseenMessages();
          }
        }, PING_INTERVAL);

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }

        // Fetch chats
        socket.send(
          JSON.stringify({
            type: "fetchAllChat",
            payload: {
              userId: userDetails._id,
            },
          })
        );
      };

      socket.onclose = (event) => {
        console.log("❌ WebSocket closed", event.reason || event.code);

        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("🔁 Attempting to reconnect...");
            connectWebSocket();
          }, RECONNECT_INTERVAL);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data?.type === "fetchUserAllChats") {
          setAllChat(data?.payload?.data);
          setChatLoading(false);
        }

        if (data?.type === "numOfUnseenMessages") {
          setNumOfUnseenMessages(data.payload);
        }

        if (data?.type === "pong") {
          console.log("🏓 Pong received from server");
        }
      };
    };

    connectWebSocket();

    return () => {
      if (socketref.current) socketref.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    };
  }, [userDetails?._id]);

  // On chat list update, also fetch unseen immediately once
  useEffect(() => {
    if (userDetails._id && allChat.length > 0 && socketref.current?.readyState === WebSocket.OPEN) {
      console.log("🚀 Calling getUnseenMessages after chat list updated...");
      getUnseenMessages();
    }
  }, [allChat, userDetails._id]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return redirect("/login");
  }

  return (
    <div className="bg-gray-100 backdrop-blur-sm flex justify-center items-center w-full max-w-full overflow-y-hidden">
      <div className="w-full sm:w-[90%] lg:w-[80%] mx-auto sm:pt-4 flex rounded-xl">
        <ChatSidebar
          allChat={allChat}
          chatLoading={chatLoading}
          sockty={socketref.current}
          userDetails={userDetails}
          numOfUnseenMessages={numOfUnseenMessages}
        />
        <div
          className={`sm:h-screen max-h-[100dvh] min-h-[100dvh] flex-1 max-w-full rounded-xl sm:block ${
            openChatMobile ? "block" : "hidden"
          } sm:max-w-[calc(100%-300px)]`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

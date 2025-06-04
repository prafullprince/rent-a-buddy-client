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
  // hooks
  const { data: session, status } = useSession();
  const socketref = useRef<WebSocket | null>(null);
  const RECONNECT_INTERVAL = 3000;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const PING_INTERVAL = 25000; // 25 seconds
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { openChatMobile } = useSelector((state: any) => state.chat);

  // state
  const [allChat, setAllChat] = useState<any>([]);
  const [userDetails, setUserDetails] = useState<any>({});
  const [chatLoading, setChatLoading] = useState(false);

  // fetchUserDetails
  const fetchUserDetails = async () => {
    try {
      const result = await fetchUserDetailsById(session?.serverToken);
      setUserDetails(result);
    } catch (error) {
      console.log(error);
    }
  };

  // sideEffect
  useEffect(() => {
    if (status !== "authenticated") return;
    fetchUserDetails();
  }, [status]);

  // handle websocket connection
  useEffect(() => {
    if (!userDetails?._id) return;

    let socket: WebSocket;

    const connectWebSocket = () => {
      socket = new WebSocket("wss://rent-a-buddy-server-1.onrender.com");
      socketref.current = socket;
      setChatLoading(true);

      socket.onopen = () => {
        console.log("✅ WebSocket connected");

        // Start pinging
        pingIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "ping" }));
          }
        }, PING_INTERVAL);

        // Clear any previous reconnection attempts
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }

        // Fetch all chats
        socket.send(
          JSON.stringify({
            type: "fetchAllChat",
            payload: {
              userId: userDetails?._id,
            },
          })
        );
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

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data?.type === "fetchUserAllChats") {
          setAllChat(data?.payload?.data);
          setChatLoading(false);
        }

        if (data?.type === "pong") {
          console.log("🏓 Pong received from server");
        }
      };
    };

    connectWebSocket();

    return () => {
      if (socketref.current) {
        socketref.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [userDetails?._id]);

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
          setAllChat={setAllChat}
          chatLoading={chatLoading}
          openChatMobile={openChatMobile}
          sockty={socketref.current}
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

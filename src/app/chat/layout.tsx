/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ChatSidebar from "@/components/Chat/ChatSidebar";
import { fetchUserDetailsById } from "@/service/apiCall/user.api";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: any }) => {
  const { data: session, status } = useSession();

  const [allChat, setAllChat] = useState<any>([]);
  const [userDetails, setUserDetails] = useState<any>({});
  const [chatLoading, setChatLoading] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  const fetchUserDetails = async () => {
    try {
      const result = await fetchUserDetailsById(session?.serverToken);
      setUserDetails(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchUserDetails();
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated" || !userDetails?._id) return;

    const socket = new WebSocket("ws://localhost:4000");

    socket.onopen = () => {
      console.log("WebSocket connected");
      setChatLoading(true);
      socket.send(
        JSON.stringify({
          type: "fetchAllChat",
          payload: {
            userId: userDetails._id,
          },
        })
      );
    };

    socket.onclose = () => console.log("WebSocket closed");
    socket.onerror = (error) => console.error("WebSocket Error", error);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data?.type === "fetchUserAllChats") {
        setAllChat(data?.payload?.data);
        setChatLoading(false);
      }
    };

    setSocket(socket);

    return () => {
      socket.close();
    };
  }, [status, userDetails?._id]);

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return redirect("/login");
  }

  return (
    <div className="bg-green-900 flex justify-center items-center">
      <div className="w-[90%] lg:w-[80%] mx-auto pt-4 flex rounded-xl">
        <ChatSidebar allChat={allChat} setAllChat={setAllChat} chatLoading={chatLoading} />
        <div className="h-screen flex-1 rounded-xl">{children}</div>
      </div>
    </div>
  );
};

export default Layout;

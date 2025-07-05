/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import ChatSidebar from "@/components/Chat/ChatSidebar";
import { fetchUserDetailsById } from "@/service/apiCall/user.api";
import socket from "@/utills/socket";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Layout = ({ children }: { children: any }) => {
  const { data: session, status } = useSession();
  const { openChatMobile } = useSelector((state: any) => state.chat);

  // state
  const [allChat, setAllChat] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>({});
  const [chatLoading, setChatLoading] = useState(false);
  const [numOfUnseenMessages, setNumOfUnseenMessages] = useState<any[]>([]);

  // fetch user details -> loggedIn
  const fetchUserDetails = async () => {
    try {
      const result = await fetchUserDetailsById(session?.serverToken);
      setUserDetails(result);
    } catch (error) {
      console.log(error);
    }
  };

  // Api call -> fetch user details
  useEffect(() => {
    if (status !== "authenticated") return;
    fetchUserDetails();
  }, [status]);

  // handle socket -> fetch all chat
  useEffect(() => {
    if (!userDetails) return;

    // handle connect -> fetch all chat
    const handleConnect = () => {
      setChatLoading(true);

      // fetch all chat
      socket.emit("fetchAllChat", {
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

    // handle all chat
    const handleAllChat = (data: any) => {
      setAllChat(data?.data);
      setChatLoading(false);
    };

    // handle listners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("error", handleError);
    socket.on("fetchUserAllChats", handleAllChat);

    // if socket is not connected
    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    // cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("error", handleError);
      socket.off("fetchUserAllChats", handleAllChat);
    };
  }, [userDetails]);

  // Loading
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
      </div>
    );
  }

  // Unauthenticated
  if (status === "unauthenticated") {
    return redirect("/login");
  }

  return (
    <div className="bg-gray-100 backdrop-blur-sm flex justify-center items-center w-full max-w-full overflow-y-hidden">
      <div className="w-full sm:w-[90%] lg:w-[80%] mx-auto sm:pt-4 flex rounded-xl">
        <ChatSidebar
          allChat={allChat}
          chatLoading={chatLoading}
          sockty={socket}
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

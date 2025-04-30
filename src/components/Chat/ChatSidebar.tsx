/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import { fetchUserDetailsById } from "@/service/apiCall/chat.api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { motion } from "framer-motion";

const PING_INTERVAL = 25000;
const RECONNECT_INTERVAL = 3000;

const ChatSidebar = ({
  allChat,
  setAllChat,
  chatLoading,
  openChatMobile,
  setOpenChatMobile,
}: any) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [numOfUnseenMessages, setNumOfUnseenMessages] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);
  const pathName = usePathname();

  console.log("total unseen messages", numOfUnseenMessages);

  // Fetch user details once authenticated
  useEffect(() => {
    if (status !== "authenticated" || !session?.serverToken) return;

    const fetchUser = async () => {
      try {
        const result = await fetchUserDetailsById(session.serverToken);
        setUserDetails(result);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }
    };

    fetchUser();
  }, [status, session?.serverToken]);

  // Get unseen messages
  const getUnseenMessages = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    if (!userDetails?._id || !allChat.length) return;

    const chatIds = allChat.map((chat: any) => chat._id);
    socketRef.current.send(
      JSON.stringify({
        type: "unseenMessageOfParticularChatIdOfUser",
        payload: { userId: userDetails._id, chatIds },
      })
    );
  };

  // WebSocket connection (run only when session + userDetails are available)
  useEffect(() => {
    if (!session || !userDetails?._id) return;

    const connectWebSocket = () => {
      const socket = new WebSocket("wss://rent-a-buddy-server-1.onrender.com");
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ WebSocket connected");

        getUnseenMessages();

        pingIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "ping" }));
            getUnseenMessages();
          }
        }, PING_INTERVAL);

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          getUnseenMessages();
        }
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data?.type === "numOfUnseenMessages") {
          setNumOfUnseenMessages(data.payload);
        }
      };

      socket.onclose = (event) => {
        console.warn("WebSocket closed:", event.reason || event.code);
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, RECONNECT_INTERVAL);
        }

        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) socketRef.current.close();
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [session, userDetails?._id]);

  // Update unseen messages when chat list changes
  useEffect(() => {
    if (session && userDetails?._id && allChat.length && socketRef.current?.readyState === WebSocket.OPEN) {
      getUnseenMessages();
    }
  }, [allChat, pathName, session, userDetails?._id]);

  return (
    <div
      className={`rounded-xl sm:block ${
        openChatMobile ? "hidden" : "block"
      } min-w-full max-w-full sm:max-w-[300px] sm:min-w-[300px]`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.8 }}
        className={`flex flex-col gap-4 sm:border-r-1 sm:border-l-1 sm:border-t sm:border-b border-gray-400 max-h-[720px] min-h-[720px] bg-white ${
          isOpen
            ? "sm:max-w-[300px] sm:min-w-[300px]"
            : "sm:max-w-[80px] sm:min-w-[80px] min-w-full max-w-full"
        } rounded-tl-xl rounded-bl-xl`}
      >
        <div
          className={`flex items-center justify-between border-b-2 ${
            isOpen ? "px-6 py-2" : "px-4 py-2"
          }`}
        >
          {isOpen && (
            <div className="text-black font-extrabold text-2xl mt-2">Chat</div>
          )}
          <div
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
            className="cursor-pointer mt-2 bg-gray-100 hover:bg-gray-200 transition-all duration-300 rounded-lg px-2 py-2 ease-in-out"
          >
            {isOpen ? (
              <GoSidebarExpand className="text-2xl" />
            ) : (
              <GoSidebarCollapse className="text-3xl" />
            )}
          </div>
        </div>

        {/* allChat */}
        <div className="mt-2">
          {chatLoading && (
            <div className="flex justify-center items-center py-6">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
            </div>
          )}
          {!chatLoading && allChat?.length === 0 && <div>No chats</div>}
          {!chatLoading && allChat?.length > 0 && (
            <div className="flex flex-col">
              {allChat?.map((chit: any) => (
                <div
                  onClick={() => {
                    setCurrentChatId(chit?._id);

                    // mark as read
                    socketRef?.current?.send(
                      JSON.stringify({
                        type: "markAsRead",
                        payload: {
                          chatId: chit?._id,
                          userId: userDetails?._id,
                        },
                      })
                    );

                    getUnseenMessages();

                    // navigate to chat
                    router.push(
                      `/chat/${chit?._id}/user/${
                        chit?.participants?.find(
                          (usr: any) => usr?._id !== userDetails?._id
                        )?._id
                      }`
                    );

                    if (window.innerWidth < 640) {
                      // Tailwind 'sm' is 640px
                      setOpenChatMobile(true);
                    }
                  }}
                  key={chit?._id}
                  className={`flex justify-between relative cursor-pointer hover:bg-gray-200 transition-all duration-200 ${
                    isOpen ? "px-6 py-3" : "px-4 py-3"
                  } border-b border-b-gray-200 ${
                    currentChatId === chit?._id ? "bg-gray-200" : ""
                  }`}
                >
                  {/* image, details */}
                  <div className="flex items-start gap-4">
                    <div className="border-2 border-gray-400 rounded-full p-[2px]">
                      <Image
                        src={
                          chit?.participants?.find(
                            (usr: any) => usr?._id !== userDetails?._id
                          )?.image
                        }
                        alt="dp"
                        width={40}
                        height={40}
                        priority
                        className="rounded-full min-w-10 max-w-10 min-h-10 max-h-10 aspect-auto"
                      />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <div className="text-lg font-medium text-wrap break-words">
                        {chit?.participants
                          ?.find((usr: any) => usr?._id !== userDetails?._id)
                          ?.username?.substring(0, 30)}
                      </div>
                      <div className="text-sm text-gray-400 text-wrap break-words">
                        {/* {chit?.message[chit?.message.length - 1]?.text?.substring(0, 20)}.... */}
                      </div>
                    </div>
                  </div>

                  {/* info -> unseen msg */}
                  {numOfUnseenMessages?.length > 0 &&
                    numOfUnseenMessages?.find(
                      (msg: any) => msg?.chatId === chit?._id
                    )?.unSeenCount > 0 && (
                      <div className="absolute bottom-2 right-4 text-xs text-gray-100 bg-red-500 rounded-full min-w-6 min-h-6 font-semibold flex items-center justify-center">
                        {
                          numOfUnseenMessages?.find(
                            (msg: any) => msg?.chatId === chit?._id
                          )?.unSeenCount
                        }
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ChatSidebar;

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import { fetchUserDetailsById } from "@/service/apiCall/chat.api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setOpenChatMobile } from "@/redux/slice/chat.slice";
import { IoChevronBack } from "react-icons/io5";
import Link from "next/link";
const PING_INTERVAL = 25000;
const RECONNECT_INTERVAL = 2000;

const ChatSidebar = ({
  allChat,
  setAllChat,
  chatLoading,
  openChatMobile,
  sockty,
}: any) => {
  // hooks
  const { data: session } = useSession();
  const router = useRouter();
  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathName = usePathname();
  const dispatch = useDispatch();

  // state
  const [userDetails, setUserDetails] = useState<any>(null);
  const [numOfUnseenMessages, setNumOfUnseenMessages] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");

  // Fetch user details once authenticated
  useEffect(() => {
    if (!session) return;

    const fetchUser = async () => {
      try {
        const result = await fetchUserDetailsById(session.serverToken);
        setUserDetails(result);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }
    };

    fetchUser();
  }, [session?.serverToken]);

  // Get unseen messages
  const getUnseenMessages = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;
    if (!userDetails?._id || allChat.length === 0) return;

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
    if (!userDetails?._id) return;

    let pingRef = pingIntervalRef.current;
    let reconnectRef = reconnectTimeoutRef.current;

    const connectWebSocket = () => {

      // create socket
      const socket = new WebSocket("wss://rent-a-buddy-server-1.onrender.com");
      socketRef.current = socket;

      // when socket open
      socket.onopen = () => {
        console.log("✅ WebSocket connected");

        // getUnseenMessage
        getUnseenMessages();

        // start pinging
        pingRef = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "ping" }));
            getUnseenMessages();
          }
        }, PING_INTERVAL);

        // reconnect
        if (reconnectRef) {
          clearTimeout(reconnectRef);
          reconnectRef = null;
          // getUnseenMessages();
        }
      };

      // when socket receive message
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data?.type === "numOfUnseenMessages") {
          setNumOfUnseenMessages(data.payload);
        }
      };

      // when socket close
      socket.onclose = (event) => {
        console.log("WebSocket closed:", event.reason || event.code);
        console.log("reconnectRef", reconnectRef);
        if (!reconnectRef) {
          console.log("trying to reconnect");
          reconnectRef = setTimeout(
            connectWebSocket,
            RECONNECT_INTERVAL
          );
        }
        console.log("reconnectRef", reconnectRef);
        if (pingRef) {
          clearInterval(pingRef);
          pingRef = null;
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    // connect
    connectWebSocket();

    // cleanup
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (pingRef) clearInterval(pingRef);
      if (reconnectRef)
        clearTimeout(reconnectRef);
    };
  }, [userDetails?._id]);

  // Update unseen messages when chat list changes
  useEffect(() => {
    if (
      session &&
      userDetails?._id &&
      allChat.length &&
      socketRef.current?.readyState === WebSocket.OPEN
    ) {
      getUnseenMessages();
    }
  }, [allChat, pathName, session, userDetails?._id]);

  return (
    <motion.div
      initial={{ y: -30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl sm:block ${
        openChatMobile ? "hidden" : "block"
      } min-w-full max-w-full sm:max-w-[300px] sm:min-w-[300px]`}
    >
      <div
        className={`flex flex-col gap-4 sm:border-r sm:border-l sm:border-t sm:border-b border-gray-200 sm:max-h-[calc(100vh-59px)] sm:min-h-[calc(100vh-59px)] bg-white overflow-y-auto slider sm:max-w-[300px] sm:min-w-[300px] min-w-full max-w-full"
        } rounded-tl-xl rounded-bl-xl`}
      >
        {/* topbar */}
        <div className={`flex items-center gap-5 border-b-2 px-6 pt-2 pb-4`}>
          <Link
            href={`/`}
            className="h-8 w-8 cursor-pointer rounded-full border flex items-center justify-center mt-2"
          >
            <IoChevronBack className="text-xl" />
          </Link>
          <div className="text-black font-extrabold text-xl mt-2">Chat</div>
        </div>

        {/* allChat */}
        <div>
          {chatLoading && (
            <div className="flex justify-center items-center py-6">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
            </div>
          )}
          {!chatLoading && sockty && allChat?.length === 0 && (
            <div className="text-center">No chats</div>
          )}
          {!chatLoading && allChat?.length > 0 && sockty && (
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
                      dispatch(setOpenChatMobile(true));
                    }
                  }}
                  key={chit?._id}
                  className={`flex justify-between relative cursor-pointer hover:bg-gray-200 transition-all duration-200 px-6 py-3
                  border-b border-b-gray-200 ${
                    currentChatId === chit?._id ? "bg-gray-200" : ""
                  }`}
                >
                  {/* image, details */}
                  <div className="flex items-start gap-4">
                    <div className="">
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
                        className="rounded-full min-w-12 max-w-12 min-h-12 max-h-12 aspect-auto border-2 border-slate-300"
                      />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <div className="text-base font-medium text-wrap break-words">
                        {chit?.participants
                          ?.find((usr: any) => usr?._id !== userDetails?._id)
                          ?.username?.substring(0, 20)}
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
      </div>
    </motion.div>
  );
};

export default memo(ChatSidebar);

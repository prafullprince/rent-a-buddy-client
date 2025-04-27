/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */


"use client";
import { fetchAllChat, fetchUserDetailsById } from "@/service/apiCall/chat.api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { motion } from "framer-motion";

const ChatSidebar = ({ allChat, setAllChat, chatLoading }: any) => {

  // session
  const { data: session, status } = useSession();
  const router = useRouter();

  // state
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({});
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);
  const [socket, setSocket] = useState<any>(null);


  console.log("all chat", allChat);

  // fetchUserDetails
  const fetchUserDetails = async () => {
    try {
      const result = await fetchUserDetailsById(session?.serverToken);
      setUserDetails(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // handle websocket connection
  useEffect(() => {
    if (!session) return;
    const socket = new WebSocket("ws://localhost:4000");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onclose = () => console.log("WebSocket closed");
    socket.onerror = (error) => console.error("WebSocket Error", error);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
    };

    setSocket(socket);

    // memory cleanup
    return () => {
      socket.close();
    };
  }, [session]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserDetails();
    }
  }, [status]);

  if (status === "loading")
    return (
      <div className="flex flex-col gap-4 max-h-[820px] min-h-[820px] bg-white max-w-[300px] min-w-[300px] px-6 py-4">
        Loading....
      </div>
    );
  if (status === "unauthenticated") return <div>Unauthenticated</div>;
  if (!session) return <div>Session not found</div>;
  if (loading)
    return (
      <div className="flex flex-col gap-4 max-h-[820px] min-h-[820px] bg-white max-w-[300px] min-w-[300px]">
        Loadingss....
      </div>
    );

  return (
    <div className="rounded-xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.8 }}
        className={`flex flex-col gap-4 border-r-1 border-l-1 border-black max-h-[820px] min-h-[820px] bg-white ${
          isOpen ? "max-w-[300px] min-w-[300px]" : "max-w-[80px] min-w-[80px]"
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
            <div className="flex flex-col gap-4 border-r-1 border-l-1 border-black max-h-[820px] min-h-[820px] bg-white max-w-[300px] min-w-[300px]">
              Loading....
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
                    socket?.send(
                      JSON.stringify({
                        type: "markAsRead",
                        payload: {
                          chatId: chit?._id,
                          userId: userDetails?._id,
                        },
                      })
                    );

                    // navigate to chat
                    router.push(
                      `/chat/${chit?._id}/user/${
                        chit?.participants?.find(
                          (usr: any) => usr?._id !== userDetails?._id
                        )?._id
                      }`
                    );
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
                  {/* info */}

                  {/* unseen msg */}
                  {chit?.message?.length > 0 &&
                    chit?.message?.filter((msg: any) => {
                      return (
                        msg?.receiver === userDetails?._id &&
                        msg?.isSeen === false
                      );
                    }).length > 0 && (
                      <>
                        <div className="absolute top-4 right-8 text-xs text-gray-100 bg-red-500 rounded-full px-2 py-1 font-semibold flex items-center justify-center">
                          {chit?.message?.length > 0 &&
                            chit?.message?.filter((msg: any) => {
                              return (
                                msg?.receiver === userDetails?._id &&
                                msg?.isSeen === false
                              );
                            }).length}
                        </div>
                      </>
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

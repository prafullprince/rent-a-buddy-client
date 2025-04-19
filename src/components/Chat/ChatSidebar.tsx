"use client";
import { fetchAllChat, fetchUserDetailsById } from "@/service/apiCall/chat.api";
import { stat } from "fs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { motion } from 'framer-motion';

const ChatSidebar = () => {
  // session
  const { data: session, status } = useSession();
  console.log("session", session);
  const router = useRouter();

  // state
  const [allChat, setAllChat] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({});
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);
  console.log("userDetails", userDetails);
  console.log("allChat", allChat);

  // fetchAllChat
  const fetchAllChats = async () => {
    setLoading(true);
    try {
      const result = await fetchAllChat(session?.serverToken);
      setAllChat(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (status === "authenticated") {
      fetchAllChats();
      fetchUserDetails();
    }
  }, [status]);

  if (status === "loading") return <div className="flex flex-col gap-4 max-h-[820px] min-h-[820px] bg-white max-w-[300px] min-w-[300px] px-6 py-4">Loading....</div>;
  if (status === "unauthenticated") return <div>Unauthenticated</div>;
  if (!session) return <div>Session not found</div>;
  if (loading) return <div className="flex flex-col gap-4 max-h-[820px] min-h-[820px] bg-white max-w-[300px] min-w-[300px]">Loadingss....</div>;

  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.8 }}
      className={`flex flex-col gap-4 border-r-1 border-l-1 border-black max-h-[820px] min-h-[820px] bg-white ${isOpen ? "max-w-[300px] min-w-[300px]" : "max-w-[80px] min-w-[80px]"}`}>
        <div className={`flex items-center justify-between ${isOpen ? "px-6 py-2" : "px-4 py-2"}`}>
          {isOpen && <div className="text-black font-extrabold text-2xl mt-2">Chat</div>}
          <div onClick={()=>{
            setIsOpen(prev => !prev)
          }} className="cursor-pointer mt-2 bg-gray-100 hover:bg-gray-200 transition-all duration-300 rounded-lg px-2 py-2 ease-in-out">
            { isOpen ? <GoSidebarExpand className="text-2xl" /> : <GoSidebarCollapse className="text-3xl" /> }
          </div>
        </div>

        {/* allChat */}
        <div className="mt-2">
          {loading && <div className="flex flex-col gap-4 border-r-1 border-l-1 border-black max-h-[820px] min-h-[820px] bg-white max-w-[300px] min-w-[300px]">Loading....</div>}
          {!loading && allChat?.length === 0 && <div>No chats</div>}
          {!loading && allChat?.length > 0 && (
            <div className="flex flex-col">
              {allChat?.map((chit: any) => (
                <div
                  onClick={() => {
                    setCurrentChatId(chit?._id);
                    router.push(
                      `/chat/${chit?._id}/user/${
                        chit?.participants?.find(
                          (usr: any) => usr?._id !== userDetails?._id
                        )?._id
                      }`
                    );
                  }}
                  key={chit?._id}
                  className={`flex justify-between cursor-pointer hover:bg-gray-200 transition-all duration-200 ${isOpen ? "px-6 py-3" : "px-4 py-3"} border-b border-b-gray-200 ${
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
                      <div className="text-lg font-semibold text-wrap break-words">
                        {
                          chit?.participants?.find(
                            (usr: any) => usr?._id !== userDetails?._id
                          )?.username?.substring(0, 30)
                        }
                      </div>
                      <div className="text-sm text-gray-400 text-wrap break-words">
                        {/* {chit?.message[chit?.message.length - 1]?.text?.substring(0, 20)}.... */}
                      </div>
                    </div>
                  </div>
                  {/* info */}
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

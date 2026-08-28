/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setOpenChatMobile } from "@/redux/slice/chat.slice";
import { IoChevronBack } from "react-icons/io5";
import Link from "next/link";

const ChatSidebar = ({
  allChat,
  chatLoading,
  sockty,
  userDetails,
  numOfUnseenMessages
}: any) => {

  // hooks
  const router = useRouter();
  const dispatch = useDispatch();
  const { openChatMobile } = useSelector((state: any) => state.chat);

  // state
  const [currentChatId, setCurrentChatId] = useState<string>("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`h-full rounded-xl sm:block ${
        openChatMobile ? "hidden" : "block"
      } min-w-full max-w-full sm:max-w-[300px] sm:min-w-[300px]`}
    >
      <div
        className={`flex h-full flex-col gap-4 overflow-y-auto bg-black/70 slider sm:max-w-[300px] sm:min-w-[300px] min-w-full max-w-full sm:border-r sm:border-white/10"
        } lg:rounded-tl-xl lg:rounded-bl-xl`}
      >
        {/* topbar */}
          <div className={`flex items-center gap-5 border-b border-white/10 px-6 pb-4 pt-4`}>
          <Link
            href={`/`}
            className="mt-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 transition-colors hover:bg-white/10"
          >
            <IoChevronBack className="text-xl text-white/90" />
          </Link>
          <div className="text-xl font-semibold text-white/90">Messages</div>
        </div>

        {/* allChat */}
        <div>
          {chatLoading && (
            <div className="flex justify-center items-center py-6">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-white/80 border-t-transparent"></div>
            </div>
          )}
          {!chatLoading && sockty && allChat?.length === 0 && (
            <div className="px-6 text-sm leading-6 text-white/45">No chats yet. Request an order to start a conversation.</div>
          )}
          {!chatLoading && allChat?.length > 0 && sockty && (
            <div className="flex flex-col">
              {allChat?.map((chit: any) => (
                <div
                  onClick={() => {
                    setCurrentChatId(chit?._id);

                    // mark as read
                    sockty?.emit("markAsRead", {
                      chatId: chit?._id,
                      current: userDetails?._id,
                      other: chit?.participants?.find(
                        (usr: any) => usr?._id !== userDetails?._id
                      )?._id
                    })

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
                  className={`relative flex cursor-pointer justify-between border-b border-white/10 px-6 py-4 transition-all duration-200 hover:bg-white/[0.08]
                  ${
                    currentChatId === chit?._id ? "bg-amber-300/10" : ""
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
                        className="rounded-full min-w-12 max-w-12 min-h-12 max-h-12 aspect-auto border-2 border-slate-800"
                      />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <div className="text-base font-medium text-wrap break-words text-white/90">
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

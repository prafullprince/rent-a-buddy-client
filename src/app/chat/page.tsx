/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const { openChatMobile } = useSelector((state: any) => state.chat);
  // const router = useRouter();
  console.log("openChatMobile: ", openChatMobile);

  // if(openChatMobile) {
  // }

  return (
    <div className="flex flex-col items-start rounded-xl max-w-full border border-r">
      {/* Message Box */}
      <div className="w-full">
        <div
          className="max-h-[calc(100dvh-120px)] min-h-[calc(100dvh-120px)] sm:max-h-[calc(100dvh-60px)] sm:min-h-[calc(100dvh-60px)] p-4 overflow-y-auto overflow-hidden relative bg-white flex justify-center items-center"
          // style={{ backgroundImage: `url(${whatsappImg.src})` }}
        >
          <div className="flex flex-col gap-3 items-center bg-slate-300 p-6 rounded-xl">
            <div className="text-black font-semibold text-xl">Order Request</div>
            <div className="text-black font-semibold text-sm">Or</div>
            <div className="text-black font-semibold text-xl">Select chat to continue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

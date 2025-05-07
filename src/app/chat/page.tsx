/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useSelector } from "react-redux";
import whatsappImg from "../../../public/assets/whatsapp.jpg";

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
          className="max-h-[calc(100dvh-120px)] min-h-[calc(100dvh-120px)] sm:max-h-[calc(100dvh-180px)] sm:min-h-[calc(100dvh-180px)] p-4 overflow-y-auto overflow-hidden bg-gray-800 relative"
          style={{ backgroundImage: `url(${whatsappImg.src})` }}
        ></div>
      </div>
    </div>
  );
};

export default ChatPage;

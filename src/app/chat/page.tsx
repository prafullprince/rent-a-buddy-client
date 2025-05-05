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
          className="max-h-[720px] min-h-[720px] p-4 overflow-auto bg-gray-800 bg-center bg-cover border rounded-tr-xl rounded-br-xl border-gray-100"
          style={{ backgroundImage: `url(${whatsappImg.src})` }}
        ></div>
      </div>
    </div>
  );
};

export default ChatPage;

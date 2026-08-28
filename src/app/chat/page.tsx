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
    <div className="flex h-full max-w-full flex-col items-start rounded-xl border border-white/10 bg-[#0d1117]">
      {/* Message Box */}
      <div className="w-full">
        <div
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-y-auto overflow-hidden bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_34%),#090b10] p-4"
          // style={{ backgroundImage: `url(${whatsappImg.src})` }}
        >
          <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">Your conversations</div>
            <div className="text-2xl font-semibold text-white">Choose a chat</div>
            <div className="text-sm leading-6 text-white/50">Select a conversation from the left to continue.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

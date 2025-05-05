/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react'
import { useSelector } from 'react-redux';

const ChatPage = () => {

  const { openChatMobile } = useSelector((state: any) => state.chat);
  // const router = useRouter();
  console.log("openChatMobile: ", openChatMobile);

  // if(openChatMobile) {
  // }

  return ( 
    <div className={`h-full w-full`}>
        <div className='flex flex-col items-start'>
            {/* topbar */}
            hii there
            {/* chat */}
            {/* message */}
        </div>
    </div>
  )
}

export default ChatPage

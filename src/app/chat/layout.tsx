/* eslint-disable @typescript-eslint/no-explicit-any */


import ChatSidebar from '@/components/Chat/ChatSidebar'
import { NextAuthOption } from '@/utills/nextauthoption.utills'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

const layout = async ({children}:{children:any}) => {

  const session = await getServerSession(NextAuthOption);

  if(!session) {
    return redirect('/login')
  }

  return (
    <div className='bg-green-900 flex justify-center items-center'>
        <div className='w-[90%] lg:w-[80%] mx-auto pt-4 flex rounded-xl'>
            <ChatSidebar />
            <div className='h-screen flex-1 rounded-xl'>{children}</div>
        </div>
    </div>
  )
}

export default layout

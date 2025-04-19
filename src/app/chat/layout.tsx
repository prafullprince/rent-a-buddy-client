import ChatSidebar from '@/components/Chat/ChatSidebar'
import React from 'react'

const layout = ({children}:{children:any}) => {
  return (
    <div className='bg-green-900 flex justify-center items-center'>
        <div className='w-[90%] lg:w-[80%] mx-auto pt-4 flex'>
            <ChatSidebar />
            <div className='h-screen flex-1'>{children}</div>
        </div>
    </div>
  )
}

export default layout

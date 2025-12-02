"use client";
import CreatePost from '@/components/Dashboard/post/CreatePost';
import { useRouter } from 'next/navigation';
import React from 'react'

const Page = () => {
    const router = useRouter();
  return (
    <div className='w-full mx-auto flex flex-col px-6'>
        {/* route */}
      <div className="mt-1 pt-4">
        <div className="flex items-center gap-2 ml-12 mt-2 lg:mt-0 lg:ml-0">
          <div
            onClick={() => router.push("/")}
            className="text-sm font-semibold text-[#d5d6da] cursor-pointer"
          >
            Home <span>/</span>
          </div>
          <div
            onClick={() => router.push("/dashboard/my-profile")}
            className="text-sm text-[#d5d6da] cursor-pointer"
          >
            Dashboard <span>/</span>
          </div>
          <span className="text-sm font-semibold text-yellow-600">
            Create Post 
          </span>
        </div>
      </div>

      {/*  */}
      <CreatePost />
    </div>
  )
}

export default Page

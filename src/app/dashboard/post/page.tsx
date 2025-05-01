"use client";
import CreatePost from '@/components/Dashboard/post/CreatePost';
import { useRouter } from 'next/navigation';
import React from 'react'

const Page = () => {
    const router = useRouter();
  return (
    <div className='w-full mx-auto flex flex-col px-6'>
        {/* route */}
      <div className="mt-4 pt-4">
        <div className="flex items-center gap-2">
          <div
            onClick={() => router.push("/")}
            className="text-xs text-[#838894] cursor-pointer"
          >
            Home <span>/</span>
          </div>
          <div
            onClick={() => router.push("/dashboard/my-profile")}
            className="text-xs text-[#838894] cursor-pointer"
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

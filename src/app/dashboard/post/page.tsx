"use client";
import CreatePost from '@/components/Dashboard/post/CreatePost';
import { useRouter } from 'next/navigation';
import React from 'react'

const Page = () => {
    const router = useRouter();
  return (
    <div className='min-h-screen w-full bg-[#090b10] bg-[linear-gradient(135deg,rgba(245,158,11,0.08)_0%,transparent_30%,transparent_70%,rgba(20,184,166,0.06)_100%)] px-4 py-5 text-white sm:px-6 lg:px-10'>
        {/* route */}
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        <div className="flex items-center gap-2 text-sm">
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer font-semibold text-white/45 transition-colors hover:text-amber-200"
          >
            Home <span>/</span>
          </div>
          <div
            onClick={() => router.push("/dashboard/my-profile")}
            className="cursor-pointer text-white/45 transition-colors hover:text-amber-200"
          >
            Dashboard <span>/</span>
          </div>
          <span className="font-semibold text-amber-300">Create post</span>
        </div>
      </div>

      {/*  */}
      <CreatePost />
    </div>
  )
}

export default Page

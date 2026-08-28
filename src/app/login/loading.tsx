import React from 'react'

const loading = () => {
  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center bg-[#090b10] px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.06] p-10 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="h-16 w-16 animate-pulse rounded-2xl bg-amber-300/20" />
        <div className="h-5 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="h-3 w-28 animate-pulse rounded-full bg-white/10" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-white/10" />
      </div>
    </div>
  )
}

export default loading

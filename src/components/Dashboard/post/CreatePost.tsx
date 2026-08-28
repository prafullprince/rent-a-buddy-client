import React from "react";
import PostForm from "./PostForm";

const CreatePost = () => {
  return (
    <div className="mt-8 w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 lg:p-8">
      <div className="flex w-full flex-col gap-2">
        {/* heading */}
        <div className="">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Community</p>
          <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Create a post</h1>
          <p className="mt-1 text-sm text-white/50">Share a moment with the RentABuddy community.</p>
        </div>

        <PostForm />
      </div>
    </div>
  );
};

export default CreatePost;

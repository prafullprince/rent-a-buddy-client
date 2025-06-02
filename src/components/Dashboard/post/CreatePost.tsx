import React from "react";
import PostForm from "./PostForm";

const CreatePost = () => {
  return (
    <div className="bg-gray-100 w-fit mt-8 rounded-lg p-4 shadow-md">
      <div className="flex flex-col gap-2 sm:w-full max-w-fit">
        {/* heading */}
        <div className="">
          <h2 className="text-xl font-bold text-slate-700">Create Post</h2>
        </div>

        <PostForm />
      </div>
    </div>
  );
};

export default CreatePost;

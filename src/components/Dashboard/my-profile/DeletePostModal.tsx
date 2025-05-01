/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import { deletePostByIdApiCall } from "@/service/apiCall/user.api";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const DeletePostModal = ({ modalData, setModalData, session, setPosts, posts }: any) => {

  // hook
  const btnRef = useRef<HTMLDivElement | null>(null);

  //   state
  const [loading, setLoading] = useState(false);

  //   function deleteHandler() {
  async function deleteHandler() {
    if (modalData) {
      setLoading(true);
      try {
        await deletePostByIdApiCall(session?.serverToken, modalData?.postId);
        setPosts(posts.filter((post: any) => post?._id !== modalData?.postId));
        setModalData(null);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setModalData(null);
      }
    }
  }

  // sideEffect
  useEffect(() => {
    function clickOutsideHandler(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setModalData(null);
      }
    }
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] backdrop-blur-sm overflow-y-auto">
      <div className="flex items-center justify-center h-screen mx-auto">
        <div
          ref={btnRef}
          className="flex flex-col gap-2 bg-slate-800 p-6 relative border-slate-400 rounded-lg w-[300px] sm:w-[400px] lg:w-[500px]"
        >
          {/* heading */}
          <div className="bg-slate-700 font-semibold text-pink-100 rounded-t-lg text-xl absolute top-0 w-full right-0 left-0 h-12 flex items-center justify-between px-6">
            Post delete
            <button
              onClick={() => {
                setModalData(null);
              }}
              className="text-2xl text-pink-300 cursor-pointer"
            >
              X
            </button>
          </div>

          {/* text */}
          <div className="mt-2">
            <p className="text-slate-50 mt-8 text-2xl">
              Are you sure you want to delete this post?
            </p>
            <p className="text-slate-200 text-sm mt-1">
              you can create new post later
            </p>
          </div>

          {/* buttons */}
          <div className="flex w-full justify-start gap-4 mt-4">
            <motion.button
              onClick={() => {
                deleteHandler();
              }}
              className="px-4 py-1 bg-yellow-400 text-slate-900 text-lg font-medium rounded-lg cursor-pointer flex items-center gap-2"
              layoutId="delete"
            >
              Delete
              {loading && (
                <div className="flex justify-center items-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
                </div>
              )}
            </motion.button>

            <button
              onClick={() => {
                setModalData(null);
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;

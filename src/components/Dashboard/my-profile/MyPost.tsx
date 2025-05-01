/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import {
  fetchUserDetailsById,
  getPostsByUserApiCall,
} from "@/service/apiCall/user.api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import DeletePostModal from "./DeletePostModal";

const MyPost = ({ type }: any) => {
  // hook
  const { data: session } = useSession();

  // state
  const [posts, setPosts] = useState<any>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    async function fetchUser() {
      const response = await fetchUserDetailsById(session?.serverToken);
      setUserDetails(response);
    }
    fetchUser();
  }, [session]);

  useEffect(() => {
    if (!session || !userDetails?._id) return;
    async function fetchPosts() {
      setLoading(true);
      try {
        const response = await getPostsByUserApiCall(
          userDetails?._id,
          session?.serverToken
        );
        setPosts(response?.posts);
      } catch (error) {
        console.log("error is:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [session, userDetails]);

  if (!session)
    return (
      <div className="flex justify-center items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
      </div>
    );

  return (
    <div className="w-full max-w-xl">
      <h2 className="text-xl mt-8 font-semibold text-black">Gallery</h2>
      <div className="flex gap-4 items-center mt-6 flex-wrap">
        {loading && (
          <div className="flex justify-center items-center w-full h-48">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
          </div>
        )}
        {!loading &&
          posts?.map((post: any) => {
            return (
              <div key={post?._id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 relative">
                  <Image
                    src={post?.imageUrl}
                    alt="profile"
                    width={300}
                    height={300}
                    className="sm:min-w-[260px] sm:min-h-[220px] sm:max-h-[220px] sm:max-w-[260px] min-w-[220px] min-h-[220px] max-w-[300px] max-h-[260px] rounded-sm bg-center bg-cover flex-1 justify-center sm:block"
                  />
                  {type == "user" && post?.user === userDetails?._id && (
                    <div
                      className="absolute bottom-4 right-3 rounded-full bg-slate-700 flex items-center justify-center w-10 h-10"
                      onClick={() => {
                        setModalData({
                          postId: post?._id,
                        });
                      }}
                    >
                      <MdDelete className="text-2xl text-red-400 hover:text-red-500 transition-all duration-300 cursor-pointer" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      {modalData && (
        <DeletePostModal
          modalData={modalData}
          setModalData={setModalData}
          session={session}
          setPosts={setPosts}
          posts={posts}
        />
      )}
    </div>
  );
};

export default MyPost;

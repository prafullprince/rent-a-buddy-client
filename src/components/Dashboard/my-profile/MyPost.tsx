/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import {
  fetchUserDetailsById,
  getPostsByUserApiCall,
} from "@/service/apiCall/user.api";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import DeletePostModal from "./DeletePostModal";
import PostSlider from "@/components/Common/PostSlider";

const MyPost = ({ type, eventDetails }: any) => {
  // hook
  const { data: session } = useSession();
  console.log("type", type);
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
          eventDetails?.user?._id,
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
    <div className="w-full sm:max-w-xl">
      <h2 className="text-xl mt-8 font-semibold text-black">Gallery</h2>
      <div className="flex gap-4 items-center mt-6 flex-wrap">
        {loading && (
          <div className="flex justify-center items-center w-full h-48">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
          </div>
        )}
        {!loading &&
          <PostSlider posts={posts} setModalData={setModalData} userDetails={userDetails} session={session} type="user" />
        }
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

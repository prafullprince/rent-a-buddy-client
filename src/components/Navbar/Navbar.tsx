/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Logo from "@/assets/logoHomeIcon.png"
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { LuMessageCircleMore } from "react-icons/lu";
import { fetchUserDetailsById } from "@/service/apiCall/user.api";

const Navbar = () => {
  // session
  const { data: session, status } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // state
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  const [userDetails, setUserDetails] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [totalUnseenMessages, setTotalUnseenMessages] = useState<number>(0);

  // fetchUserDetails
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const result = await fetchUserDetailsById(session?.serverToken);
        setUserDetails(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  // click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // fetchUserDetails
  useEffect(() => {
    fetchUserDetails();
  }, [session]);

  // handle websocket connection
  useEffect(() => {
    if(!session) return;

    const socket = new WebSocket("wss://rent-a-buddy-server-1.onrender.com");

    socket.onopen = () => {
      console.log("WebSocket connected");
      
      // no of unseen messages
      socket.send(
        JSON.stringify({
          type: "unseenMessages",
          payload: {
            userId: userDetails?._id,
          }
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data", data);

      // handle unseen messages
      if (data.type === "numOfUnseenMessages") {
        console.log("unseenMessages", data.payload);
        setTotalUnseenMessages(data.payload.totalMessages);
      }
    };

    socket.onclose = () => console.log("WebSocket closed");
    socket.onerror = (error) => console.error("WebSocket Error", error);

    setSocket(socket);
    return () => {
      socket.close();
    };
  }, [session, userDetails?._id]);

  if(status === "loading" || loading) {
    // spinner
    return (
      <div className="w-full h-20 flex items-center justify-center">
        <div className="loader1"></div>
      </div>
    ) 
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-[#ffffff] text-black h-16 flex items-center justify-center shadow-md"
    >
      {/* content div */}
      <div className="flex items-center justify-between w-full sm:max-w-[90%] lg:max-w-[80%] px-1 py-2 mx-auto">
        {/* logo */}
        <Link href="/">
          <Image
            src={Logo}
            alt="Logo"
            width={60}
            height={60}
            priority
            className="bg-transparent"
          />
        </Link>

        {/* links */}

        {/* buttons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Be Buddy Button */}
          {session?.accountType !== "Buddy" && (
            <div className="border-0 rounded-lg cursor-pointer bg-black text-white px-4 py-[8px] flex items-center gap-2 hover:shadow-md hover:shadow-black duration-300 transition-all">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border-white border-2">
              <FaStar className="text-xs" />
            </div>
            <p className="text-lg font-medium hidden md:block">Be a Buddy</p>
          </div>
          )}

          {/* Category Icon
          <div>
            <TbCategoryPlus className="text-3xl cursor-pointer" />
          </div> */}

          {/* chat */}
          {session && status === "authenticated" && (
            <Link href={'/chat/null/user/null'} className="relative">
              <LuMessageCircleMore className="text-3xl font-bold cursor-pointer" />
              {totalUnseenMessages > 0 && <div className="absolute top-0 right-0 translate-x-1.5 text-white -translate-y-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-sm">{totalUnseenMessages}</div>}
            </Link>
          )}

          {/* notification */}
          {session && status === "authenticated" && (
            <div>
              <IoMdNotificationsOutline className="text-3xl font-bold cursor-pointer" />
            </div>
          )}


          {/* Auth Link */}
          {session && status === "authenticated" ? (
            <div
              className="rounded-full border-2 p-[2px] cursor-pointer relative"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <Image
                src={session?.user?.image}
                alt="user"
                width={40}
                height={40}
                priority
                className="rounded-full min-w-10 min-h-10"
              />

              <AnimatePresence>
              {
                  isOpen && (
                  <motion.div
                    className="absolute top-16 right-0 shadow-md rounded-lg p-2 w-[120px] z-[1000] bg-slate-800 text-white"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0, y: -50 }}
                    key={"dropdown"}
                  >
                    <div
                      ref={dropdownRef}
                      className="flex flex-col gap-2 items-start px-2 py-1"
                    >
                      <Link href={'/dashboard/my-profile'} className="cursor-pointer">Dashboard</Link>
                      <button
                        className="cursor-pointer"
                        onClick={() => signOut()}
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                  )
                }
                </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-[8px] hover:shadow-md hover:shadow-black font-semibold text-lg cursor-pointer hover:border-amber-50 transition-all duration-300 bg-black text-white rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;

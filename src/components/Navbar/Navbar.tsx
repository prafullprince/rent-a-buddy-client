/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Logo3 from "@/assets/logo3a.png";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { LuMessageCircleMore } from "react-icons/lu";
import { fetchUserDetailsById } from "@/service/apiCall/user.api";
import { useDispatch, useSelector } from "react-redux";
import { setTotalUnseenMessages } from "@/redux/slice/chat.slice";
import { RiDashboardHorizontalFill, RiLogoutBoxFill } from "react-icons/ri";
import Information from "./Information";

const Navbar = () => {
  // session
  const { data: session, status } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const PING_INTERVAL = 25000; // 25 seconds
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const RECONNECT_INTERVAL = 3000;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketref = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();
  const { totalUnseenMessages } = useSelector((state: any) => state.chat);

  // state
  const [isOpen, setIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({});

  // fetchUserDetails
  const fetchUserDetails = async () => {
    try {
      const result = await fetchUserDetailsById(session?.serverToken);
      setUserDetails(result);
    } catch (error) {
      console.log(error);
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
    if (!session) return;
    fetchUserDetails();
  }, [session]);

  // handle websocket connection
  useEffect(() => {
    if (!session || !userDetails?._id) return;

    let socket: WebSocket;

    const connectWebSocket = () => {
      socket = new WebSocket("wss://rent-a-buddy-server-1.onrender.com");
      socketref.current = socket;

      // on open
      socket.onopen = () => {
        console.log("socket open");

        // Start pinging
        pingIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "ping" }));
          }
          socket.send(
            JSON.stringify({
              type: "unseenMessages",
              payload: {
                userId: userDetails?._id,
              },
            })
          );
        }, PING_INTERVAL);

        // reconnect
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }

        // no of unseen messages
        socket.send(
          JSON.stringify({
            type: "unseenMessages",
            payload: {
              userId: userDetails?._id,
            },
          })
        );
      };

      // on close
      socket.onclose = (event) => {
        console.log("❌ WebSocket closed", event.reason || event.code);

        // Schedule reconnection
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("🔁 Attempting to reconnect...from order modal");
            connectWebSocket();
          }, RECONNECT_INTERVAL);
        }

        // Stop pinging
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("data", data);

        // handle unseen messages
        if (data.type === "numOfUnseenMessages") {
          console.log("unseenMessages", data.payload);
          dispatch(setTotalUnseenMessages(data.payload.totalMessages));
        }
      };

      // on error
      socket.onerror = (error) => {
        console.log("socket error", error);
      };
    };
    connectWebSocket();

    // memory cleanup
    return () => {
      if (socketref.current) {
        socketref.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [session, userDetails?._id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="relative z-[1000] mx-auto my-3 flex min-h-14 w-[92%] max-w-7xl items-center justify-center overflow-visible rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.09] via-black/40 to-black/20 text-black shadow-xl shadow-black/20 backdrop-blur-xl backdrop-saturate-150 sm:my-4 sm:w-[90%] lg:min-h-[60px] lg:w-[88%]"
    >
      {/* content div */}
      <div className="mx-auto flex w-full items-center justify-between gap-2 px-3 py-2 sm:w-[98%] sm:px-1">
        {/* logo */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <Link href="/" aria-label="Go to home" className="shrink-0">
            <Image
              src={Logo3}
              alt="Logo"
              width={40}
              height={40}
              priority
              className="h-9 w-9 bg-transparent object-contain sm:h-10 sm:w-10"
            />
          </Link>

          {/* links */}
          <Information />
        </div>

        {/* buttons */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-6">
          {/* loading */}
          <div className="hidden pr-2 sm:block sm:pr-4">
            {!session && status === "loading" && (
              <div className="flex justify-center items-center py-6">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
              </div>
            )}
          </div>

          {/* Be Buddy */}
          {session && session?.accountType !== "Buddy" && (
            <div className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-amber-300 px-2 py-2 text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-200 hover:shadow-md hover:shadow-amber-300/20 md:px-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black/70">
                <FaStar className="text-xs" />
              </div>
              <p className="text-sm font-medium hidden md:block">Be a Buddy</p>
            </div>
          )}

          {/* chat */}
          {session && status === "authenticated" && (
            <Link href={`/chat`} aria-label="Open chats" className="relative rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              <LuMessageCircleMore className="cursor-pointer text-2xl font-semibold sm:text-3xl" />
              {totalUnseenMessages > 0 && (
                <div className="absolute top-0 right-0 translate-x-1.5 text-white -translate-y-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-sm">
                  {totalUnseenMessages}
                </div>
              )}
            </Link>
          )}

          {/* notification */}
          {session && status === "authenticated" && (
            <div aria-label="Notifications" className="rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              <IoMdNotificationsOutline className="cursor-pointer text-2xl font-bold sm:text-3xl" />
            </div>
          )}

          {/* Auth Link */}
          {session && status === "authenticated" && (
            <div
              ref={dropdownRef}
              className="relative rounded-full border-2 border-white/10 p-[2px]"
            >
              <button
                type="button"
                aria-label="Open profile menu"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((isOpen) => !isOpen)}
                className="block cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <Image
                  src={session?.user?.image}
                  alt="user"
                  width={30}
                  height={30}
                  priority
                  className="h-8 w-8 rounded-full object-cover"
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+0.75rem)] z-[9999] w-44 rounded-xl border border-white/10 bg-slate-100 p-2 text-sm font-semibold text-slate-700 shadow-2xl shadow-black/40 transition-all duration-200 hover:text-slate-900"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1 }}
                    exit={{ opacity: 0, y: -50 }}
                    key={"dropdown"}
                  >
                    <div
                      className="z-[1000] flex flex-col items-start gap-1 px-2 py-1"
                    >
                      <Link
                        href={"/dashboard/my-profile"}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-black/5"
                      >
                        <RiDashboardHorizontalFill className="text-xl" />
                        Dashboard
                      </Link>
                      <button
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-black/5"
                        onClick={() => signOut()}
                      >
                        <RiLogoutBoxFill className="text-xl font-semibold" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {!session && status === "unauthenticated" && (
            <Link
              href="/login"
              className="cursor-pointer rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-amber-300/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 sm:px-6 sm:py-[10px]"
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

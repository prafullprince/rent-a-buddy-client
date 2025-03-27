"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/—Pngtree—cabin rental logo design vector_5901911.png";
import { FaStar } from "react-icons/fa";
import { TbCategoryPlus } from "react-icons/tb";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { IoMdNotificationsOutline } from "react-icons/io";

const Navbar = () => {
  // session
  const { data: session, status } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // state
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-[#ffffff] text-black h-16 flex items-center justify-center shadow-md"
    >
      {/* content div */}
      <div className="flex items-center justify-between w-full max-w-[90%] lg:max-w-[80%] px-4 py-2 mx-auto">
        {/* logo */}
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={60}
            height={60}
            priority
            className="bg-transparent"
          />
        </Link>

        {/* links */}

        {/* buttons */}
        <div className="flex items-center gap-6">
          {/* Be Buddy Button */}
          <div className="border-0 rounded-lg cursor-pointer bg-black text-white px-3 py-[6px] flex items-center gap-2 hover:shadow-md hover:shadow-black duration-300 transition-all">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border-white border-2">
              <FaStar className="text-xs" />
            </div>
            <p className="text-lg font-medium">Be a Buddy</p>
          </div>

          {/* Category Icon */}
          <div>
            <TbCategoryPlus className="text-3xl cursor-pointer" />
          </div>

          {/* notification */}
          {session && status === "authenticated" && (
            <div>
              <IoMdNotificationsOutline className="text-3xl font-bold cursor-pointer" />
            </div>
          )}

          {/* chat */}

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
                className="rounded-full"
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
              className="px-3 py-[4px] hover:shadow-md hover:shadow-black font-semibold text-lg cursor-pointer hover:border-amber-50 transition-all duration-300 bg-black text-white rounded-md"
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

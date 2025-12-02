/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { dashboardLinks } from "@/data/dashboard";
import React, { useState } from "react";
import SidebarLink from "./SidebarLink";
import {
  BsLayoutSidebarInset,
  BsLayoutSidebarInsetReverse,
} from "react-icons/bs";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral-950 min-h-screen relative rounded-xl text-gray-100"
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-4 left-4 cursor-pointer px-2 py-2 rounded-lg transition-all duration-200 text-xl ${isOpen ? '' : ''}`}
      >
        {!isOpen ? (
          <BsLayoutSidebarInset className="text-3xl text-slate-400 hover:text-yellow-400 transition-all duration-300" />
        ) : (
          <BsLayoutSidebarInsetReverse className="text-3xl text-yellow-600" />
        )}
      </div>

      {/* sidebar content box */}
      <div className={`flex flex-col gap-3 items-start ${isOpen ? "px-4 py-4 pt-28" : "sm:px-4 sm:py-4 sm:pt-28"}`}>
        {dashboardLinks?.map((link: any) => {
          if(link?.type && link?.type !== session?.accountType) return null;
          return (
            <SidebarLink key={link?.id} link={link} isOpen={isOpen} />
          )
        } )}
      </div>
    </motion.div>
  );
};

export default Sidebar;

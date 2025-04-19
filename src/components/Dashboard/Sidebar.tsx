"use client";
import { dashboardLinks } from "@/data/dashboard";
import React, { useState } from "react";
import SidebarLink from "./SidebarLink";
import { RiSideBarFill } from "react-icons/ri";
import {
  BsLayoutSidebar,
  BsLayoutSidebarInset,
  BsLayoutSidebarInsetReverse,
} from "react-icons/bs";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      className="bg-zinc-200 min-h-screen relative"
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-2 left-4 cursor-pointer px-2 py-2 rounded-lg hover:bg-slate-400 transition-all duration-200 text-xl"
      >
        {!isOpen ? (
          <BsLayoutSidebarInset className="text-3xl text-slate-700" />
        ) : (
          <BsLayoutSidebarInsetReverse className="text-3xl text-yellow-600" />
        )}
      </div>

      {/* sidebar content box */}
      <div className="flex flex-col gap-4 items-start px-4 py-4 pt-24">
        {dashboardLinks?.map((link: any) => (
          <SidebarLink key={link?.id} link={link} isOpen={isOpen} />
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;

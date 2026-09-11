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
      className={`relative min-h-0 w-full shrink-0 rounded-2xl border border-white/10 bg-[#0d1117] text-gray-100 shadow-xl shadow-black/20 transition-[width] duration-300 lg:min-h-screen ${
        isOpen ? "lg:w-64" : "lg:w-20"
      }`}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Collapse dashboard navigation" : "Expand dashboard navigation"}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setIsOpen(!isOpen);
        }}
        className="absolute left-3 top-4 z-10 cursor-pointer rounded-xl p-2 text-xl transition-all duration-200 hover:bg-white/10"
      >
        {!isOpen ? (
          <BsLayoutSidebarInset className="text-2xl text-slate-400 transition-all duration-300 hover:text-amber-300" />
        ) : (
          <BsLayoutSidebarInsetReverse className="text-2xl text-amber-300" />
        )}
      </div>

      {/* sidebar content box */}
      <div className="flex w-full flex-row items-start gap-2 overflow-x-auto px-2 py-4 pt-16 sm:px-3 lg:flex-col lg:pt-24">
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

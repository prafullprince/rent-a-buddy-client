/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";


const SidebarLink = ({ link, isOpen }: { link: any, isOpen: boolean }) => {
  const pathname = usePathname(); // ✅ Get pathname once
  
  const isActive = pathname === link.path; // ✅ Check match directly

  return (
    <Link
      href={link.path}
      className={`rounded-lg hover:bg-zinc-500 transition-all duration-200 ${
        isActive ? "bg-yellow-900 text-yellow-300" : ""
      } ${isOpen ? 'px-3 py-[12px] sm:min-w-[200px] sm:max-w-[200px] min-w-[38px]' : 'px-3 py-[12px] hidden sm:block sm:min-w-[38px]'}`}
    >
      <div className="flex items-center gap-3 duration-300 transition-all text-xl lg:text-2xl">
        {link.icon}
        {isOpen ? <p className="text-sm hidden sm:block">{link.name}</p> : ""}
      </div>
    </Link>
  );
};

export default SidebarLink;

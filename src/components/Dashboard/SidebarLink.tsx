/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";


const SidebarLink = ({ link, isOpen }: { link: any, isOpen: boolean }) => {
  const pathname = usePathname(); // ✅ Get pathname once
  
  const isActive = pathname === link.path || pathname.startsWith(`${link.path}/`);

  return (
    <Link
      href={link.path}
      aria-label={link.name}
      title={!isOpen ? link.name : undefined}
      className={`group flex min-h-11 items-center rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-amber-300/15 text-amber-200 shadow-inner shadow-amber-300/10"
          : "text-white/55 hover:bg-white/[0.08] hover:text-white"
      } ${isOpen ? "w-full px-3" : "w-11 justify-center px-2"}`}
    >
      <div className="flex items-center gap-3 text-xl transition-all duration-300 lg:text-2xl">
        {link.icon}
        {isOpen ? <p className="text-sm font-medium">{link.name}</p> : ""}
      </div>
    </Link>
  );
};

export default SidebarLink;

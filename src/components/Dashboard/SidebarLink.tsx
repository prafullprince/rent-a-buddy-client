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
      } ${isOpen ? 'px-4 py-[6px] min-w-[200px] max-w-[200px]' : 'px-4 py-[6px] min-w-[60px]'}`}
    >
      <div className="flex items-center gap-3 duration-300 transition-all text-2xl">
        {link.icon}
        {isOpen ? <p className="text-base">{link.name}</p> : ""}
      </div>
    </Link>
  );
};

export default SidebarLink;

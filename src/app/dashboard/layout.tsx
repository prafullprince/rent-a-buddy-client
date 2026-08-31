/* eslint-disable @typescript-eslint/no-explicit-any */


import Sidebar from "@/components/Dashboard/Sidebar";
import { NextAuthOption } from "@/utills/nextauthoption.utills";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({ children }: { children: any }) => {

  const session = await getServerSession(NextAuthOption);

  if(!session) {
    return redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-[90%] flex-col gap-2 rounded-xl bg-neutral-900 mx-auto lg:w-[82%] lg:flex-row lg:items-stretch">
      <Sidebar />
      <div className="w-full min-w-0 min-h-screen">{children}</div>
    </div>
  );
};

export default layout;

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
    <div className="flex gap-2 items-stretch min-h-screen w-full mx-auto">
      <Sidebar />
      <div className="w-full min-h-screen">{children}</div>
    </div>
  );
};

export default layout;

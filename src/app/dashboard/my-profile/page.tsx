import MyEvents from "@/components/Dashboard/my-profile/MyEvents";
import UserDetails from "@/components/Dashboard/my-profile/UserDetails";
import { NextAuthOption } from "@/utills/nextauthoption.utills";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";

const page = async () => {
  const session = await getServerSession(NextAuthOption);

  if (!session)
    return (
      <div className="flex justify-center items-center py-6">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-white/90 border-t-transparent"></div>
      </div>
    );

  return (
    <div className="min-h-screen overflow-hidden bg-[#090b10] bg-[linear-gradient(135deg,rgba(245,158,11,0.08)_0%,transparent_30%,transparent_70%,rgba(20,184,166,0.06)_100%)] px-4 py-5 text-white sm:px-6 lg:px-10">
      {/* topbar */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        {/* route */}
        <div className="flex items-center gap-2 text-sm">
          <Link href={"/"} className="text-white/45 transition-colors hover:text-amber-200">
            Home <span>/</span>
          </Link>
          <Link
            href={"/dashboard/my-profile"}
            className="text-white/45 transition-colors hover:text-amber-200"
          >
            Dashboard <span>/</span>
          </Link>
          <span className="font-semibold text-amber-300">
            My Profile
          </span>
        </div>

        {/* title */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Account center</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">My Profile</h1>
          <p className="mt-2 text-sm text-white/50">Manage your identity and the experiences you offer.</p>
        </div>

        {/* profile */}
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-8">
          {/* profile image */}
          <UserDetails />

          {/* my-Events */}
          {session?.accountType === "Buddy" && <MyEvents />}
        </div>

        {/* posts */}
        {/* {session?.accountType === "Buddy" && <MyPost type="user" />} */}
      </div>
    </div>
  );
};

export default page;

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
    <div className="p-4">
      {/* topbar */}
      <div className="flex flex-col gap-4 mt-2">
        {/* route */}
        <div className={`flex items-center gap-2 ml-12 mt-1 lg:mt-0 lg:ml-0`}>
          <Link href={"/"} className="text-sm text-[#d5d6da]">
            Home <span>/</span>
          </Link>
          <Link
            href={"/dashboard/my-profile"}
            className="text-sm text-[#d5d6da]"
          >
            Dashboard <span>/</span>
          </Link>
          <Link href={""} className="text-base font-semibold text-yellow-600">
            My Profile
          </Link>
        </div>

        {/* title */}
        <h2 className="text-xl mt-3 font-semibold text-white/80">My Profile</h2>

        {/* profile */}
        <div className="flex flex-col gap-4 max-w-lg sm:min-w-lg">
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

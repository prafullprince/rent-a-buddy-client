import React from "react";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import { NextAuthOption } from "@/utills/nextauthoption.utills";
import { getServerSession } from "next-auth";
import { fetchUserDetailsById } from "@/service/apiCall/user.api";

const UserDetails = async () => {
  // hook
  const session = await getServerSession(NextAuthOption);

  const userDetails = await fetchUserDetailsById(session?.serverToken);
  if (!session) return null;

  return (
    <div className="shadow-md px-3 py-4 rounded-lg bg-black/5 lg:min-w-[600px]">
      <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between gap-2">
        {/* left */}
        <div className="flex sm:flex-row flex-col sm:items-start gap-4">
          {/* pp */}
          <Image
            src={userDetails?.image}
            alt="profile"
            width={100}
            height={100}
            className="rounded-full min-w-32 min-h-32 max-w-32 max-h-32"
          />

          <div className="flex flex-col items-start gap-1">
            {/* name */}
            <p className="text-xl font-semibold">{session?.user?.name}</p>

            {/* username */}
            <p className="text-base text-[#838894]">
              {/* {session?.user?.email?.split("@")[0]} */}
              {userDetails?.username || session?.user?.email?.split("@")[0]}
            </p>

            <p className="text-base text-[#838894]">
              {/* {session?.user?.email?.split("@")[0]} */}
              {session?.user?.email}
            </p>

            <p className="text-base text-[#838894]">
              {/* {session?.user?.email?.split("@")[0]} */}
              +91 {userDetails?.phoneNumber || ""}
            </p>
          </div>

        </div>

        {/* right */}
        <Link href={'/dashboard/settings'} className="flex items-center px-3 py-2 rounded-lg gap-2 bg-yellow-400 text-black cursor-pointer w-fit">
          <FaEdit className="text-2xl" />
          <div className="text-lg font-semibold">Edit</div>
        </Link>

      </div>
    </div>
  );
};

export default UserDetails;

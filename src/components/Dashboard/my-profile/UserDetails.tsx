import React, { memo } from "react";
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
    <div className="shadow-md px-3 py-4 rounded-lg bg-black/5 lg:min-w-[600px] w-full">
      <div className="flex sm:flex-row flex-col sm:items-start sm:justify-between gap-3">
        {/* left */}
        <div className="flex sm:flex-row flex-col sm:items-start gap-4">
          {/* pp */}
          <Image
            src={userDetails?.image}
            alt="profile"
            width={40}
            height={40}
            className="rounded-full min-w-24 min-h-24 max-w-24 max-h-24"
          />

          <div className="flex flex-col items-start gap-1 text-wrap break-words">
            {/* name */}
            <p className="text-lg font-semibold">{session?.user?.name}</p>

            {/* username */}
            <p className="text-xs text-[#838894] text-wrap break-words max-w-[150px] sm:max-w-[200px] lg:max-w-[300px]">
              {/* {session?.user?.email?.split("@")[0]} */}
              {userDetails?.username || session?.user?.email?.split("@")[0]}
            </p>

            <p className="text-sm font-semibold text-[#838894] mt-2">
              {/* {session?.user?.email?.split("@")[0]} */}
              {session?.user?.email}
            </p>

            
          </div>

        </div>

        {/* right */}
        <Link href={'/dashboard/settings'} className="flex items-center px-4 py-2 rounded-lg gap-1 bg-yellow-400 text-black cursor-pointer w-fit">
          <FaEdit className="text-xl" />
          <div className="text-sm font-semibold">Edit</div>
        </Link>

      </div>
    </div>
  );
};

export default memo(UserDetails);

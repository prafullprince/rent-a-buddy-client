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
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* left */}
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
          {/* pp */}
          <Image
            src={userDetails?.image}
            alt="profile"
            width={40}
            height={40}
            className="h-24 w-24 rounded-full border-2 border-amber-300/30 object-cover shadow-lg shadow-black/20"
          />

          <div className="flex min-w-0 flex-col items-start gap-1 break-words">
            {/* name */}
            <p className="text-xl font-semibold text-white">{session?.user?.name}</p>

            {/* username */}
            <p className="max-w-full break-words text-sm text-amber-200/75 sm:max-w-[300px]">
              {/* {session?.user?.email?.split("@")[0]} */}
              {userDetails?.username || session?.user?.email?.split("@")[0]}
            </p>

            <p className="mt-2 max-w-full break-all text-sm font-semibold text-white/45">
              {/* {session?.user?.email?.split("@")[0]} */}
              {session?.user?.email}
            </p>

            
          </div>

        </div>

        {/* right */}
        <Link href={'/dashboard/settings'} className="flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-amber-300 px-4 py-2 text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">
          <FaEdit className="text-xl" />
          <div className="text-sm font-semibold">Edit</div>
        </Link>

      </div>
    </div>
  );
};

export default memo(UserDetails);

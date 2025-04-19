"use client";
import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";

const UserDetails = () => {
  // hook
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="shadow-md px-4 py-4 rounded-lg bg-black/5 lg:min-w-[600px]">
      <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between gap-4">
        {/* left */}
        <div className="flex sm:flex-row flex-col sm:items-center gap-2">
          {/* pp */}
          <Image
            src={session?.user?.image}
            alt="profile"
            width={100}
            height={100}
            className="rounded-full"
          />

          <div className="flex flex-col items-start gap-1">
            {/* name */}
            <p className="text-xl font-semibold">{session?.user?.name}</p>

            {/* username */}
            <p className="text-base text-[#838894]">
              {session?.user?.email?.split("@")[0]}
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

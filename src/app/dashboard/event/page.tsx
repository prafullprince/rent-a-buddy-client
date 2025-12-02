/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import EventBuilder from "@/components/Dashboard/event/eventBuilder/EventBuilder";
import EventFinish from "@/components/Dashboard/event/eventFinish/EventFinish";
import EventInfo from "@/components/Dashboard/event/eventInfo/EventInfo";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const Page = () => {
  // store
  const { step } = useSelector((state: any) => state.event);
  const router = useRouter();

  return (
    <div className="w-full mx-auto flex flex-col px-6">
      {/* route */}
      <div className="mt-2 pt-4">
        <div className="flex items-center gap-2 ml-12 lg:ml-0">
          <div
            onClick={() => router.push("/")}
            className="text-sm text-[#d5d6da] cursor-pointer"
          >
            Home <span>/</span>
          </div>
          <div
            onClick={() => router.push("/dashboard/my-profile")}
            className="text-sm text-[#d5d6da] cursor-pointer"
          >
            Dashboard <span>/</span>
          </div>
          <span className="text-base font-semibold text-yellow-600">
            event 
          </span>
        </div>
      </div>

      {/* eventCard */}
      <div className="sm:p-6 p-4 mt-8 bg-neutral-950 shadow-md w-fit sm:min-w-lg rounded-lg">
        <div className="flex flex-col gap-4">
          {/* step */}

          {/* event */}
          <div className="">
            {step === 1 && <EventInfo />}
            {step === 2 && <EventBuilder />}
            {step === 3 && <EventFinish />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

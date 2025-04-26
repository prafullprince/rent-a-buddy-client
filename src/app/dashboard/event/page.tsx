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
      <div className="mt-4 pt-4">
        <div className="flex items-center gap-2">
          <div
            onClick={() => router.push("/")}
            className="text-sm text-[#838894] cursor-pointer"
          >
            Home <span>/</span>
          </div>
          <div
            onClick={() => router.push("/dashboard/my-profile")}
            className="text-sm text-[#838894] cursor-pointer"
          >
            Dashboard <span>/</span>
          </div>
          <span className="text-base font-semibold text-yellow-600">
            event 
          </span>
        </div>
      </div>

      {/* eventCard */}
      <div className="p-6 mt-8 bg-black/5 shadow-md max-w-fit sm:min-w-xl rounded-lg flex">
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

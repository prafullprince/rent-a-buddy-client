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
    <div className="min-h-screen w-full bg-[#090b10] bg-[linear-gradient(135deg,rgba(245,158,11,0.08)_0%,transparent_30%,transparent_70%,rgba(20,184,166,0.06)_100%)] px-4 py-5 text-white sm:px-6 lg:px-10">
      {/* route */}
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        <div className="flex items-center gap-2 text-sm">
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer text-white/45 transition-colors hover:text-amber-200"
          >
            Home <span>/</span>
          </div>
          <div
            onClick={() => router.push("/dashboard/my-profile")}
            className="cursor-pointer text-white/45 transition-colors hover:text-amber-200"
          >
            Dashboard <span>/</span>
          </div>
          <span className="font-semibold text-amber-300">Create event</span>
        </div>
      </div>

      {/* eventCard */}
      <div className="mt-8 w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 lg:p-8">
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

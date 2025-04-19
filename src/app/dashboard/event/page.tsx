"use client";
import EventBuilder from "@/components/Dashboard/event/eventBuilder/EventBuilder";
import EventFinish from "@/components/Dashboard/event/eventFinish/EventFinish";
import EventInfo from "@/components/Dashboard/event/eventInfo/EventInfo";
import { useSession } from "next-auth/react";
import React from "react";
import { useSelector } from "react-redux";

const page = () => {
  // store
  const { step } = useSelector((state: any) => state.event);
  const { data: session } = useSession();
  console.log(session);
  return (
    <div className="w-full mx-auto flex p-6">
      {/* eventCard */}
      <div className="p-6 mt-4 bg-black/5 shadow-md max-w-fit sm:min-w-xl rounded-lg flex">
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

export default page;

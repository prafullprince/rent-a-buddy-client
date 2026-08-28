/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import EventForm from "./EventForm";
import { useSelector } from "react-redux";

const EventInfo = () => {

  // hook
  const { editEvent } = useSelector((state: any) => state.event);

  return (
    <div className="flex w-full flex-col gap-2">
      {/* heading */}
      <div className="">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Step 1</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">{editEvent ? "Edit Event" : "Event information"}</h2>
        <p className="mt-1 text-sm text-white/50">Set the basic details and a memorable cover image.</p>
      </div>

      <EventForm />

    </div>
  );
};

export default EventInfo;

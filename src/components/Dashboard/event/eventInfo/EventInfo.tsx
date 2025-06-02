/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import EventForm from "./EventForm";
import { useSelector } from "react-redux";

const EventInfo = () => {

  // hook
  const { editEvent } = useSelector((state: any) => state.event);

  return (
    <div className="flex flex-col gap-2 sm:w-full max-w-fit">
      {/* heading */}
      <div className="">
        <h2 className="text-2xl font-bold text-slate-700">{editEvent ? "Edit Event" : "Event Information"}</h2>
      </div>

      <EventForm />

    </div>
  );
};

export default EventInfo;

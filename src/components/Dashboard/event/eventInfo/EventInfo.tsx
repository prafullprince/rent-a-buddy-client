import React from "react";
import EventForm from "./EventForm";

const EventInfo = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* heading */}
      <div className="">
        <h2 className="text-2xl font-semibold text-black">Event Information</h2>
      </div>

      <EventForm />

    </div>
  );
};

export default EventInfo;

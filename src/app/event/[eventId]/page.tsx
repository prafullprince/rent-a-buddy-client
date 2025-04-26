/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

"use client";
import EventDetails from "@/components/Dashboard/eventDetails/EventDetails";
import { eventDetailsById } from "@/service/apiCall/event.api";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  // hook
  const { eventId } = useParams();

  // state
  const [eventDetails, setEventDetails] = useState<any>(null);
  console.log("eventDetails", eventDetails);

  // fetchEventDetails
  const fetchEventDetails = async () => {
    try {
      const result = await eventDetailsById(eventId);
      setEventDetails(result);
    } catch (error) {
      console.log(error);
    }
  };

  // sideEffect
  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  return (
    <div className="">
      {/* box */}
      <div className="w-[80%] mx-auto">
        {/* content */}
        <div className="mt-8">
          <EventDetails eventDetails={eventDetails} />
        </div>
      </div>
    </div>
  );
};

export default page;

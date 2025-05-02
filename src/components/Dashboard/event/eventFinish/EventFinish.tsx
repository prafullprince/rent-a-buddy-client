/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */


"use client";
import EventOverlayCard from "@/components/HomePage/EventOverlayCard";
import { eventSummary, published } from "@/service/apiCall/event.api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const EventFinish = () => {
  // hook
  const { event } = useSelector((state: any) => state.event);
  const { data: session } = useSession();
  const router = useRouter();

  // state
  const [eventDetails, setEventDetails] = useState<any>(null);

  // fetchEventSumamry
  const fetchEventSumamry = async () => {
    try {
      const result = await eventSummary(event?._id, session?.serverToken);
      console.log("resultwdferfertre", result[0]);
      setEventDetails(result[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // handlePublish
  const handlePublish = async () => {
    try {
      const result = await published(
        event?._id,
        "Published",
        session?.serverToken
      );
      console.log("resultwdferfertre", result);
      router.push('/dashboard/my-profile');
    } catch (error) {
      console.log(error);
    }
  };

  // sideEffect
  useEffect(() => {
    fetchEventSumamry();
  }, []);

  return (
    <div>
      {/* heading */}
      <div className="">
        <h2 className="text-2xl font-semibold text-black">Event Finish</h2>
      </div>

      {/* event */}
      <div className="mt-8 w-full">
        <EventOverlayCard event={eventDetails} />
      </div>

      {/* button -> Draft/published */}
      <div className="w-full flex justify-start mt-6">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePublish}
            className="px-3 py-2 bg-black text-white rounded-lg cursor-pointer"
          >
            Draft
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg cursor-pointer"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFinish;

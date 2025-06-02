/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */


"use client";
import EventOverlayCard from "@/components/HomePage/EventOverlayCard";
import { setStep } from "@/redux/slice/event.slice";
import { eventSummary, published } from "@/service/apiCall/event.api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const EventFinish = () => {
  // hook
  const { event } = useSelector((state: any) => state.event);
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  // state
  const [eventDetails, setEventDetails] = useState<any>(null);

  // fetchEventSumamry
  const fetchEventSumamry = async () => {
    try {
      const result = await eventSummary(event?._id, session?.serverToken);
      setEventDetails(result[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // handlePublish
  const handlePublish = async () => {
    try {
      await published(
        event?._id,
        "Published",
        session?.serverToken
      );
      dispatch(setStep(1));
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
    <div className="w-full">
      {/* heading */}
      <div className="">
        <h2 className="text-xl font-semibold text-black">Event Finish</h2>
      </div>

      {/* event */}
      <div className="mt-8 w-full">
        <EventOverlayCard event={eventDetails} />
      </div>

      {/* button -> Draft/published */}
      <div className="w-full flex justify-start mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg cursor-pointer text-sm font-semibold"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFinish;

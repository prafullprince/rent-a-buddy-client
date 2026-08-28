/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import {
  eventSummaryOfUser,
  markAsActiveInactive,
} from "@/service/apiCall/event.api";
import { useSession } from "next-auth/react";
import React, { memo, useEffect, useState } from "react";
import { setEditEvent, setEvent, setStep } from "@/redux/slice/event.slice";
import EventOverlayCard from "@/components/HomePage/EventOverlayCard";
import { FiEdit } from "react-icons/fi";
import { MdDelete, MdOnlinePrediction } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { IoCloudOffline } from "react-icons/io5";

const MyEvents = () => {
  // hook
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  // state
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log("eventDetails", eventDetails);

  // fetch eventSummaryOfUser
  const fetchEventSummary = async () => {
    setLoading(true);
    try {
      const response = await eventSummaryOfUser(session?.serverToken);
      setEventDetails(response);
    } catch (error) {
      console.log("error is:", error);
    } finally {
      setLoading(false);
    }
  };

  // online/offline switch
  async function onlineOffline() {
    try {
      await markAsActiveInactive(
        !eventDetails?.isActive,
        session?.serverToken,
        eventDetails?._id
      );
      setRefresh((prev: any) => !prev);
    } catch (error) {
      console.log(error);
    }
  }

  // sideEffect -> apicall
  useEffect(() => {
    if (!session) return;
    fetchEventSummary();
  }, [session, refresh]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-white/85">My Events</h2>
      {loading ? (
        <div className="flex justify-center items-center py-6">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-white/70 border-t-transparent"></div>
        </div>
      ) : (
        <div className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-1">
            {/* event card */}
            <EventOverlayCard event={eventDetails} type="myEvent" />

            {/* buttons */}
            <div className="flex w-full justify-between gap-3">
              {/* Edit button */}
              <button
                onClick={() => {
                  dispatch(setEvent(eventDetails));
                  dispatch(setEditEvent(true));
                  dispatch(setStep(1));
                  router.push(`/dashboard/event`);
                }}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/50"
              >
                <FiEdit className="text-lg font-extrabold" />
                Edit
              </button>

              {/* delete button */}
              <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-400">
                <MdDelete className="text-xl text-red-100" />
                Delete
              </button>
            </div>

            <button
              onClick={onlineOffline}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-300 px-3 py-2 text-sm font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-200"
            >
              {!eventDetails?.isActive ? (
                <MdOnlinePrediction className="text-xl text-black" />
              ) : (
                <IoCloudOffline className="text-xl text-black" />
              )}
              {eventDetails?.isActive ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(MyEvents);

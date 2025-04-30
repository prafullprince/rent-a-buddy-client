/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import {
  eventSummaryOfUser,
  markAsActiveInactive,
} from "@/service/apiCall/event.api";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
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
    <div>
      <h2 className="text-2xl mt-8 font-semibold text-black">My Events</h2>
      {loading ? (
        <div className="flex justify-center items-center py-6">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
        </div>
      ) : (
        <div className="mt-4 bg-black/10 rounded-lg shadow-lg p-4 max-w-fit">
          <div className="flex flex-col gap-1">
            {/* event card */}
            <EventOverlayCard event={eventDetails} />

            {/* buttons */}
            <div className="flex justify-between w-full gap-4">
              {/* Edit button */}
              <button
                onClick={() => {
                  dispatch(setEvent(eventDetails));
                  dispatch(setEditEvent(true));
                  dispatch(setStep(1));
                  router.push(`/dashboard/event`);
                }}
                className="px-4 cursor-pointer py-2 bg-black text-white rounded-lg font-semibold flex items-center gap-2 hover:scale-95 transition-all duration-200 w-full"
              >
                <FiEdit className="text-xl font-extrabold" />
                Edit
              </button>

              {/* delete button */}
              <button className="px-4 cursor-pointer py-2 bg-[#ee4266] text-white rounded-lg font-semibold flex items-center gap-2 hover:scale-95 transition-all duration-200 w-full">
                <MdDelete className="text-2xl text-red-100" />
                Delete
              </button>
            </div>

            <button
              onClick={onlineOffline}
              className="px-4 cursor-pointer py-2 bg-yellow-500 text-black rounded-lg font-semibold flex items-center gap-2 hover:scale-95 transition-all duration-200 w-full mt-2"
            >
              {!eventDetails?.isActive ? (
                <MdOnlinePrediction className="text-2xl text-black" />
              ) : (
                <IoCloudOffline className="text-2xl text-black" />
              )}
              {eventDetails?.isActive ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;

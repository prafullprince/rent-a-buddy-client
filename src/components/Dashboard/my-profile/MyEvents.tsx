"use client";
import { eventSummaryOfUser } from "@/service/apiCall/event.api";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { setEditEvent, setEvent, setStep } from "@/redux/slice/event.slice";
import EventOverlayCard from "@/components/HomePage/EventOverlayCard";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const MyEvents = () => {
  
  // hook
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  // state
  const [eventDetails, setEventDetails] = useState<any>(null);

  // fetch eventSummaryOfUser
  const fetchEventSummary = async () => {
    try {
      const response = await eventSummaryOfUser(session?.serverToken);
      setEventDetails(response);
    } catch (error) {
      console.log("error is:", error);
    }
  };

  // sideEffect -> apicall
  useEffect(() => {
    fetchEventSummary();
  }, [session]);

  return (
    <div>
      <h2 className="text-2xl mt-6 font-semibold text-black">My Events</h2>
      <div className="mt-6 bg-black/10 rounded-lg shadow-lg p-4 max-w-fit">
        <div className="flex flex-col gap-1">

          {/* event card */}
          <EventOverlayCard event={eventDetails} />

          {/* buttons */}
          <div className="flex justify-between w-full gap-4">

            {/* Edit button */}
            <button onClick={()=>{
                dispatch(setEvent(eventDetails));
                dispatch(setEditEvent(true));
                dispatch(setStep(1));
                router.push(`/dashboard/event`);
            }} className="px-4 cursor-pointer py-2 bg-black text-white rounded-lg font-semibold flex items-center gap-2 hover:scale-95 transition-all duration-200 w-full">
              <FiEdit className="text-xl font-extrabold" />
              Edit
            </button>

            {/* delete button */}
            <button className="px-4 cursor-pointer py-2 bg-[#ee4266] text-white rounded-lg font-semibold flex items-center gap-2 hover:scale-95 transition-all duration-200 w-full">
              <MdDelete className="text-2xl text-red-100" />
              Delete
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default MyEvents;

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

"use client";
import EventDetails from "@/components/Dashboard/eventDetails/EventDetails";
import { eventDetailsById } from "@/service/apiCall/event.api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { motion } from 'framer-motion';

const page = () => {
  // hook
  const { eventId } = useParams();
  const router = useRouter();

  // state
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // fetchEventDetails
  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const result = await eventDetailsById(eventId);
      setEventDetails(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // sideEffect
  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  return (
    <motion.div
      initial={{ x: -20}}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    className="">
      {/* box */}
      <div className="w-[90%] sm:w-[80%] mx-auto">
        <div className="flex items-center mt-4 gap-4 cursor-pointer">
          <IoArrowBackSharp onClick={()=>{
            router.push("/");
          }} className="text-2xl font-bold text-start text-gray-500" />
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-start text-gray-500">
            Event Details
          </h2>
        </div>
        {/* content */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
            </div>
          ) : (
            <EventDetails eventDetails={eventDetails} />
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default page;

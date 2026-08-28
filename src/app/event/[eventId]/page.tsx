/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

"use client";
import EventDetails from "@/components/Dashboard/eventDetails/EventDetails";
import { eventDetailsById } from "@/service/apiCall/event.api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";

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
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-screen overflow-hidden bg-[#090b10] bg-[linear-gradient(135deg,rgba(245,158,11,0.1)_0%,transparent_30%,transparent_70%,rgba(20,184,166,0.08)_100%)] pb-10 text-white"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative mx-auto w-[92%] max-w-7xl sm:w-[86%] lg:w-[88%]">
        <div className="flex items-center justify-between border-b border-white/[0.08] py-5">
          <button
              type="button"
            aria-label="Back to events"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium text-white/70 backdrop-blur-md transition-all hover:-translate-x-0.5 hover:border-amber-300/50 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <IoArrowBackSharp className="text-lg" />
            Back to events
          </button>
          <span className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/45 sm:flex">
            <Sparkles size={14} className="text-amber-300" /> Event details
          </span>
        </div>
        {/* content */}
        <div className="mt-8 lg:mt-10">
          {loading ? (
            <div className="mx-auto grid min-h-[460px] max-w-6xl gap-8 rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 sm:p-7 lg:grid-cols-[0.7fr_1.7fr] lg:p-8">
              <div className="flex flex-row gap-4 lg:flex-col">
                <div className="h-16 w-16 animate-pulse rounded-2xl bg-white/10 lg:h-28 lg:w-28" />
                <div className="flex flex-1 flex-col gap-3 pt-1">
                  <div className="h-5 w-2/5 animate-pulse rounded-full bg-white/10 lg:w-3/5" />
                  <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
                  <div className="h-3 w-3/5 animate-pulse rounded-full bg-white/10" />
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex gap-6 border-b border-white/10 pb-3">
                  <div className="h-4 w-20 animate-pulse rounded-full bg-white/10" />
                  <div className="h-4 w-24 animate-pulse rounded-full bg-white/10" />
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="aspect-video h-auto w-full animate-pulse rounded-2xl bg-white/10 sm:w-56" />
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="h-5 w-24 animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EventDetails eventDetails={eventDetails} />
          )}
        </div>
      </div>
      <div className="relative mx-auto mt-5 flex w-[92%] max-w-7xl items-center justify-center gap-2 text-xs text-white/35 sm:w-[86%] lg:w-[88%]">
        <MapPin size={13} className="text-teal-300/70" /> Discover a better way to spend your time
      </div>
    </motion.main>
  );
};

export default page;

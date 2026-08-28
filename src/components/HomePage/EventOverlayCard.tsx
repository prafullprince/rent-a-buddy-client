/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { memo, useEffect, useState } from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { MdOutlineCurrencyRupee, MdVerified } from "react-icons/md";
import RatingStars from "./RatingStars";
import { GrLocation } from "react-icons/gr";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";
import { motion } from 'framer-motion';

const EventOverlayCard = ({ event, type }: { event: any, type?: any }) => {
  // navigation
  const router = useRouter();

  // state
  const [minimumPrice, setMinimumPrice] = useState<any>(100000);
  const [maximumPrice, setMaximumPrice] = useState<any>(0);

  // sideEffect
  useEffect(() => {
    let minimumPrice: any = 100000;
    let maximumPrice: any = 0;
    event?.subSectionsData?.forEach((data: any) => {
      if (data?.price < minimumPrice) {
        minimumPrice = data?.price;
      }
      if (data?.price > maximumPrice) {
        maximumPrice = data?.price;
      }
    });
    setMinimumPrice(minimumPrice);
    setMaximumPrice(maximumPrice);
  }, [event]);

  return (
    <motion.div
    initial={{ opacity: 0, y: 18 }}
     animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="pb-4 w-full">
      <div
        role="link"
        tabIndex={0}
        aria-label={`View ${event?.userData?.username || "buddy"}'s event`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(`/event/${event?._id}`);
          }
        }}
        className="group relative w-full min-h-[350px] max-h-[400px] overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-xl shadow-black/20 cursor-pointer transition duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
        onClick={() => router.push(`/event/${event?._id}`)}
      >
        {/* Background Image */}
        <Image
          src={event?.imageUrl || fallbackImage}
          width={400}
          height={400}
          alt={event?.userData?.username ? `${event.userData.username}'s event` : "Event"}
          priority
          className="absolute inset-0 h-full w-full object-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/95" />

        {/* Profile and availability */}
        <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between text-white">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-amber-300 font-bold text-slate-950">
              {event?.userData?.username?.charAt(0)?.toUpperCase() || "R"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-bold">{event?.userData?.username || "Rent a buddy"}</p>
                <MdVerified className="shrink-0 text-lg text-sky-300" />
              </div>
              <p className="text-[11px] text-white/65">Verified member</p>
            </div>
          </div>

          {event?.isActive && (
            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200/20 bg-emerald-950/50 px-2.5 py-1.5 backdrop-blur-md">
              <AiOutlineThunderbolt className="text-sm text-emerald-300" />
              <p className="text-[11px] font-semibold text-emerald-100">Available</p>
            </div>
          )}
        </div>

        {/* fav */}
        {
          !type && <div className="absolute right-4 top-20 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/35 backdrop-blur-md transition group-hover:bg-slate-950/60">
          <FcLike className="text-lg" />
        </div>
        }

        {/* Event details */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col items-start gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/45 px-3 py-1.5 backdrop-blur-md">
            <GrLocation className="text-sm text-amber-300" />
            <p className="max-w-[220px] truncate text-xs font-medium text-white/90">
              {event?.location?.substring(0, 30)}
            </p>
          </div>

          {/* category */}
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/95 px-2.5 py-1.5 text-slate-900 shadow-lg">
              <Image
                src={event?.subCategoryData?.[0]?.imageUrl || fallbackImage}
                alt="event"
                width={24}
                height={24}
                className="h-5 w-5 rounded-full"
              />
              <p className="max-w-[130px] truncate text-xs font-semibold">
                {event?.subCategoryData?.[0]?.name}
              </p>
            </div>

            <div className="relative h-8 w-8 rounded-full border border-white/40 bg-slate-950/60">
              {/* top radient shadow */}
              <div className="absolute top-0 h-2 bg-black/10 blur-sm"></div>

              {/* bottom radient shadow */}
              <div className="absolute bottom-0 h-2 bg-black/10 blur-sm"></div>

              {/* content */}
              <p className="absolute inset-0 z-10 flex items-center justify-center text-sm font-semibold text-white">
                {"+"}
                {event?.subCategoryData?.length > 1
                  ? event?.subCategoryData?.length - 1
                  : 0}
              </p>
              <Image
                src={event?.subCategoryData?.[1]?.imageUrl || fallbackImage}
                alt="event"
                width={28}
                height={28}
                className="h-full w-full rounded-full bg-black/5"
              />
            </div>
          </div>

          {/* rating and price */}
          <div className="flex w-full items-center justify-between gap-4 border-t border-white/15 pt-3">
            <RatingStars rating={4} totalRating={8} className="text-sm" />
            <div className="flex items-baseline gap-1 text-white">
              <MdOutlineCurrencyRupee className="text-amber-300 text-base" />
              <div className="flex items-center gap-1">
                <p className="text-sm font-bold">{minimumPrice}</p>
                <p className="text-xs text-white/55">-</p>
                <p className="text-sm font-bold">{maximumPrice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(EventOverlayCard);

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
     initial={{ opacity: 0, y: -30 }}
     animate={{ opacity: 1, y: 0 }}
     exit={{ opacity: 0, y: -10 }}
     transition={{ duration: 0.3 }}
    className="pb-4 w-full">
      <div
        className="relative w-full sm:min-w-full min-h-[350px] max-h-[350px] sm:max-w-full sm:max-h-[400px] bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:border-0 hover:scale-[1.03] transition-all duration-300"
        onClick={() => router.push(`/event/${event?._id}`)}
      >
        {/* Background Image */}
        <Image
          src={event?.imageUrl || fallbackImage}
          width={400}
          height={400}
          alt="Background"
          priority
          className="absolute inset-0 w-full h-full object-cover bg-center"
        />

        {/* topbar */}
        <div className="absolute z-50 top-2 left-2 w-full text-white flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="text-white text-base font-bold">
              {event?.userData?.username?.substring(0, 15)}..
            </div>
            <MdVerified className="text-blue-500 text-lg" />
          </div>

          {event?.isActive && (
            <div className="flex items-center bg-black/20 rounded-full w-fit px-2 py-1">
              <AiOutlineThunderbolt className="text-xs text-green-400" />
              <p className="text-xs leading-0.5 font-medium">Available</p>
            </div>
          )}
        </div>

        {/* fav */}
        {
          !type && <div className="absolute top-1 right-2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center z-50">
          <FcLike className="text-xl" />
        </div>
        }

        {/* Gradient Top */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-700 to-transparent"></div>

        {/* Content (Empty space in the middle) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Content can be placed here if needed */}
        </div>

        {/* bottom Content */}
        <div className="absolute z-50 bottom-2 left-2 right-2 w-full flex flex-col items-start gap-2">
          {/* location */}
          <div className="bg-black/40 rounded-lg rounded-bl-none px-2 py-1 flex items-center gap-1">
            <GrLocation className="text-sm text-yellow-400" />
            <p className="text-white font-medium text-sm">
              {event?.location?.substring(0, 30)}
            </p>
          </div>

          {/* category */}
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
              <Image
                src={event?.subCategoryData?.[0]?.imageUrl || fallbackImage}
                alt="event"
                width={24}
                height={24}
                className="rounded-full w-5 h-5"
              />
              <p className="text-xs font-semibold">
                {event?.subCategoryData?.[0]?.name}
              </p>
            </div>

            <div className="relative w-7 h-7 rounded-full border border-cyan-700">
              {/* top radient shadow */}
              <div className="absolute top-0 h-2 bg-black/10 blur-sm"></div>

              {/* bottom radient shadow */}
              <div className="absolute bottom-0 h-2 bg-black/10 blur-sm"></div>

              {/* content */}
              <p className="absolute inset-0 text-white flex items-center justify-center font-semibold text-sm">
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
                className="rounded-full w-full h-full bg-black/5"
              />
            </div>
          </div>

          {/* rating and price */}
          <div className="flex items-center justify-between gap-8 w-full px-2">
            <RatingStars rating={4} totalRating={8} className="text-sm" />
            <div className="flex items-center gap-1">
              <MdOutlineCurrencyRupee className="text-yellow-300 text-base" />
              <div className="flex items-center gap-1 pr-4">
                <p className="text-white/90 font-semibold text-xs">{minimumPrice}</p>
                <p className="text-white/90 font-semibold text-sm">~</p>
                <p className="text-white/90 font-semibold text-xs">{maximumPrice}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-700 to-transparent"></div>
      </div>
    </motion.div>
  );
};

export default memo(EventOverlayCard);

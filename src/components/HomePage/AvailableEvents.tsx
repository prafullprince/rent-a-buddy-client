/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { memo, useEffect, useState } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import RatingStars from "./RatingStars";
import { GrLocation } from "react-icons/gr";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";

const AvailableEvents = ({ event }: { event: any }) => {

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
    <div className="flex items-start bg-neutral-200 px-4 py-3 rounded-lg cursor-pointer hover:border-0 hover:scale-105 transition-all duration-300 w-fit">
      {/* left */}
      <div
        className="relative w-40 min-h-[140px] max-h-[140px] bg-white rounded-lg overflow-hidden"
        onClick={() => router.push(`/event/${event?._id}`)}
      >
        {/* Background Image */}
        <Image
          src={event?.imageUrl || fallbackImage}
          width={400}
          height={400}
          alt="Background"
          priority
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* topbar */}
        <div className="absolute z-50 top-2 left-1 w-full text-white flex flex-col gap-1">
          <div className="flex items-center gap-1 bg-black/30 rounded-full w-fit px-2 py-2">
            <GrLocation className="text-sm text-yellow-500" />
            <p className="text-xs leading-0.5 font-medium">{event?.location}</p>
          </div>
        </div>

        {/* Gradient Top */}
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-gray-700 to-transparent"></div>

        {/* Content (Empty space in the middle) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Content can be placed here if needed */}
        </div>

        {/* bottom Content */}
        <div className="absolute z-50 bottom-2 left-2 right-2 w-full flex flex-col items-start gap-2">
          {/* rating and price */}
          <div className="flex flex-col gap-0 w-full px-1">
            <RatingStars rating={4} totalRating={8} className="text-sm" />
            <div className="flex items-center gap-1">
              <MdOutlineCurrencyRupee className="text-yellow-300 text-sm" />
              <div className="flex items-center gap-1">
                <p className="text-white/90 font-semibold text-xs">
                  {minimumPrice}
                </p>
                <p className="text-white/90 font-semibold">~</p>
                <p className="text-white/90 font-semibold text-xs">
                  {maximumPrice}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-700 to-transparent"></div>
      </div>

      {/* right */}
      <div className="flex flex-col gap-2 pl-4">
        {/* username */}
        <div className="text-black text-sm font-semibold">
          {event?.user?.username}
        </div>

        {/* availability */}
        <div>
          <p className="text-gray-400 text-sm">Available for</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {event?.service?.[0]?.sections?.map((ev: any, idx:any) => (
              <div key={idx} className="text-xs font-semibold text-black">
                {ev?.categoryId?.name}
              </div>
            ))}
          </div>
        </div>

        {/* time */}
        <div className="text-xs text-gray-400">
          <span className="text-black text-base font-semibold">7:30</span> PM
          <span className="text-black text-base font-semibold"> - </span>
          <span className="text-black text-base font-semibold">11:30</span> PM
        </div>
      </div>
    </div>
  );
};

export default memo(AvailableEvents);

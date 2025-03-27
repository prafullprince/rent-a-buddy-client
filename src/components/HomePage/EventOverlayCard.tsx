import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { MdVerified } from "react-icons/md";
import RatingStars from "./RatingStars";
import { PiCurrencyInrFill } from "react-icons/pi";
import { GrLocation } from "react-icons/gr";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";

const EventOverlayCard = ({ event }: { event: any }) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div
        className="relative w-80 h-[420px] bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:border-2 hover:border-blue-800 transition-all duration-200"
        onClick={() => router.push(`/event/${event?._id}`)}
      >
        {/* Background Image */}
        <Image
          src={event?.imageUrl}
          width={400}
          height={400}
          alt="Background"
          priority
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* topbar */}
        <div className="absolute z-50 top-2 left-2 w-full text-white flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="text-white text-xl font-semibold">
              {event?.userData?.username}
            </div>
            <MdVerified className="text-blue-500 text-xl" />
          </div>

          {event?.isActive && <div className="flex items-center gap-1 bg-black/30 rounded-full w-fit px-4 py-2">
            <AiOutlineThunderbolt className="text-base text-green-400" />
            <p className="text-sm leading-0.5 font-medium">Available</p>
          </div>}
        </div>

        {/* fav */}
        <div className="absolute top-2 right-2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center z-50">
          <FcLike className="text-2xl" />
        </div>

        {/* Gradient Top */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-700 to-transparent"></div>

        {/* Content (Empty space in the middle) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Content can be placed here if needed */}
        </div>

        {/* bottom Content */}
        <div className="absolute z-50 bottom-2 left-2 right-2 w-full flex flex-col items-start gap-2">
          {/* about */}
          <div className="bg-black/40 rounded-lg rounded-bl-none p-2 flex items-center gap-2">
            <GrLocation className="text-lg text-yellow-400" />
            <p className="text-white font-medium text-sm">
              {event?.location?.substring(0, 30)}
            </p>
          </div>

          {/* category */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full">
              <Image
                src={
                  event?.serviceData?.sectionsData?.subSectionsData?.subCategoryData[0]?.imageUrl || fallbackImage
                }
                alt="event"
                width={24}
                height={24}
                className="rounded-full w-6 h-6"
              />
              <p className="text-base font-medium">
                {event?.serviceData?.sectionsData?.subSectionsData?.subCategoryData[0]?.name}
              </p>
            </div>
            <div className="relative w-9 h-9 rounded-full border border-orange-100">
              {/* top radient shadow */}
              <div className="absolute top-0 h-2 bg-black/10 blur-sm"></div>

              {/* bottom radient shadow */}
              <div className="absolute bottom-0 h-2 bg-black/10 blur-sm"></div>

              {/* content */}
              <p className="absolute inset-0 text-white flex items-center justify-center font-semibold text-lg">
                {"+"}
                {event?.serviceData?.sectionsData?.subSectionsData?.subCategoryData.length > 1
                  ? event?.serviceData?.sectionsData?.subSectionsData?.subCategoryData.length - 1
                  : 0}
              </p>
              <Image
                src={event?.serviceData?.sectionsData?.subSectionsData?.subCategoryData[1]?.imageUrl || fallbackImage}
                alt="event"
                width={28}
                height={28}
                className="rounded-full w-full h-full bg-black/5"
              />
            </div>
          </div>

          {/* rating and price */}
          <div className="flex items-center gap-8">
            <RatingStars rating={4} totalRating={8} />
            <div className="flex items-center gap-[2px]">
              <PiCurrencyInrFill className="text-yellow-300 text-xl shadow-sm shadow-black" />
              <p className="text-white/90 font-semibold m-2">{20.0}</p>
            </div>
          </div>
        </div>

        {/* Gradient Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-700 to-transparent"></div>
      </div>
    </div>
  );
};

export default EventOverlayCard;

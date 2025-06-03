/* eslint-disable @typescript-eslint/no-explicit-any */

import { allAvailableEvents } from "@/service/apiCall/event.api";
import Image from "next/image";
import Link from "next/link";
import React, { memo, useEffect, useRef, useState } from "react";

const AllAvailableEventsLive = () => {
  // hook
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  //   state
  const [availableEvent, setAvailableEvent] = useState<any>([]);
  const [availableLoading, setAvailableLoading] = useState(false);

  // Mouse/Touch Drag Logic
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    startX.current = "touches" in e ? e.touches[0].pageX : e.pageX;
    scrollLeft.current = sliderRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    const x = "touches" in e ? e.touches[0].pageX : e.pageX;
    const walk = x - startX.current;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const endDrag = () => {
    isDragging.current = false;
  };

  // fetchAvailableEvents
  async function fetchAllAvailableEvents() {
    setAvailableLoading(true);
    try {
      const result = await allAvailableEvents();
      console.log(" allAvailableEvent result is: ", result);
      setAvailableEvent(result);
    } catch (error) {
      console.log("allAvailableEvent error: ", error);
    } finally {
      setAvailableLoading(false);
    }
  }

  // apiCall -> AllAvailableEvent
  useEffect(() => {
    fetchAllAvailableEvents();
  }, []);

  return (
    <div className="relative w-full">
      <h2 className="font-semibold text-xl">
        {" "}
        {availableEvent?.length} profiles are available today
      </h2>

      <div
        ref={sliderRef}
        className="overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide px-2 w-full cursor-grab active:cursor-grabbing select-none slider mt-3 snap-mandatory"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={endDrag}
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="flex items-center gap-3">
          {availableLoading ? (
            <div className="flex justify-center items-center py-6">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
            </div>
          ) : (
            <>
              {availableEvent?.map((story: any) => (
                <Link
                  href={`/event/${story?._id}`}
                  key={story?._id}
                  className="relative snap-start"
                >
                  {/* Image */}
                  <Image
                    key={story?._id}
                    src={story?.imageUrl}
                    alt="profile"
                    width={40}
                    height={40}
                    className="min-w-20 min-h-20 max-w-20 max-h-20 rounded-full bg-center bg-cover border-3 px-[2px] py-[2px] border-t-red-700 border-r-red-800 border-b-yellow-600 border-l-green-950"
                  />

                  {/* service */}

                  {/* userName */}
                  <div className="text-[10px] font-medium">
                    {story?.user?.username?.substring(0, 15)}
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(AllAvailableEventsLive);

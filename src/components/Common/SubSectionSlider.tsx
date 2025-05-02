/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useRef } from "react";


export default function SubSectionSlider({
  subSectionDetails,
  currentSubSection,
  setCurrentSubSection,
}: any) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Scroll with buttons
  // const scroll = (direction: "left" | "right") => {
  //   if (sliderRef.current) {
  //     const amount = direction === "left" ? -320 : 320;
  //     sliderRef.current.scrollBy({ left: amount, behavior: "smooth" });
  //   }
  // };

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

  return (
    <div className="relative w-full">
      <div
        ref={sliderRef}
        className="overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide w-full cursor-grab active:cursor-grabbing select-none slider"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={endDrag}
      >
        <div className="flex items-center gap-3">
          {subSectionDetails?.map((subSec: any) => (
            <div
              className={`px-2 py-2 rounded-lg cursor-pointer ${
                currentSubSection?._id === subSec?._id
                  ? "bg-yellow-300"
                  : "bg-gray-300 hover:bg-gray-400 transition-all duration-300"
              }`}
              key={subSec?._id}
            >
              <div
                onClick={() => setCurrentSubSection(subSec)}
                className="flex items-center gap-1"
              >
                <Image
                  src={subSec?.subCategoryId?.imageUrl}
                  alt="subCategory"
                  width={24}
                  height={24}
                  className="rounded-full min-w-6 min-h-6 max-w-6 max-h-6"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">
                    {subSec?.subCategoryId?.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function HorrizontalSlider({ data, type }: any) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Scroll with buttons
  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const amount = direction === "left" ? -320 : 320;
      sliderRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

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
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 px-3 py-2 bg-slate-200 rounded shadow"
      >
        <FaAngleLeft className="text-2xl" />
      </button>

      <div
        ref={sliderRef}
        className="overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide px-16 w-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={endDrag}
      >
        <div className="flex items-center gap-3">
          {type === "post" && data?.map((post: any, index: any) => {
            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={post?.imageUrl}
                    alt="profile"
                    width={40}
                    height={40}
                    className="min-w-[160px] min-h-[130px] max-w-[160px] max-h-[130px] rounded-lg bg-center bg-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 z-10 px-3 py-2 bg-slate-200 rounded shadow"
      >
        <FaAngleRight className="text-2xl" />
      </button>
    </div>
  );
}

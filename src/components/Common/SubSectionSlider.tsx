/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useRef, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const SubSectionSlider = ({
  subSectionDetails,
  currentSubSection,
  setCurrentSubSection,
}: any) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scroll = (direction: "left" | "right") => {
    sliderRef.current?.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
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
        type="button"
        aria-label="Scroll subsections left"
        onClick={() => scroll("left")}
        className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15 bg-slate-900/90 p-2 text-white/70 shadow-lg backdrop-blur-md transition hover:border-amber-300/60 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:block"
      >
        <ChevronLeft size={16} />
      </button>
      <div
        ref={sliderRef}
        aria-label="Available services"
        className="slider w-full cursor-grab select-none overflow-x-auto scroll-smooth whitespace-nowrap scrollbar-hide active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={endDrag}
      >
        <div className="flex items-center gap-3 px-1 py-1">
          {subSectionDetails?.map((subSec: any) => (
            <button
              type="button"
              key={subSec?._id}
              aria-pressed={currentSubSection?._id === subSec?._id}
              onClick={() => setCurrentSubSection(subSec)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                currentSubSection?._id === subSec?._id
                  ? "border-amber-200/60 bg-amber-300 text-slate-950 shadow-lg shadow-amber-950/20"
                  : "border-white/10 bg-white/[0.06] text-white/70 hover:border-white/25 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Image
                src={subSec?.subCategoryId?.imageUrl}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-black/10"
              />
              <span className="max-w-[130px] truncate text-xs font-semibold">
                {subSec?.subCategoryId?.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-label="Scroll subsections right"
        onClick={() => scroll("right")}
        className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15 bg-slate-900/90 p-2 text-white/70 shadow-lg backdrop-blur-md transition hover:border-amber-300/60 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:block"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default memo(SubSectionSlider)

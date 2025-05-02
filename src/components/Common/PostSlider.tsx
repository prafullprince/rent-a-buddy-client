/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useRef } from "react";
import { MdDelete } from "react-icons/md";

export default function PostSlider({
  setModalData,
  userDetails,
  posts,
  type,
}: any) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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
          {posts?.map((post: any) => {
            return (
              <div key={post?._id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 relative">
                  <Image
                    src={post?.imageUrl}
                    alt="profile"
                    width={300}
                    height={300}
                    className="sm:min-w-[260px] sm:min-h-[220px] sm:max-h-[220px] sm:max-w-[260px] min-w-[200px] min-h-[220px] max-h-[260px] rounded-sm bg-center bg-cover flex-1 justify-center sm:block"
                  />
                  {type == "user" && post?.user === userDetails?._id && (
                    <div
                      className="absolute bottom-4 right-3 rounded-full bg-slate-700 flex items-center justify-center w-10 h-10"
                      onClick={() => {
                        setModalData({
                          postId: post?._id,
                        });
                      }}
                    >
                      <MdDelete className="text-2xl text-red-400 hover:text-red-500 transition-all duration-300 cursor-pointer" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

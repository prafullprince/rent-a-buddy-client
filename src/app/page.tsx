"use client";
import EventOverlayCard from "@/components/HomePage/EventOverlayCard";
import { getInfiniteEvents } from "@/service/apiCall/event.api";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Home
export default function Home() {
  // hook
  const observerRef = useRef<HTMLDivElement>(null);

  // state
  const [events, setEvents] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [hasmore, setHasmore] = useState(true);
  const [cursor, setCursor] = useState(null);
  const hasFetched = useRef(false); // ✅ Prevent multiple fetch calls
  console.log("hasmore", hasmore)
  // Fetch data function
  const fetchData = useCallback(async () => {
    if (!hasmore || loading || hasFetched.current) return; // ✅ Block duplicate calls

    hasFetched.current = true; // ✅ Set flag before calling API
    setLoading(true);

    try {
      const data: any = await getInfiniteEvents(10, null, cursor);
      
      console.log("Fetched Data:", data.data?.length, "items");
      console.log("Updated Cursor:", data.pagination.nextCursor);
      console.log("Hasmore:", data.pagination.hasMore);

      setEvents((prev: any) => [...prev, ...data.data]);
      setHasmore(data.pagination.hasMore);
      setCursor(data.pagination.nextCursor);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        hasFetched.current = false; // ✅ Reset flag after fetch
      }, 1000); // ✅ Small delay to prevent immediate duplicate calls
    }
  }, [hasmore, cursor, loading]);

  // observerCallback
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && hasmore) {
        fetchData();
      }
    },
    [fetchData, hasmore,loading]
  );

  // observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "10px", // ✅ Adjusted to prevent multiple triggers
      threshold: 1.0,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerCallback]);

  return (
    <motion.div
      initial={{ opacity: 0, z: 50 }}
      animate={{ opacity: 1, z: 0 }}
      exit={{ opacity: 0, z: 50 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center w-full min-h-screen"
    >
      <div className="flex justify-center items-center w-[90%] mx-auto lg:w-[80%]">
        <div className="flex flex-col items-start gap-4">
          {/* available profile */}
          <div></div>

          {/* filters */}
          <div></div>

          {/* Infinite Scroll Grid */}
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 place-items-center">
            {events?.map((event: any) => (
              <EventOverlayCard event={event} key={event?._id} />
            ))}

            {/* Observer Target */}
            {hasmore && (
              <div ref={observerRef} className="h-10 flex items-center justify-center">
                {loading ? "Loading..." : ""}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

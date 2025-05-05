/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import EventOverlayCard from "@/components/HomePage/EventOverlayCard";
import {
  allAvailableEvents,
  getInfiniteEvents,
} from "@/service/apiCall/event.api";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import IntergalacticSpinner from "@/loading/Loading1";
import "swiper/css";
import { IoFilterSharp } from "react-icons/io5";
import Toggle from "@/components/Common/Toggle";
import PlanetSpinner from "@/loading/PageLoadingSpinner";

// data
const Location = ["delhi", "mumbai", "banglore", "pune", "patna"];
const filterRating = ["Highest", "Average", "Lowest"];

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
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    location: "",
    username: "",
    rating: "",
    gender: "",
    isActive: false,
  });
  const [applyLoading, setApplyLoading] = useState(false);
  const [availableEvent, setAvailableEvent] = useState<any>([]);
  const [availableLoading, setAvailableLoading] = useState(false);

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (!hasmore || loading || hasFetched.current) return; // ✅ Block duplicate calls

    hasFetched.current = true; // ✅ Set flag before calling API
    setLoading(true);

    try {
      const data: any = await getInfiniteEvents(15, formData, cursor);

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
  }, [hasmore, cursor, loading, formData]);

  // changeHandler
  const changeHandler = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // submitHandler
  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setApplyLoading(true);
    try {
      setEvents([]);
      setCursor(null);
      setHasmore(true);
      hasFetched.current = false; // ✅ Reset flag before new fetch
      fetchData();
    } catch (error) {
      console.log(error);
    } finally {
      setApplyLoading(false);
    }
  };

  // observerCallback
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && hasmore) {
        fetchData();
      }
    },
    [fetchData, hasmore, loading]
  );

  // observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px 0px 10px 0px", // ✅ Adjusted to prevent multiple triggers
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
    <div className="">
      <motion.div
        initial={{ opacity: 0, z: 50 }}
        animate={{ opacity: 1, z: 0 }}
        exit={{ opacity: 0, z: 50 }}
        transition={{ duration: 0.5 }}
        className="w-[90%] sm:w-[90%] mx-auto min-h-screen"
      >
        <div className="mx-auto w-full lg:w-[90%]">
          <div className="flex flex-col items-start gap-4">
            {/* filters */}
            <div className="hidden lg:block w-full">
              <div className="flex flex-wrap items-center justify-between w-full mt-8 gap-4">
                <div className="flex items-center flex-wrap gap-4">
                  {/* location */}
                  <div className="flex flex-col gap-2 cursor-pointer">
                    <select
                      id="location"
                      className="px-3 w-44 py-2 border border-gray-300 cursor-pointer rounded-lg outline-none bg-black text-white font-medium"
                      value={formData.location}
                      onChange={changeHandler}
                      name="location"
                    >
                      <option value="">location</option>
                      {Location.map((loc: any, index: number) => (
                        <option key={index} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* username */}
                  <div>
                    <input
                      type="text"
                      placeholder="username"
                      className="px-2 py-[6px] border border-gray-300 rounded-lg outline-none w-44 bg-black text-white font-medium placeholder:text-gray-50 placeholder:text-sm"
                      value={formData.username}
                      onChange={changeHandler}
                      name="username"
                    />
                  </div>

                  {/* rating */}
                  <div>
                    <select
                      id="rating"
                      className="px-3 w-44 py-2 border border-gray-300 cursor-pointer rounded-lg outline-none bg-black text-white"
                      value={formData.rating}
                      onChange={changeHandler}
                      name="rating"
                    >
                      <option value="">rating</option>
                      {filterRating.map((rating: any, index: number) => (
                        <option key={index} value={rating}>
                          {rating}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* gender */}
                  <div>
                    <select
                      id="gender"
                      className="px-3 w-44 py-2 border border-gray-300 cursor-pointer rounded-lg outline-none bg-black text-white"
                      value={formData.gender}
                      onChange={changeHandler}
                      name="gender"
                    >
                      <option value="">gender</option>
                      <option value="male">male</option>
                      <option value="female">female</option>
                    </select>
                  </div>

                  {/* available -> toggle */}
                  <Toggle
                    isToggleOpen={isToggleOpen}
                    setIsToggleOpen={setIsToggleOpen}
                    setFormData={setFormData}
                  />

                  {/*  */}
                </div>

                <motion.div layoutId="button">
                  <button
                    onClick={submitHandler}
                    className="px-6 py-2 bg-black font-medium text-white rounded-full cursor-pointer flex items-center gap-2"
                  >
                    Apply
                    {loading && <IntergalacticSpinner />}
                  </button>
                </motion.div>
              </div>
            </div>

            {/* filters in small screen */}
            <div className="flex items-center gap-3 tracking-normal cursor-pointer bg-gray-500 text-white font-semibold text-lg px-4 py-2 rounded-lg lg:hidden mt-4">
              <div>Filters</div>
              <IoFilterSharp className="font-bold text-xl" />
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-2">
              {events?.map((event: any, idx: any) => (
                <EventOverlayCard event={event} key={idx} />
              ))}

              {events?.length === 0 && (
                <div className="h-10 flex items-center justify-center">
                  <div className="text-black bg-white">
                    <p className="text-center text-xl font-bold">
                      No events found
                    </p>
                  </div>
                </div>
              )}

              {/* Observer Target */}
              {hasmore && (
                <div
                  ref={observerRef}
                  className="h-20 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="flex justify-center items-center py-6">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

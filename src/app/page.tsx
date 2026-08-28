/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */

"use client";
import EventOverlayCard from "@/components/HomePage/EventOverlayCard";
import {
  getInfiniteEvents,
} from "@/service/apiCall/event.api";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IntergalacticSpinner from "@/loading/Loading1";
// import "swiper/css";
import { IoFilterSharp } from "react-icons/io5";
import Toggle from "@/components/Common/Toggle";
import AllAvailableEventsLive from "@/components/HomePage/AllAvailableEventsLive";
import FilterModal from "@/components/HomePage/FilterModal";

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
    isActive: null,
  });

  const [applyLoading, setApplyLoading] = useState(false);
  const [filterData, setFilterData] = useState<any>(null);

  // Fetch data function
  const fetchData = useCallback(
    async (cursorOverride = cursor, filtersOverride = formData) => {
      if (!hasmore || loading || hasFetched.current) return; // ✅ Block duplicate calls

      hasFetched.current = true; // ✅ Set flag before calling API
      setLoading(true);

      try {
        const data: any = await getInfiniteEvents(15, filtersOverride, cursorOverride);

        // update state
        if (data && Array.isArray(data.data)) {
          setEvents((prev: any) => [...prev, ...data.data]);
          setHasmore(data.pagination?.hasMore ?? false);
          setCursor(data.pagination?.nextCursor ?? null);
        }
      } catch (error: any) {
        throw error;
      } finally {
        setLoading(false);
        setTimeout(() => {
          hasFetched.current = false; // ✅ Reset flag after fetch
        }, 1000); // ✅ Small delay to prevent immediate duplicate calls
      }
    },
    [hasmore, cursor, loading, formData]
  );

  useEffect(() => {
    fetchData(null);
  }, [fetchData]);

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
    setFilterData(null);
    try {
      setEvents([]);
      setCursor(null);
      setHasmore(true);
      hasFetched.current = false; // ✅ Reset flag before new fetch
      await fetchData(null);
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
    const targetElememt = observerRef.current;

    // observer setup
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px 0px 10px 0px", // ✅ Adjusted to prevent multiple triggers
      threshold: 1.0,
    });

    // observe targetElement
    if (targetElememt) {
      observer.observe(targetElememt);
    }

    // cleanup fn
    return () => {
      if (targetElememt) {
        observer.unobserve(targetElememt);
      }
    };
  }, [observerCallback]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090b10] bg-[linear-gradient(135deg,rgba(245,158,11,0.08)_0%,transparent_28%,transparent_72%,rgba(20,184,166,0.06)_100%)] text-white">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-[92%] sm:w-[90%] mx-auto min-h-screen pb-10"
      >
        <div className="mx-auto w-full lg:w-[90%] mt-4">
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-6 shadow-2xl shadow-black/20 sm:px-8 sm:py-8"
          >
            <div className="relative z-10 max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
                Your next good memory
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Find someone worth the moment.
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/60 sm:text-base">
                Discover verified buddies for the plans you have been waiting to make.
              </p>
            </div>
          </motion.header>

          {/* allAvailableEvents */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-3 shadow-xl shadow-black/10 sm:px-4">
            <AllAvailableEventsLive />
          </div>

          {/* heading */}
          {/* <h2 className="font-semibold text-xl mt-5">Find your match</h2> */}

          {/* content */}
          <div className="flex flex-col items-start gap-2 mt-8">
            {/* filters */}
            <div className="hidden w-full lg:block">
              <div className="flex w-full flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3 shadow-xl shadow-black/10">
                <div className="flex items-center flex-wrap gap-2">
                  {/* location */}
                  <div className="flex flex-col gap-2 cursor-pointer">
                    <select
                      id="location"
                      className="w-44 cursor-pointer appearance-none rounded-full border border-white/10 bg-black/20 px-4 py-[7px] text-sm font-medium text-white/70 outline-none transition-colors hover:border-amber-300/60 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                      value={formData.location}
                      onChange={changeHandler}
                      name="location"
                    >
                      <option value="" className="text-sm text-slate-300">
                        location
                      </option>
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
                      className="w-44 rounded-full border border-white/10 bg-black/20 px-4 py-[7px] text-sm font-medium text-white/70 outline-none transition-colors placeholder:text-white/35 hover:border-amber-300/60 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                      value={formData.username}
                      onChange={changeHandler}
                      name="username"
                    />
                  </div>

                  {/* rating */}
                  <div>
                    <select
                      id="rating"
                      className="w-44 cursor-pointer appearance-none rounded-full border border-white/10 bg-black/20 px-4 py-[7px] text-sm font-medium text-white/70 outline-none transition-colors hover:border-amber-300/60 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
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
                      className="w-44 cursor-pointer appearance-none rounded-full border border-white/10 bg-black/20 px-4 py-[7px] text-sm font-medium text-white/70 outline-none transition-colors hover:border-amber-300/60 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
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

                {/* button */}
                <div className="flex gap-2 h-full">
                  <div className="hidden h-[35px] w-px bg-white/10 lg:block"></div>
                  <motion.div layoutId="button">
                    <button
                      onClick={submitHandler}
                      className="flex cursor-pointer items-center gap-2 rounded-full bg-amber-300 px-5 py-[7px] font-semibold text-black shadow-lg shadow-amber-300/10 transition-all hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b10]"
                    >
                      Apply
                      {applyLoading && <IntergalacticSpinner />}
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* filters in small screen */}
            <div
              onClick={() => {
                setFilterData({
                  title: "Filters",
                });
              }}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-amber-200/20 bg-amber-300 px-4 py-2 text-sm font-semibold tracking-normal text-black shadow-lg shadow-amber-300/10 transition-transform hover:-translate-y-0.5 lg:hidden"
            >
              <div>Filters</div>
              <IoFilterSharp className="font-bold text-sm" />
            </div>

            {/* event */}
            <div className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              <AnimatePresence mode="wait">
                {events?.map((event: any) => (
                  <EventOverlayCard event={event} key={event?._id} />
                ))}
              </AnimatePresence>

              {events?.length === 0 && !loading && (
                <div className="flex items-center justify-center">
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
                  className="flex items-center justify-center h-25"
                >
                  {loading ? (
                    <div className="flex justify-center items-center py-6">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-white/80 border-t-transparent"></div>
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

      <AnimatePresence mode="wait">
        {filterData && (
          <FilterModal
            formData={formData}
            setFormData={setFormData}
            changeHandler={changeHandler}
            isToggleOpen={isToggleOpen}
            setIsToggleOpen={setIsToggleOpen}
            submitHandler={submitHandler}
            loading={applyLoading}
            setFilterData={setFilterData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

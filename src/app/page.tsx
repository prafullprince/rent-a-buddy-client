"use client";
import EventOverlayCard from "@/components/HomePage/EventOverlayCard";
import {
  allAvailableEvents,
  getInfiniteEvents,
} from "@/service/apiCall/event.api";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import IntergalacticSpinner from "@/loading/Loading1";
import FullScreen from "@/loading/FullScreen";
import AvailableEvents from "@/components/HomePage/AvailableEvents";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { BsFilterSquare } from "react-icons/bs";
import { IoFilterSharp } from "react-icons/io5";

// data
const Location = ["Delhi", "Mumbai", "Banglore", "Pune", "Hyderabad"];
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
  const [formData, setFormData] = useState<any>({
    location: "",
    username: "",
    rating: "",
    gender: "",
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
      const data: any = await getInfiniteEvents(10, null, cursor);

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

  // fetchAvailableEvents
  const fetchAvailableEvents = async () => {
    setAvailableLoading(true);
    try {
      const result = await allAvailableEvents();
      setAvailableEvent(result);
    } catch (error) {
      console.log(error);
    } finally {
      setAvailableLoading(false);
    }
  };

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
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApplyLoading((prev) => !prev);
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
      rootMargin: "1px", // ✅ Adjusted to prevent multiple triggers
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

  // sideEffect
  useEffect(() => {
    fetchAvailableEvents();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, z: 50 }}
      animate={{ opacity: 1, z: 0 }}
      exit={{ opacity: 0, z: 50 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center w-full min-h-screen"
    >
      <div className="flex justify-center mx-auto lg:w-[80%] lg:max-w-[80%]">
        <div className="flex flex-col items-start gap-4 mt-8">
          {/* available profile */}
          {/* <div className="text-xl font-bold">Top 10 available profiles</div> */}
          {/* <div className="">
            {availableLoading ? (
              <div className="flex items-center justify-center w-full h-16 text-zinc-200 bg-white">
                <div className="loader1"></div>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {availableEvent?.map((event: any) => (
                  <AvailableEvents event={event} />
                ))}
              </div>
            )}
          </div> */}

          {/* filters */}
          <div className="hidden lg:block w-full">
            <form
              onSubmit={submitHandler}
              className="flex items-center justify-between w-full mt-8"
            >
              <div className="flex items-center gap-4">
                {/* location */}
                <div className="flex flex-col gap-2 cursor-pointer">
                  <select
                    id="location"
                    className="px-3 w-44 py-2 border border-gray-300 cursor-pointer rounded-lg outline-none"
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
                    className="px-2 py-[6px] border border-gray-300 rounded-lg outline-none w-44"
                    value={formData.username}
                    onChange={changeHandler}
                    name="username"
                  />
                </div>

                {/* rating */}
                <div>
                  <select
                    id="rating"
                    className="px-3 w-44 py-2 border border-gray-300 cursor-pointer rounded-lg outline-none"
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
                    className="px-3 w-44 py-2 border border-gray-300 cursor-pointer rounded-lg outline-none"
                    value={formData.gender}
                    onChange={changeHandler}
                    name="gender"
                  >
                    <option value="">gender</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                  </select>
                </div>

                {/*  */}
              </div>

              <motion.div layoutId="button">
                <button
                  type="submit"
                  className="px-6 py-2 bg-black font-medium text-white rounded-full cursor-pointer flex items-center gap-2"
                >
                  Apply
                  {applyLoading && (
                    // <div className="flex items-center justify-center">
                    //   <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/80 border-t-transparent"></div>
                    // </div>
                    // <PlanetSpinner />
                    <IntergalacticSpinner />
                    // <div className="flex items-center justify-center space-x-2">
                    //   <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    //   <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    //   <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    // </div>
                  )}
                </button>
              </motion.div>
            </form>
          </div>

          {/* filters in small screen */}
          <div className="flex items-center gap-3 tracking-normal cursor-pointer bg-gray-500 text-white font-semibold text-lg px-4 py-2 rounded-lg lg:hidden">
            <div>Filters</div>
            <IoFilterSharp className="font-bold text-xl" />
          </div>

          {/* Infinite Scroll Grid */}
          {loading ? (
            <FullScreen />
          ) : (
            <div className="flex flex-wrap justify-between max-w-[80vw]">
              {events?.map((event: any, idx: any) => (
                <EventOverlayCard event={event} key={idx} />
              ))}

              {/* Observer Target */}
              {hasmore && (
                <div
                  ref={observerRef}
                  className="h-10 flex items-center justify-center"
                >
                  {loading ? "Loading..." : ""}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

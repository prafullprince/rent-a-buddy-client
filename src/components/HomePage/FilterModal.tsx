/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { memo } from "react";
import Toggle from "../Common/Toggle";
import IntergalacticSpinner from "@/loading/Loading1";
import { motion } from "framer-motion";

// data
const Location = ["delhi", "mumbai", "banglore", "pune", "patna"];
const filterRating = ["Highest", "Average", "Lowest"];

const FilterModal = ({
  formData,
  setFormData,
  changeHandler,
  isToggleOpen,
  setIsToggleOpen,
  submitHandler,
  loading,
  setFilterData,
}: any) => {
  console.log("child re-rendered")
  return (
    <div
      className="inset-0 fixed z-[1000] bg-black/50 backdrop-blur-sm overflow-auto flex items-center lg:hidden"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setFilterData(null);
      }}
    >
      <div className="h-fit mx-auto my-4 w-[95%] sm:w-[90%] lg:w-[80%]">
        {/* filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="flex flex-col gap-2 bg-gray-900 p-6 relative border-black/40 rounded-2xl w-[300px] sm:w-[400px] md:w-[450px] lg:w-[500px] sm:max-w-xl mx-auto shadow-2xl"
        >
          {/* heading */}
          <div className="bg-gray-900 font-semibold text-white/40 rounded-t-lg text-xl absolute top-2 w-full right-0 left-0 h-10 flex items-center justify-between px-6">
            Filters
            <button
              aria-label="Close filters"
              onClick={() => {
                setFilterData(null);
              }}
              className="text-xl text-gray-500 font-bold transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-full px-2"
            >
              X
            </button>
          </div>

          {/* body */}
          <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:justify-between w-full gap-2 mt-12">
            <div className="flex flex-col w-full lg:flex-row lg:items-center lg:flex-wrap gap-4">
              {/* location */}
              <div className="flex flex-col gap-2 cursor-pointer">
                <select
                  id="location"
                  className="lg:w-44 cursor-pointer appearance-none rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-medium text-white/70 outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
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
                  className="w-full rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-medium text-white/70 outline-none transition-colors placeholder:text-white/35 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20 lg:w-44"
                  value={formData.username}
                  onChange={changeHandler}
                  name="username"
                />
              </div>

              {/* rating gender */}
              <div className="flex items-center justify-between gap-2 lg:flex-col">
                <div className="flex items-center gap-2">
                  {/* rating */}
                  <div>
                    <select
                      id="rating"
                      className="flex justify-center rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-medium text-white/70 outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20 lg:w-44"
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
                      className="flex justify-center rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-medium text-white/70 outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20 lg:w-44"
                      value={formData.gender}
                      onChange={changeHandler}
                      name="gender"
                    >
                      <option value="">gender</option>
                      <option value="male">male</option>
                      <option value="female">female</option>
                    </select>
                  </div>
                </div>

                {/* available -> toggle */}
                <Toggle
                  isToggleOpen={isToggleOpen}
                  setIsToggleOpen={setIsToggleOpen}
                  setFormData={setFormData}
                />
              </div>

              {/*  */}
            </div>

            {/* button */}
            <div className="flex items-center justify-end gap-3 mt-8 lg:mt-0">
              {/* cancel */}
              <button
                onClick={() => {
                  setFilterData(null);
                }}
                className="lg:hidden block border-slate-400 px-6 py-2 bg-black text-white/80 rounded-full"
              >
                Cancel
              </button>

              {/* apply */}
              <motion.div layoutId="button">
                <button
                  onClick={submitHandler}
                  className="px-6 py-2 bg-yellow-500 font-medium text-black rounded-full cursor-pointer flex items-center gap-2"
                >
                  Apply
                  {loading && <IntergalacticSpinner />}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(FilterModal);

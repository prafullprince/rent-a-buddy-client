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
  return (
    <div className="inset-0 fixed z-[1000] bg-black/50 backdrop-blur-sm overflow-auto flex items-center lg:hidden">
      <div className="h-fit mx-auto my-4 w-[95%] sm:w-[90%] lg:w-[80%]">
        {/* filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-2 bg-gray-100 p-6 relative border-black/40 rounded-lg w-[300px] sm:w-[400px] md:w-[450px] lg:w-[500px] sm:max-w-xl mx-auto shadow-lg"
        >
          {/* heading */}
          <div className="bg-slate-200 font-semibold text-black rounded-t-lg text-xl absolute top-0 w-full right-0 left-0 h-10 flex items-center justify-between px-6">
            Filters
            <button
              onClick={() => {
                setFilterData(null);
              }}
              className="text-xl text-slate-800 font-semibold"
            >
              X
            </button>
          </div>

          {/* body */}
          <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:justify-between w-full gap-2 mt-8">
            <div className="flex flex-col w-full lg:flex-row lg:items-center lg:flex-wrap gap-4">
              {/* location */}
              <div className="flex flex-col gap-2 cursor-pointer">
                <select
                  id="location"
                  className="lg:w-44 px-4 py-2 appearance-none border border-gray-300 cursor-pointer rounded-full outline-none text-slate-600 font-medium text-sm bg-white"
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
                  className="px-4 py-2 appearance-none border border-gray-300 rounded-full outline-none w-full lg:w-44 bg-white text-slate-600 font-medium text-sm placeholder:text-sm"
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
                      className="lg:w-44 px-2 py-2 appearance-none border border-gray-300 cursor-pointer rounded-full outline-none text-slate-600 font-medium text-sm bg-white"
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
                      className="lg:w-44 px-2 py-2 appearance-none border border-gray-300 cursor-pointer rounded-full outline-none text-slate-600 font-medium text-sm bg-white"
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
            <div className="flex items-center justify-end gap-3 mt-4 lg:mt-0">
              {/* cancel */}
              <button
                onClick={() => {
                  setFilterData(null);
                }}
                className="lg:hidden block border-slate-400 px-4 py-[6px] bg-slate-200 rounded-full"
              >
                Cancel
              </button>

              {/* apply */}
              <motion.div layoutId="button">
                <button
                  onClick={submitHandler}
                  className="px-4 py-[6px] bg-black font-medium text-white rounded-full cursor-pointer flex items-center gap-2"
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

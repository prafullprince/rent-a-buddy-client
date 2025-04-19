"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchCategorySubCategory } from "@/service/apiCall/category.api";
import Box from "./Box";
import { useDispatch, useSelector } from "react-redux";
import { createServiceApi } from "@/service/apiCall/event.api";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { setStep } from "@/redux/slice/event.slice";
import FullScreen from "@/loading/FullScreen";
import PlanetSpinner from "@/loading/PageLoadingSpinner";

// BuilderForm
const BuilderForm = () => {

  // event
  const { event } = useSelector((state: any) => state.event);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  // state
  const [categorys, setCategorys] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loading1, setLoading1] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<{
    eventId: string;
    serviceData: {
      id: string;
      subCategories: { id: string; about: string; price: number }[];
    }[];
  }>({
    eventId: event?._id,
    serviceData: [],
  });

  // fetch categories -> apiCall
  const fetchCategoriesData = async () => {
    setLoading(true);
    try {
      const result = await fetchCategorySubCategory();
      setCategorys(result?.data);
      setSelectedCategory(result?.data[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // createService -> apiCall
  const createService = async () => {
    setLoading1(true);
    try {
      // apiCall
      await createServiceApi(selectedData, session?.serverToken);
      dispatch(setStep(3));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading1(false);
    }
  };

  // sideEffects
  useEffect(() => {
    fetchCategoriesData();
  }, []);

  return (
    <div className="w-full mt-6">
      {/* container */}
      {!loading ? (
        <div className="flex flex-col w-full items-start">
          {/* categories */}
          <div className="w-fit flex justify-start gap-2 border-b border-gray-300">
            {categorys?.map((category: any) => (
              <div
                key={category?._id}
                className="cursor-pointer relative"
                onClick={() => setSelectedCategory(category)}
              >
                <div
                  className={`p-2 text-lg ${
                    selectedCategory?._id === category?._id
                      ? "text-gray-950 font-semibold"
                      : " text-gray-500 font-semibold"
                  }`}
                >
                  {category.name}
                </div>

                {selectedCategory?._id === category?._id && (
                  <motion.div
                    layout
                    layoutId="underline"
                    className="absolute left-0 bottom-0 w-full h-[2px] bg-black"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* box */}
          <div className="border p-4 rounded-lg border-gray-200 w-full mt-12 min-w-2xl max-w-2xl">
            {/* card */}
            <Box
              selectedCategory={selectedCategory}
              selectedData={selectedData}
              setSelectedData={setSelectedData}
            />
          </div>

          {/* createService -> button */}
          <div className="flex w-full justify-end mt-8">
            {/*  */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={createService}
                className="px-6 py-2 bg-black text-white rounded-md cursor-pointer flex items-center gap-1"
                layoutId="createService"
              >
                Done
                {loading1 && <PlanetSpinner />}
              </motion.button>
            </div>
          </div>

        </div>
      ) : (
        // <div>Loading...</div>
        <div className="w-full h-full">
          <FullScreen />
        </div>
      )}
    </div>
  );
};

export default BuilderForm;

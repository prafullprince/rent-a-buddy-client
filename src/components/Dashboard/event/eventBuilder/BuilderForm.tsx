"use client"
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchCategorySubCategory } from "@/service/apiCall/category.api";
import Box from "./Box";
import { useSelector } from "react-redux";
import { createServiceApi } from "@/service/apiCall/event.api";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

// BuilderForm
const BuilderForm = () => {

  // event
  const { event } = useSelector((state:any) => state.event);
  const { data: session} = useSession();

  // state
  const [categorys, setCategorys] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loading1,setLoading1] = useState<boolean>(false);
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
    console.log("selectedData", selectedData)
    console.log("sels", selectedData.serviceData);

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
      const result = await createServiceApi(selectedData, session?.serverToken);
      console.log("resultiiii", result);
      
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
          <div className="w-full flex justify-start gap-2 border-b border-gray-300">
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
            <Box selectedCategory={selectedCategory} selectedData={selectedData} setSelectedData={setSelectedData} />
          </div>

          {/* createService -> button */}
          <div className="flex w-full justify-end mt-8">
            {/*  */}
            <div className="flex items-center gap-4">
              <button className="px-3 py-2 bg-black text-white rounded-lg cursor-pointer">
                Cancel
              </button>
              <button onClick={createService} className="px-4 py-2 bg-yellow-400 text-black rounded-lg cursor-pointer">
                Done
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default BuilderForm;

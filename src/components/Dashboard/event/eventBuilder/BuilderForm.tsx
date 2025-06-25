/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchCategorySubCategory } from "@/service/apiCall/category.api";
import Box from "./Box";
import { useDispatch, useSelector } from "react-redux";
import {
  createServiceApi,
  editServiceApi,
  serviceOfParticularEvent,
} from "@/service/apiCall/event.api";
import { useSession } from "next-auth/react";
import { setStep } from "@/redux/slice/event.slice";
import PlanetSpinner from "@/loading/PageLoadingSpinner";
import toast from "react-hot-toast";

// BuilderForm
const BuilderForm = () => {
  // event
  const { event, editService } = useSelector((state: any) => state.event);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  // state
  const [categorys, setCategorys] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loading1, setLoading1] = useState<boolean>(false);
  const [serviceLoading, setServiceLoading] = useState<boolean>(false);
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

  // fetchServiceOfParticularEvent
  const fetchServiceOfParticularEvent = async () => {
    try {
      // apiCall
      const result: any = await serviceOfParticularEvent(
        event?._id,
        session?.serverToken
      );
      setSelectedData((prev: any) => ({
        ...prev,
        serviceData: result?.service?.[0]?.sections?.map((section: any) => ({
          id: section?.categoryId?._id,
          subCategories: section?.subSections?.map((subSection: any) => ({
            id: subSection?.subCategoryId?._id,
            about: subSection?.about,
            price: subSection?.price,
          })),
        })),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // fetch categories -> apiCall
  const fetchCategoriesData = async () => {
    setLoading(true);
    try {
      const result: any = await fetchCategorySubCategory();
      setCategorys(result?.data);
      setSelectedCategory(result?.data[0]);
      if (editService) {
        fetchServiceOfParticularEvent();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // editServiceHandler
  const editServiceHandler = async () => {
    setServiceLoading(true);
    try {
      await editServiceApi(selectedData, session?.serverToken);
      dispatch(setStep(3));
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setServiceLoading(false);
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
          <div className="border md:p-4 rounded-lg border-gray-200 w-full mt-12 max-w-2xl">
            {/* card */}
            <Box
              selectedCategory={selectedCategory}
              selectedData={selectedData}
              setSelectedData={setSelectedData}
            />
          </div>

          {/* createService -> button */}
          {editService ? (
            <div className="flex justify-end mt-8 w-full">
              <div className="flex items-center gap-2">
                {/* next */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      dispatch(setStep(3));
                    }}
                    className="px-3 py-2 rounded-md bg-black text-white text-sm cursor-pointer font-semibold"
                  >
                    Next
                  </button>
                </div>

                {/* edit */}
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={editServiceHandler}
                    className="px-4 py-2 text-sm font-semibold bg-yellow-500 text-black rounded-md cursor-pointer flex items-center gap-1"
                    layoutId="editService"
                  >
                    Save
                    {serviceLoading && <PlanetSpinner />}
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-end mt-8">
              {/*  */}
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={createService}
                  className="px-4 py-2 text-sm bg-black text-white rounded-md cursor-pointer flex items-center gap-1"
                  layoutId="createService"
                >
                  Create
                  {loading1 && <PlanetSpinner />}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <>
            <div className="w-full flex justify-end">
              <div className="flex items-center px-6 py-3 rounded-lg justify-center w-fit h-12 text-zinc-800 bg-black/50">
                <div className="loader1"></div>
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default BuilderForm;

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
  // hook
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
          <div className="flex max-w-full justify-start gap-2 overflow-x-auto border-b border-white/10">
            {categorys?.map((category: any) => (
              <div
                key={category?._id}
                className="cursor-pointer relative"
                onClick={() => setSelectedCategory(category)}
              >
                <div
                    className={`whitespace-nowrap px-3 py-2 text-sm transition-colors sm:text-base ${
                    selectedCategory?._id === category?._id
                      ? "text-white/90 font-semibold"
                      : " text-gray-500 font-medium"
                  }`}
                >
                  {category.name}
                </div>

                {selectedCategory?._id === category?._id && (
                  <motion.div
                    layout
                    layoutId="underline"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-amber-300 to-teal-300"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* box */}
          <div className="mt-8 w-full rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-5">
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
                    className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
                  >
                    Next
                  </button>
                </div>

                {/* edit */}
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={editServiceHandler}
                    className="flex cursor-pointer items-center gap-1 rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200"
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
                  className="flex cursor-pointer items-center gap-1 rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200"
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
          <div className="animate-spin border-2 border-t-0 border-white/80 w-12 h-12 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default BuilderForm;

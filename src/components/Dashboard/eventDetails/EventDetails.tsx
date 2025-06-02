/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";
import { PiCurrencyInrBold } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import { fetchUserDetailsById } from "@/service/apiCall/chat.api";
import { useSession } from "next-auth/react";
import OrderModal from "@/components/Modal/OrderModal";
import { getUserWallet } from "@/service/apiCall/wallet.api";
import { useRouter } from "next/navigation";
import { GoGitPullRequest } from "react-icons/go";
import SubSectionSlider from "@/components/Common/SubSectionSlider";


const EventDetails = ({ eventDetails }: any) => {

  // hooks
  const { data: session, status } = useSession();
  const router = useRouter();

  // state
  const [categoryIds, setCategoryIds] = useState<any>(null);
  const [subSectionDetails, setSubSectionDetails] = useState<any>(null);
  const [currentSubSection, setCurrentSubSection] = useState<any>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  
  // fetchUserDetailsByIds
  const fetchUserDetailsByIds = async () => {
    try {
      const result = await fetchUserDetailsById(session?.serverToken);
      setUserDetails(result);
    } catch (error) {
      console.log(error);
    }
  };

  // sideEffect
  useEffect(() => {
    if (eventDetails?.service?.[0]?.sections?.length) {
      setCategoryIds(eventDetails?.service?.[0]?.sections[0]?.categoryId?._id);
    }
  }, [eventDetails]);

  useEffect(() => {
    if (!categoryIds) return;

    const section = eventDetails?.service?.[0]?.sections.find(
      (section: any) => section?.categoryId?._id === categoryIds
    );
    setSubSectionDetails(section?.subSections);
    setCurrentSubSection(section?.subSections[0]);
  }, [categoryIds, eventDetails?._id]);

  useEffect(() => {
    if(status !== "authenticated") return;
    fetchUserDetailsByIds();
  }, [session]);

  useEffect(() => {
    if (status !== "authenticated") return;
    async function getWallet() {
      try {
        const result = await getUserWallet(session?.serverToken);
        setWallet(result);
      } catch (error) {
        console.log(error);
      }
    }
    getWallet();
  }, [session]);


  return (
    <motion.div className="flex flex-col gap-3 max-w-xl mx-auto break-words text-wrap shadow-sm p-4 rounded-sm bg-gray-100 w-full relative pb-24">
      {/* topbar */}

      {/* profileDetails */}
      <div className="flex gap-4 w-full">
        <Image
          src={eventDetails?.imageUrl || fallbackImage}
          alt="event"
          width={40}
          height={40}
          className="rounded-full w-22 min-w-22 h-22 min-h-22"
        />
        <div className="flex flex-col gap-1">
          {/* username age */}
          <div className="sm:text-xl text-lg font-semibold sm:font-bold text-black/80 max-w-[170px] sm:max-w-[200px] lg:max-w-[300px] break-words text-wrap">
            {eventDetails?.user?.username} 
            <span>(22)</span>
          </div>

          {/* stats */}
          <div></div>

          {/* availability */}
          <p className="text-sm text-gray-500 break-words text-wrap max-w-[140px] sm:max-w-[200px]">
            <span className="text-xs font-bold text-gray-500">
              Availability:
            </span>{" "}
            {eventDetails?.availability}
          </p>

          {/* location */}
          <p className="text-sm text-gray-500 break-words text-wrap max-w-[140px] sm:max-w-[200px]">
            <span className="text-xs font-bold text-gray-500">
              Location:
            </span>{" "}
            {eventDetails?.location}
          </p>

          {/* height */}
          {/* location */}
          <p className="text-sm text-gray-500 break-words text-wrap max-w-[140px] sm:max-w-[200px]">
            <span className="text-xs font-bold text-gray-500">Height:</span>{" "}
            {`160cm`}
          </p>
        </div>
      </div>

      {/* serviceDetails */}
      <div className="flex flex-col gap-3 w-full bg-[#e8e8d7] mt-8 p-4 rounded-lg shadow-sm">
        {/* category */}
        <div className="w-full flex justify-start gap-4">
          {eventDetails?.service?.[0]?.sections?.map((section: any) => (
            <div
              onClick={() => setCategoryIds(section?.categoryId?._id)}
              className="cursor-pointer relative"
              key={section?._id}
            >
              <div className="py-2 font-semibold text-sm">
                {section?.categoryId?.name}
              </div>

              {categoryIds === section?.categoryId?._id && (
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

        {/* subCategoryDetails */}
        <motion.div layoutId={`subsection`} className="w-full flex flex-col mt-2">
          {/* subSections */}
          <div className="max-w-lg">
            <div className="flex justify-start">
              <SubSectionSlider subSectionDetails={subSectionDetails} currentSubSection={currentSubSection} setCurrentSubSection={setCurrentSubSection} />
            </div>
          </div>

          {/* subSectionDetails */}
          <div className="flex flex-col gap-2 mt-4">
            <motion.div
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
            className="flex sm:flex-row sm:items-start gap-4 flex-col">
              <Image
                src={currentSubSection?.subCategoryId?.imageUrl || fallbackImage}
                alt="subSectionImage"
                width={200}
                height={100}
                className="aspect-video rounded-lg"
              />
              <div className="flex flex-col gap-2">
                {/* price */}
                <div className="flex items-center gap-1">
                  <PiCurrencyInrBold className="text-yellow-600 text-lg" />
                  <p className="text-xs">{currentSubSection?.price}/hr</p>
                </div>

                {/* about */}
                <div className="text-gray-600 text-xs">
                  {/* <span className="text-gray-800 font-semibold">About:</span>{" "} */}
                  {currentSubSection?.about}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* post */}
      {/* <div className="">
        <MyPost type="event" eventDetails={eventDetails} />
      </div> */}

      {/* request order */}
      <div className="w-full flex justify-center shadow-sm py-3 bg-gray-50 mt-3 fixed bottom-0 left-0 right-0 max-w-xl mx-auto">
        <button
          onClick={() => {
            setModalData({
              eventId: eventDetails?._id,
              currentSubSection: currentSubSection,
              sender: userDetails?._id,
              receiver: eventDetails?.user?._id,
              heading: "Request Order",
              text1: "Are you sure you want to request this order?",
              text2: "This action cannot be undone.",
              btn1Text: "Request",
              btn2Text: "Cancel",
            });
          }}
          className="px-5 py-3 text-xs cursor-pointer bg-black rounded-full text-white flex items-center gap-2"
        >
          <GoGitPullRequest className="text-base" />
          Request Order
        </button>
      </div>

      {/* modal */}
      <AnimatePresence mode="wait">
        {modalData && (
          <OrderModal modalData={modalData} setModalData={setModalData} key="order-modal" wallet={wallet} router={router} session={session} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventDetails;

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
import MyPost from "../my-profile/MyPost";
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
  console.log("eventDetails", eventDetails);
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
    <motion.div className="flex flex-col gap-3 max-w-xl mx-auto break-words text-wrap shadow-sm p-4 rounded-sm bg-gray-100 w-full">
      {/* topbar */}

      {/* profileDetails */}
      <div className="flex gap-4 w-full">
        <Image
          src={eventDetails?.imageUrl || fallbackImage}
          alt="event"
          width={40}
          height={40}
          className="rounded-full w-28 min-w-28 h-28 min-h-28"
        />
        <div className="flex flex-col gap-1">
          {/* username age */}
          <div className="sm:text-2xl text-xl font-semibold sm:font-bold text-black break-words max-w-[140px] sm:max-w-[200px]">
            {eventDetails?.user?.username} (22)
          </div>

          {/* stats */}
          <div></div>

          {/* availability */}
          <p className="text-sm text-gray-500">
            <span className="text-sm font-semibold text-gray-800">
              Availability:
            </span>{" "}
            {eventDetails?.availability}
          </p>

          {/* location */}
          <p className="text-sm text-gray-500">
            <span className="text-sm font-semibold text-gray-800">
              Location:
            </span>{" "}
            {eventDetails?.location}
          </p>

          {/* height */}
          {/* location */}
          <p className="text-sm text-gray-500">
            <span className="text-sm font-semibold text-gray-800">Height:</span>{" "}
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
              <div className="py-2 font-semibold text-base">
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
            <div className="flex sm:flex-row sm:items-start gap-4 flex-col">
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
                  <p>{currentSubSection?.price}/hr</p>
                </div>

                {/* about */}
                <div className="text-gray-600 text-sm">
                  <span className="text-gray-800 font-semibold">About:</span>{" "}
                  {currentSubSection?.about}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* post */}
      <div className="">
        <MyPost type="event" />
      </div>

      {/* request order */}
      <div className="w-full flex justify-center shadow-sm py-2 bg-gray-300 rounded-lg mt-3">
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
          className="px-5 py-3 text-sm cursor-pointer bg-black rounded-full text-white flex items-center gap-2"
        >
          <GoGitPullRequest className="text-lg" />
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

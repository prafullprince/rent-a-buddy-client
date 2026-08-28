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
// import { GoGitPullRequest } from "react-icons/go";
import SubSectionSlider from "@/components/Common/SubSectionSlider";
import { memo } from "react";

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
  console.log("wallet:  ", wallet);

  // fetchUserDetailsByIds
  const fetchUserDetailsByIds = async () => {
    try {
      const result = await fetchUserDetailsById(session?.serverToken);
      setUserDetails(result);
    } catch (error) {
      console.log(error);
    }
  };

  // sideEffect -> set-category-id of very first category
  useEffect(() => {
    if (eventDetails?.service?.[0]?.sections?.length) {
      setCategoryIds(eventDetails?.service?.[0]?.sections[0]?.categoryId?._id);
    }
  }, [eventDetails]);

  // change section and subsection whenever category-ids are changes
  useEffect(() => {
    if (!categoryIds) return;

    // find current section
    const section = eventDetails?.service?.[0]?.sections.find(
      (section: any) => section?.categoryId?._id === categoryIds,
    );
    setSubSectionDetails(section?.subSections);
    setCurrentSubSection(section?.subSections[0]);
  }, [categoryIds, eventDetails?._id]);

  // user-details-by-ids api call
  useEffect(() => {
    if (status !== "authenticated") return;
    fetchUserDetailsByIds();
  }, [session]);

  // fetch wallet of user
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
    <motion.div
      className="
    relative mx-auto flex w-full max-w-6xl flex-col gap-4 break-words
    rounded-2xl p-4 pb-28 sm:p-6 sm:pb-28

    /* Glassmorphism background */
    bg-black/30 backdrop-blur-2xl
    border border-white/10

    /* Inner shine */
    shadow-[inset_0_0_40px_rgba(255,255,255,0.07)]

  "
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.7fr)] lg:gap-12">
        {/* PROFILE SECTION */}
        <div className="h-fit rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 lg:sticky lg:top-6">
          <div className="flex gap-4 lg:flex-col">
            <Image
              src={eventDetails?.imageUrl || fallbackImage}
              width={50}
              height={50}
              alt="event"
              className="h-14 w-14 rounded-full border border-white/10 object-cover lg:h-24 lg:w-24"
            />

            <div className="flex flex-col gap-1">
              <div className="text-lg font-semibold text-white lg:text-2xl">
                {eventDetails?.user?.username}
                <span className="text-gray-400"> (22)</span>
              </div>

              <p className="text-sm text-gray-400">
                <span className="text-xs text-gray-500 font-semibold">
                  Availability:
                </span>{" "}
                {eventDetails?.availability}
              </p>

              <p className="text-sm text-gray-400">
                <span className="text-xs text-gray-500 font-semibold">
                  Location:
                </span>{" "}
                {eventDetails?.location}
              </p>

              <p className="text-sm text-gray-400">
                <span className="text-xs text-gray-500 font-semibold">
                  Height:
                </span>{" "}
                160cm
              </p>
            </div>
          </div>
        </div>

        {/* SERVICE SECTION */}
        <div className="mt-2 flex flex-col gap-4 lg:mt-0">
          {/* Category Tabs */}
          <div className="w-full flex items-center gap-6 border-b border-white/10">
            {eventDetails?.service?.[0]?.sections?.map((section: any) => (
              <div
                key={section?._id}
                onClick={() => setCategoryIds(section?.categoryId?._id)}
                className={`cursor-pointer text-sm transition relative py-2 ${
                  categoryIds === section?.categoryId?._id
                    ? "text-white font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {section?.categoryId?.name}

                {categoryIds === section?.categoryId?._id && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-[-3px] left-0 h-[2px] w-full bg-gradient-to-r from-amber-300 to-teal-300"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Subsection Slider */}
          <motion.div layoutId="subsection" className="flex flex-col mt-2">
            <SubSectionSlider
              subSectionDetails={subSectionDetails}
              currentSubSection={currentSubSection}
              setCurrentSubSection={setCurrentSubSection}
            />

            {/* Subsection Details */}
            <div className="flex flex-col gap-3 mt-4">
              <motion.div
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Image
                  src={
                    currentSubSection?.subCategoryId?.imageUrl || fallbackImage
                  }
                  alt="subSectionImage"
                  width={200}
                  height={100}
                  className="
              rounded-xl aspect-video object-cover
              border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]
            "
                />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-cyan-400">
                    <PiCurrencyInrBold className="text-xl" />
                    <p className="text-sm text-white/90">
                      {currentSubSection?.price}/hr
                    </p>
                  </div>

                  <p className="text-xs text-gray-300 leading-5">
                    {currentSubSection?.about}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* BOTTOM BUTTON */}
      <div
        className="
    fixed bottom-0 left-0 right-0 mx-auto max-w-6xl
    bg-black/60 backdrop-blur-xl 
    border-t border-white/10 py-4 px-5 rounded-b-sm
  "
      >
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
          className="
        w-full py-3 font-semibold rounded-full
        bg-gradient-to-r from-amber-300 to-teal-300
        text-black shadow-xl shadow-teal-950/20 transition hover:-translate-y-0.5 hover:brightness-105 cursor-pointer
      "
        >
          Request Order
        </button>
      </div>

      {/* modal */}
      <AnimatePresence mode="wait">
        {modalData && (
          <OrderModal
            modalData={modalData}
            setModalData={setModalData}
            key="order-modal"
            wallet={wallet}
            router={router}
            session={session}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(EventDetails);

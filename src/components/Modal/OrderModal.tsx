/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState, memo } from 'react';
import { motion } from "framer-motion";
import { PiCurrencyInrBold } from "react-icons/pi";
import Image from "next/image";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setOpenChatMobile } from "@/redux/slice/chat.slice";
import socket from "@/utills/socket";

const location = ["Delhi", "Mumbai", "Banglore", "Pune", "Hyderabad"];
const prices = [50, 100, 150, 200, 250];

export interface IFormData {
  location: string;
  date: string;
  time: string;
  additionalInfo: string;
  cabFare: number;
  totalPrice: number;
  unit: number;
  subId: any;
  sender: any;
  receiver: any;
  eventId: any;
}

const OrderModal = ({
  modalData,
  setModalData,
  wallet,
  router,
  session,
}: any) => {
  // hook
  const btnRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  // state
  const [formData, setFormData] = useState<IFormData>({
    location: location[0],
    date: "",
    time: "",
    additionalInfo: "",
    cabFare: 50,
    totalPrice: 0,
    unit: 2,
    subId: modalData?.currentSubSection,
    sender: modalData?.sender,
    receiver: modalData?.receiver,
    eventId: modalData?.eventId,
  });
  const [minDate, setMinDate] = useState<string>("");
  const [maxDate, setMaxDate] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // formHandler
  const formHandler = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // sideEffect
  useEffect(() => {
    function clickOutsideHandler(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setModalData(null);
      }
    }
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, []);

  // sideEffect -> totalPrice
  useEffect(() => {
    if (formData.unit && formData.cabFare) {
      setFormData((prevState) => ({
        ...prevState,
        totalPrice:
          formData.unit * modalData?.currentSubSection?.price +
          Number(formData.cabFare),
      }));
    }
  }, [formData.unit, formData.cabFare]);

  // sideEffect -> date
  useEffect(() => {
    const today = new Date();
    const maxDate = new Date();

    maxDate.setDate(today.getDate() + 15);
    const minDate = today.toISOString().split("T")[0];
    const maxDateString = maxDate.toISOString().split("T")[0];
    setMinDate(minDate);
    setMaxDate(maxDateString);
  }, [formData.date]);

  // socket handling -> order status
  useEffect(() => {
    if (!session || !modalData) return;
    if (!socket.connected) socket.connect();

    // handle orderStatus
    socket.on("orderStatus", (data: any) => {
      console.log("orderStatus", data);
      if (data.success) {
        toast.success(data.message);
        router.push(`/chat/${data?.data?.chatId}/user/${data?.data?.receiver}`);
        setLoading(false);
        setModalData(null);
        dispatch(setOpenChatMobile(true));
      }
    });

    // cleanup
    return () => {
      socket.off("orderStatus");
    };
  }, [session, modalData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[1000] flex min-h-full items-center justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-md sm:p-6"
    >
      <div className="my-auto w-full max-w-2xl">
        <motion.div
          ref={btnRef}
          initial={{ y: 18, scale: 0.98 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative mx-auto flex max-h-[calc(100vh-1.5rem)] w-full flex-col gap-2 overflow-y-auto rounded-2xl border border-white/10 bg-[#11151c] p-4 shadow-2xl shadow-black/50 sm:max-h-[calc(100vh-3rem)] sm:p-6"
        >
          {/* heading */}
          <div className="sticky top-0 z-10 -mx-4 -mt-4 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#11151c]/95 px-4 text-base font-semibold text-white backdrop-blur sm:-mx-6 sm:-mt-6 sm:px-6">
            {modalData.heading}
            <button
              type="button"
              aria-label="Close order request"
              onClick={() => {
                setModalData(null);
              }}
              className="rounded-full px-2 text-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              &#10005;
            </button>
          </div>

          {/* body */}
          <div className="mt-5 flex flex-col gap-3">
            {/* currentSubSection */}
            <motion.div
              layoutId={`subsection`}
              className="mt-1 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3"
            >
              {/* left */}
              <div className="flex items-start gap-3">
                <Image
                  src={
                    modalData?.currentSubSection?.subCategoryId?.imageUrl ||
                    fallbackImage
                  }
                  alt="subSectionImage"
                  width={50}
                  height={50}
                  className="h-12 w-12 rounded-xl object-cover sm:h-14 sm:w-14"
                />
                <div className="flex flex-col gap-1">
                  {/* name */}
                  <div className="text-sm font-semibold text-white/80">
                    {modalData?.currentSubSection?.subCategoryId?.name}
                  </div>

                  {/* price */}
                  <div className="flex items-center gap-[2px]">
                    <PiCurrencyInrBold className="text-base text-amber-300" />
                    <p className="text-sm text-white/55">
                      {modalData?.currentSubSection?.price}/hr
                    </p>
                  </div>
                  {/* about */}
                </div>
              </div>

              {/* right -> unit minimum 2 and maximum 10 */}
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  id="unit"
                  className="w-16 rounded-lg border border-white/10 bg-black/30 p-2 text-center text-white outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20 sm:w-20"
                  value={formData.unit}
                  onChange={formHandler}
                  name="unit"
                  min={2}
                  max={10}
                />
                <p className="flex items-center gap-1 text-right text-xs text-white/40">
                  <span className="flex items-center gap-1 font-medium">
                    minimum 2 unit
                  </span>{" "}
                </p>
              </div>
            </motion.div>

            {/* location */}
            <div className="flex flex-col gap-2 mt-2">
              <label
                htmlFor="location"
                className="text-xs font-semibold text-gray-300"
              >
                Location:
              </label>
              <select
                id="location"
                className="w-full rounded-xl border border-white/10 bg-black/25 p-3 text-sm text-white outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                value={formData.location}
                onChange={formHandler}
                name="location"
                required
              >
                {location.map((loc: any, index: number) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* date and time */}
            <div className="mt-2 grid grid-cols-1 items-center gap-3 sm:grid-cols-2">
              <div className="flex w-full flex-col gap-1">
                {/* date */}
                <label
                  htmlFor="date"
                  className="text-xs font-semibold text-gray-300"
                >
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  min={minDate}
                  max={maxDate}
                  placeholder="dd/mm/yyyy"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/25 p-3 text-xs text-white outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                  value={formData.date}
                  onChange={formHandler}
                  name="date"
                />
              </div>

              <div className="flex w-full flex-col gap-1">
                {/* time */}
                <label
                  htmlFor="time"
                  className="text-xs font-semibold text-gray-300"
                >
                  Time:
                </label>
                <input
                  type="time"
                  id="time"
                  className="w-full rounded-xl border border-white/10 bg-black/25 p-3 text-xs text-white outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                  value={formData.time}
                  onChange={formHandler}
                  name="time"
                />
              </div>
            </div>

            {/* additionalInfo */}
            <div className="flex flex-col gap-2 mt-2">
              <label
                htmlFor="additionalInfo"
                className="text-xs font-semibold text-gray-300"
              >
                Additional Info:
              </label>
              <textarea
                id="additionalInfo"
                className="min-h-24 w-full resize-y rounded-xl border border-white/10 bg-black/25 p-3 text-xs text-white outline-none transition-colors placeholder:text-white/35 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                value={formData.additionalInfo}
                onChange={formHandler}
                name="additionalInfo"
                required
                placeholder="Please provide any additional information or special requests.."
              />
            </div>

            {/* cabFare */}
            <div className="flex flex-col gap-2 mt-2">
              <label
                htmlFor="cabFare"
                className="text-xs font-semibold text-gray-300"
              >
                Cab Fare (in rupees):
              </label>
              <select
                id="cabFare"
                className="w-full rounded-xl border border-white/10 bg-black/25 p-3 text-xs text-white outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                value={formData.cabFare}
                onChange={formHandler}
                name="cabFare"
              >
                {prices.map((price: any, index: number) => (
                  <option key={index} value={price}>
                    {price}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                  Cab Fare:
                </span>{" "}
                <PiCurrencyInrBold className="text-yellow-600 text-base" />
                {formData.cabFare}
              </p>
            </div>

            {/* totalPrice */}
            <div className="mt-3 flex w-full justify-end rounded-xl border border-amber-300/15 bg-amber-300/[0.06] p-3">
              <div className="flex flex-col gap-1">
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      Total Price:
                    </span>{" "}
                    <PiCurrencyInrBold className="text-sm text-amber-300" />
                    <span className="text-xs font-semibold text-amber-200">
                      {formData.totalPrice}
                    </span>
                  </p>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                    including Cab Fare
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>

          {/* buttons */}
          <div className="mt-4 grid w-full grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (!wallet) {
                  toast.error("Wallet not found");
                  return;
                }
                if (wallet?.balance < formData.totalPrice) {
                  toast.error(
                    `Insufficient balance, please recharge of ${
                      formData.totalPrice - wallet?.balance
                    }rs`
                  );
                  router.push(`/dashboard/wallet`);
                  return;
                }

                if (!formData.date || !formData.time) {
                  toast.error("Please select date and time");
                  return;
                }
                if (!formData.location) {
                  toast.error("Please select location");
                  return;
                }
                if (!formData.unit) {
                  toast.error("Please select unit");
                  return;
                }
                if (!formData.cabFare) {
                  toast.error("Please select cab fare");
                  return;
                }
                if (!formData.additionalInfo) {
                  toast.error("Please provide additional info");
                  return;
                }

                if (socket) {
                  setLoading(true);
                  socket.emit("requestOrder", formData);
                }
              }}
              disabled={loading}
              aria-disabled={loading}
              className="flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-amber-300 px-3 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {modalData.btn1Text}
              {loading && (
                <div className="flex justify-center items-center px-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
                </div>
              )}
            </button>
            <button
              onClick={() => {
                setModalData(null);
              }}
              className="cursor-pointer rounded-xl border border-white/15 bg-white/[0.06] px-3 py-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {modalData.btn2Text}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default memo(OrderModal);

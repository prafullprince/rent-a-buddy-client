/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PiCurrencyInrBold } from "react-icons/pi";
import Image from "next/image";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  // state
  const [formData, setFormData] = useState<IFormData>({
    location: "",
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
  const [socket, setSocket] = useState<any>(null);
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

  // socket
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");

    // on open
    socket.onopen = () => {
      console.log("socket open");
      // // register
      // socket.send(
      //   JSON.stringify({
      //     type: "register",
      //     payload: {
      //       userId: modalData?.sender,
      //       chatId: modalData?.eventId,
      //     },
      //   })
      // );
    };

    // on error
    socket.onerror = (error) => {
      console.log("socket error", error);
    };

    // on message
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "orderStatus") {
        console.log("orderStatus", data.payload);
        if (data?.payload?.success) {
          toast.success(data?.payload?.message);
          router.push(
            `/chat/${data?.payload?.data?.chatId}/user/${data?.payload?.data?.receiver}`
          );
          setModalData(null);
          setLoading(false);
        } else {
          toast.error(data.payload.message);
          setModalData(null);
          setLoading(false);
        }
      }
    };

    setSocket(socket);

    // clenup socket
    return () => {
      socket.close();
    };
  }, [session]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-center h-screen mx-auto">
        <motion.div
          ref={btnRef}
          className="flex flex-col gap-2 bg-gray-100 p-6 relative border-black/40 rounded-lg w-[350px] lg:w-[500px] max-w-xl mx-auto shadow-lg"
        >
          {/* heading */}
          <div className="bg-gray-700 font-semibold text-pink-100 rounded-t-lg text-xl absolute top-0 w-full right-0 left-0 h-10 flex items-center justify-between px-6">
            {modalData.heading}
            <button
              onClick={modalData.btn2Handler}
              className="text-2xl text-pink-300"
            >
              X
            </button>
          </div>

          {/* body */}
          <div className="flex flex-col gap-2 mt-4">
            {/* currentSubSection */}
            <motion.div
              layoutId={`subsection`}
              className="flex items-center justify-between"
            >
              {/* left */}
              <div className="flex items-start gap-2 mt-6">
                <Image
                  src={
                    modalData?.currentSubSection?.subCategoryId?.imageUrl ||
                    fallbackImage
                  }
                  alt="subSectionImage"
                  width={80}
                  height={60}
                  className="rounded-lg aspect-square"
                />
                <div className="flex flex-col gap-2">
                  {/* name */}
                  <div className="text-gray-600 text-base font-semibold">
                    {modalData?.currentSubSection?.subCategoryId?.name}
                  </div>

                  {/* price */}
                  <div className="flex items-center gap-1">
                    <PiCurrencyInrBold className="text-yellow-600 text-lg" />
                    <p>{modalData?.currentSubSection?.price}/hr</p>
                  </div>
                  {/* about */}
                </div>
              </div>

              {/* right -> unit minimum 2 and maximum 10 */}
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  id="unit"
                  className="w-[70px] p-2 border border-gray-300 rounded-lg outline-none"
                  value={formData.unit}
                  onChange={formHandler}
                  name="unit"
                  min={2}
                  max={10}
                />
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                    minimum 2 unit
                  </span>{" "}
                </p>
              </div>
            </motion.div>

            {/* location */}
            <div className="flex flex-col gap-2 mt-2">
              <label
                htmlFor="location"
                className="text-sm font-semibold text-gray-800"
              >
                Location
              </label>
              <select
                id="location"
                className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                value={formData.location}
                onChange={formHandler}
                name="location"
              >
                {location.map((loc: any, index: number) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* date and time */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex flex-col gap-1 w-full">
                {/* date */}
                <label
                  htmlFor="date"
                  className="text-sm font-semibold text-gray-800"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  min={minDate}
                  max={maxDate}
                  placeholder="dd/mm/yyyy"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                  value={formData.date}
                  onChange={formHandler}
                  name="date"
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                {/* time */}
                <label
                  htmlFor="time"
                  className="text-sm font-semibold text-gray-800"
                >
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none"
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
                className="text-sm font-semibold text-gray-800"
              >
                Additional Info
              </label>
              <textarea
                id="additionalInfo"
                className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                value={formData.additionalInfo}
                onChange={formHandler}
                name="additionalInfo"
              />
            </div>

            {/* cabFare */}
            <div className="flex flex-col gap-2 mt-2">
              <label
                htmlFor="cabFare"
                className="text-sm font-semibold text-gray-800"
              >
                Cab Fare (in rupees)
              </label>
              <select
                id="cabFare"
                className="w-full p-2 border border-gray-300 rounded-lg outline-none"
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
                <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                  Cab Fare:
                </span>{" "}
                <PiCurrencyInrBold />
                {formData.cabFare}
              </p>
            </div>

            {/* totalPrice */}
            <div className="flex justify-end w-full mt-2">
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className="text-base font-semibold text-gray-800 flex items-center gap-1">
                      Total Price:
                    </span>{" "}
                    <PiCurrencyInrBold className="text-yellow-600 text-lg" />
                    <span className="text-yellow-800 text-base">
                      {formData.totalPrice}
                    </span>
                  </p>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                    including Cab Fare
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>

          {/* buttons */}
          <div className="flex w-full justify-start gap-4 mt-4">
            {loading ? (
              <button className="px-4 py-1 bg-black text-white rounded-lg cursor-pointer">
                Loading....
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!wallet) {
                    toast.error("Wallet not found");
                    return;
                  }
                  if (wallet?.balance < formData.totalPrice) {
                    toast.error(
                      `Insufficient balance, please recharge ${
                        formData.totalPrice - wallet?.balance
                      }`
                    );
                    router.push(`/dashboard/wallet`);
                    return;
                  }
                  socket?.send(
                    JSON.stringify({
                      type: "requestOrder",
                      payload: {
                        formData,
                      },
                    })
                  );
                  setLoading(true);
                }}
                className="px-4 py-1 bg-black text-white rounded-lg cursor-pointer"
              >
                {modalData.btn1Text}
              </button>
            )}
            <button
              onClick={() => {
                setModalData(null);
              }}
              className="px-4 py-2 bg-white text-black rounded-lg cursor-pointer"
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

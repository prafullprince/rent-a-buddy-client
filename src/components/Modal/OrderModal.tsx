/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PiCurrencyInrBold } from "react-icons/pi";
import Image from "next/image";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";
import toast from "react-hot-toast";


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
  const PING_INTERVAL = 25000; // 25 seconds
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const RECONNECT_INTERVAL = 3000;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketref = useRef<WebSocket | null>(null);

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

  // socket
  useEffect(() => {

    if(!session || !modalData) return;

    let socket: WebSocket;

    const connectWebSocket = () => {
      socket = new WebSocket("wss://rent-a-buddy-server-1.onrender.com");
      socketref.current = socket;

      // on open
      socket.onopen = () => {
        console.log("socket open");

        // Start pinging
        pingIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "ping" }));
          }
        }, PING_INTERVAL);

        // reconnect
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      // on close
      socket.onclose = (event) => {
        console.log("❌ WebSocket closed", event.reason || event.code);

        // Schedule reconnection
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("🔁 Attempting to reconnect...from order modal");
            connectWebSocket();
          }, RECONNECT_INTERVAL);
        }

        // Stop pinging
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

      };

      // on error
      socket.onerror = (error) => {
        console.log("socket error", error);
      };

      // on message
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
    
          if (data.type === "orderStatus") {
            console.log("orderStatus", data.payload);
    
            if (data?.payload?.success) {
              toast.success(data?.payload?.message);
              router.push(
                `/chat/${data?.payload?.data?.chatId}/user/${data?.payload?.data?.receiver}`
              );
              setLoading(false);
              setModalData(null);
            } else {
              toast.error(data.payload.message);
              setModalData(null);
              setLoading(false);
            }
          }
        } catch (err) {
          console.error("Invalid JSON received via WebSocket:", event.data);
        }
      };
    };
    connectWebSocket();

    // memory cleanup
    return () => {
      if (socketref.current) {
        socketref.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
    
  }, [session, modalData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm overflow-auto"
    >
      <div className="h-fit mx-auto my-4 w-[95%] sm:w-[90%] lg:w-[80%]">
        <motion.div
          ref={btnRef}
          className="flex flex-col gap-2 bg-gray-100 p-6 relative border-black/40 rounded-lg w-[350px] lg:w-[500px] sm:max-w-xl mx-auto shadow-lg"
        >
          {/* heading */}
          <div className="bg-gray-700 font-semibold text-pink-100 rounded-t-lg text-xl absolute top-0 w-full right-0 left-0 h-12 flex items-center justify-between px-6">
            {modalData.heading}
            <button
              onClick={() => {
                setModalData(null);
              }}
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
              className="flex items-center justify-between mt-4"
            >
              {/* left */}
              <div className="flex items-start gap-3">
                <Image
                  src={
                    modalData?.currentSubSection?.subCategoryId?.imageUrl ||
                    fallbackImage
                  }
                  alt="subSectionImage"
                  width={60}
                  height={40}
                  className="rounded-lg aspect-square"
                />
                <div className="flex flex-col gap-1">
                  {/* name */}
                  <div className="text-gray-700 text-sm font-semibold">
                    {modalData?.currentSubSection?.subCategoryId?.name}
                  </div>

                  {/* price */}
                  <div className="flex items-center gap-[2px]">
                    <PiCurrencyInrBold className="text-yellow-600 text-base" />
                    <p className="text-sm text-gray-500">
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
                  className="w-[60px] sm:w-[80px] p-2 border border-gray-300 rounded-lg outline-none"
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
                required
                placeholder="Please provide any additional information or special requests.."
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
                <PiCurrencyInrBold className="text-yellow-600 text-base" />
                {formData.cabFare}
              </p>
            </div>

            {/* totalPrice */}
            <div className="flex justify-end w-full mt-2">
              <div className="flex flex-col gap-1">
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

                if(!formData.date || !formData.time) {
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

                if(socketref?.current?.readyState === WebSocket.OPEN) {
                  console.log("sending order request", socketref?.current?.readyState);
                  socketref.current.send(
                    JSON.stringify({
                      type: "requestOrder",
                      payload: {
                        formData
                      },
                    })
                  );
                  setLoading(true);
                } else {
                  toast.error("Socket not found");
                }
              }}
              disabled={loading}
              aria-disabled={loading}
              className="px-4 py-1 bg-black text-white rounded-lg cursor-pointer flex items-center gap-1"
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

export default OrderModal;

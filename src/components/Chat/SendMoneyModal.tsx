/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { sendMoneyApiCall } from "@/service/apiCall/payment.api";
import { memo, useEffect, useRef } from "react";

const SendMoneyModal = ({
  modalData,
  setModalData,
  setRefreshButton,
  socketRef,
  chatId
}: any) => {
  // hook
  const btnRef = useRef<HTMLDivElement | null>(null);

  // sendMoneyHandler
  const sendMoneyHandler = async () => {
    try {
      await sendMoneyApiCall(
        modalData.amount,
        modalData.receiverId,
        modalData.token,
        modalData.orderId
      );
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({
            type: "reloadChatPage",
            payload: { receiverId: modalData.receiverId, chatId: chatId },
          })
        );
      }
      setRefreshButton((prev: any) => !prev);
      setModalData(null);
    } catch (error: any) {
      console.log(error);
    }
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

  return (
    <div className="fixed inset-0 bg-black/20 z-[1000] backdrop-blur-sm">
      <div className="flex items-center justify-center h-screen mx-auto">
        <div
          ref={btnRef}
          className="flex flex-col gap-2 bg-gray-800 p-6 relative border-gray-400 rounded-lg w-[350px] md:max-w-[500px] md:min-w-[450px]"
        >
          {/* heading */}
          <div className="bg-gray-700 font-semibold text-pink-50 rounded-t-lg text-xl absolute top-0 w-full right-0 left-0 h-12 flex items-center justify-between px-6">
            <div className="">
              {modalData.heading}
              <span className="text-yellow-400 font-semibold">
                {modalData.subHeading}
              </span>
            </div>
            <button
              onClick={modalData.btn2Handler}
              className="text-2xl text-pink-300"
            >
              X
            </button>
          </div>
          {/* text */}
          <div className="py-2 mt-2">
            <p className="text-white mt-8 text-xl">{modalData.text1}</p>
            <p className="text-gray-400 text-sm mt-2">{modalData.text2}</p>
          </div>
          {/* buttons */}
          <div className="flex w-full justify-start gap-4 mt-4">
            <button
              onClick={sendMoneyHandler}
              className="px-4 py-1 bg-yellow-300 text-black font-medium rounded-lg cursor-pointer"
            >
              {modalData.btn1Text}
            </button>
            <button
              onClick={modalData.btn2Handler}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium"
            >
              {modalData.btn2Text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SendMoneyModal);

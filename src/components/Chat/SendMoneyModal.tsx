/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { sendMoneyApiCall } from "@/service/apiCall/payment.api";
import { memo, useEffect, useRef } from "react";

const SendMoneyModal = ({
  modalData,
  setModalData,
  setRefreshButton,
  socket,
  chatId,
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
      if (socket) {
        socket.emit("reloadChatPage", {
          receiverId: modalData.receiverId,
          chatId: chatId,
        });
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
    <div className="fixed inset-0 z-[1000] flex min-h-full items-center justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-md sm:p-6">
      <div className="my-auto w-full max-w-lg">
        <div
          ref={btnRef}
          className="relative flex w-full flex-col gap-2 rounded-2xl border border-white/10 bg-[#11151c] p-4 shadow-2xl shadow-black/50 sm:p-6"
        >
          {/* heading */}
          <div className="-mx-4 -mt-4 flex h-14 items-center justify-between border-b border-white/10 bg-[#11151c] px-4 text-lg font-semibold text-white sm:-mx-6 sm:-mt-6 sm:px-6">
            <div className="">
              {modalData.heading}
              <span className="text-yellow-400 font-semibold">
                {modalData.subHeading}
              </span>
            </div>
            <button
              onClick={modalData.btn2Handler}
              type="button"
              aria-label="Close payment modal"
              className="rounded-full px-2 text-xl text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              &#10005;
            </button>
          </div>
          {/* text */}
          <div className="py-2 mt-2">
            <p className="mt-8 text-xl font-semibold text-white">{modalData.text1}</p>
            <p className="mt-2 text-sm text-white/50">{modalData.text2}</p>
          </div>
          {/* buttons */}
          <div className="mt-4 grid w-full grid-cols-2 gap-3">
            <button
              onClick={sendMoneyHandler}
              className="cursor-pointer rounded-xl bg-amber-300 px-4 py-3 font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200"
            >
              {modalData.btn1Text}
            </button>
            <button
              onClick={modalData.btn2Handler}
              className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 font-medium text-white/75 transition-colors hover:bg-white/10"
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

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState } from "react";
import { PiHandWithdraw } from "react-icons/pi";
import { TbRecharging } from "react-icons/tb";
import RechargeModal from "./RechargeModal";

const Buttons = () => {

  // state
  const [modalData, setModalData] = useState<any>(null);

  // function
  const modalHandler = () => {
    setModalData({
      name: "Recharge Modal",
    })
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <button onClick={modalHandler} className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">
        <TbRecharging className="text-2xl" />
        Recharge
      </button>
      <button onClick={modalHandler} className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-300/20 bg-rose-500/90 px-5 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300">
        <PiHandWithdraw className="text-2xl" />
        Withdraw
      </button>

      {
        modalData &&
        <RechargeModal modalData={modalData} setModalData={setModalData} />
      }
    </div>
  );
};

export default Buttons;

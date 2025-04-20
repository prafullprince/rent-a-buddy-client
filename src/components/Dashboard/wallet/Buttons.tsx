"use client";
import { handleRecharge } from "@/service/apiCall/payment.api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
    <div className="flex items-center gap-4 mt-6">
      <button onClick={modalHandler} className="bg-yellow-300 text-black px-5 font-semibold flex items-center gap-2 py-3 rounded-lg cursor-pointer">
        <TbRecharging className="text-2xl" />
        Recharge
      </button>
      <button onClick={modalHandler} className="bg-red-700 text-white px-5 cursor-pointer py-3 rounded-lg flex items-center gap-2 font-semibold">
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

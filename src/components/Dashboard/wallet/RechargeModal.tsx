"use client";
import { handleRecharge } from "@/service/apiCall/payment.api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdCancel } from "react-icons/md";
import { PiCurrencyInrBold } from "react-icons/pi";
import { TbRecharging } from "react-icons/tb";

const RechargeModal = ({ modalData, setModalData }: any) => {
  const btnRef = React.useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const userDetails = {
    name: session?.user?.name,
    email: session?.user?.email,
  };

  // state
  const [amount, setAmount] = useState(0);

  // function
  async function rechargeHandler() {
    try {
      await handleRecharge(amount, session?.serverToken, 200, router, userDetails);
    } catch (error) {
      console.log(error);
    }
  }

  // function
  const handleClickOutside = (event: any) => {
    if (btnRef.current && !btnRef.current.contains(event.target)) {
      setModalData(null);
    }
  };

  // sideEffect  
  React.useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/20 z-[1000] backdrop-blur-sm">
      <div className="flex items-center justify-center h-screen mx-auto">
        <div
          ref={btnRef}
          className="flex flex-col gap-4 bg-gray-800 p-6 relative border-gray-400 rounded-lg min-w-[350px] max-w-lg"
        >
          {/* heading */}
          <div className="bg-gray-700 font-semibold text-pink-100 rounded-t-lg text-xl absolute top-0 w-full right-0 left-0 h-14 flex items-center justify-between px-6 py-4">
            {modalData.name}
            <button
              onClick={() => setModalData(null)}
              className="text-2xl text-pink-300 cursor-pointer"
            >
              X
            </button>
          </div>

          {/* body */}
          <div className="flex flex-col gap-2 mt-14">
            {/* input */}
            <div className="relative">
              <input
                type="number"
                placeholder="Enter amount"
                className="bg-gray-700 text-white rounded-lg px-12 py-3 outline-none w-full"
                onChange={(e: any) => setAmount(e.target.value)}
                name="amount"
                value={amount}
                min={200}
              />
              <PiCurrencyInrBold className="absolute top-3 left-3 text-2xl text-white" />
            </div>

            {/* options */}
            <div className="flex flex-wrap gap-2 items-center mt-6">
              <div
                onClick={()=>setAmount(50)}
                className="text-black bg-white px-3 py-2 rounded-lg font-semibold text-lg"
              >
                50
              </div>
              <div onClick={()=>setAmount(100)} className="text-black bg-white px-3 py-2 rounded-lg font-semibold text-lg">
                100
              </div>
              <div onClick={()=>setAmount(150)} className="text-black bg-white px-3 py-2 rounded-lg font-semibold text-lg">
                150
              </div>
              <div onClick={()=>setAmount(200)} className="text-black bg-white px-3 py-2 rounded-lg font-semibold text-lg">
                200
              </div>
              <div onClick={()=>setAmount(500)} className="text-black bg-white px-3 py-2 rounded-lg font-semibold text-lg">
                500
              </div>
              <div onClick={()=>setAmount(5000)} className="text-black bg-white px-3 py-2 rounded-lg font-semibold text-lg">
                5000
              </div>
              <div onClick={()=>setAmount(10000)} className="text-black bg-white px-3 py-2 rounded-lg font-semibold text-lg">
                10000
              </div>
            </div>
          </div>

          {/* buttons */}
          <div className="flex w-full justify-end gap-4 mt-6">
            <button
              onClick={() => setModalData(null)}
              className="px-4 py-2 bg-red-100 text-richblack-900 rounded-lg flex items-center gap-2 font-semibold cursor-pointer"
            >
              <MdCancel className="text-3xl" />
              Cancel
            </button>
            <button
              onClick={rechargeHandler}
              className="bg-yellow-300 text-black px-4 font-semibold flex items-center gap-2 py-2 rounded-lg cursor-pointer"
            >
              <TbRecharging className="text-2xl" />
              Recharge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeModal;

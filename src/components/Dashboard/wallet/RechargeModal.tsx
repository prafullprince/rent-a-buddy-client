/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */


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
    <div className="fixed inset-0 z-[1000] flex min-h-full items-center justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-md sm:p-6">
      <div className="my-auto w-full max-w-lg">
        <div
          ref={btnRef}
          className="relative flex max-h-[calc(100vh-1.5rem)] w-full flex-col gap-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#11151c] p-4 shadow-2xl shadow-black/50 sm:max-h-[calc(100vh-3rem)] sm:p-6"
        >
          {/* heading */}
          <div className="sticky top-0 z-10 -mx-4 -mt-4 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#11151c]/95 px-4 text-lg font-semibold text-white backdrop-blur sm:-mx-6 sm:-mt-6 sm:px-6">
            {modalData.name}
            <button
              type="button"
              aria-label="Close recharge modal"
              onClick={() => setModalData(null)}
              className="rounded-full px-2 text-xl text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              &#10005;
            </button>
          </div>

          {/* body */}
          <div className="mt-2 flex flex-col gap-2">
            {/* input */}
            <div className="relative">
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full rounded-xl border border-white/10 bg-black/25 px-12 py-3 text-white outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                onChange={(e: any) => setAmount(e.target.value)}
                name="amount"
                value={amount}
                min={200}
                required
              />
              <PiCurrencyInrBold className="absolute left-3 top-3 text-2xl text-amber-300" />
            </div>

            {/* options */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <div
                onClick={()=>setAmount(50)}
                role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setAmount(50)}
                className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-lg font-semibold text-white transition-colors hover:border-amber-300/50 hover:bg-amber-300/10"
              >
                50
              </div>
              <div onClick={()=>setAmount(100)} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setAmount(100)} className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-lg font-semibold text-white transition-colors hover:border-amber-300/50 hover:bg-amber-300/10">
                100
              </div>
              <div onClick={()=>setAmount(150)} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setAmount(150)} className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-lg font-semibold text-white transition-colors hover:border-amber-300/50 hover:bg-amber-300/10">
                150
              </div>
              <div onClick={()=>setAmount(200)} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setAmount(200)} className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-lg font-semibold text-white transition-colors hover:border-amber-300/50 hover:bg-amber-300/10">
                200
              </div>
              <div onClick={()=>setAmount(500)} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setAmount(500)} className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-lg font-semibold text-white transition-colors hover:border-amber-300/50 hover:bg-amber-300/10">
                500
              </div>
              <div onClick={()=>setAmount(5000)} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setAmount(5000)} className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-lg font-semibold text-white transition-colors hover:border-amber-300/50 hover:bg-amber-300/10">
                5000
              </div>
              <div onClick={()=>setAmount(10000)} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setAmount(10000)} className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-lg font-semibold text-white transition-colors hover:border-amber-300/50 hover:bg-amber-300/10">
                10000
              </div>
            </div>
          </div>

          {/* buttons */}
          <div className="mt-4 grid w-full grid-cols-2 gap-3 sm:mt-6">
            <button
              onClick={() => setModalData(null)}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <MdCancel className="text-3xl" />
              Cancel
            </button>
            <button
              onClick={rechargeHandler}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
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

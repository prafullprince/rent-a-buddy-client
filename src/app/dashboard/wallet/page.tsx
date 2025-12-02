/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Transaction from "@/components/Dashboard/wallet/Transaction";
import Wallet from "@/components/Dashboard/wallet/Wallet";
import { getUserWallet } from "@/service/apiCall/wallet.api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const WalletPage = () => {
  // hooks
  const { data: session } = useSession();

  // state
  const [wallet, setWallet] = useState<any>(null);

  // sideEffect
  useEffect(() => {
    if(!session) return;
    async function getWallet() {
      const result = await getUserWallet(session?.serverToken);
      setWallet(result);
    }
    getWallet();
  }, [session]);

  return (
    <div className="w-full">
      {/* route */}
      <div className="p-4">
        <div className="flex items-center gap-2 ml-12 mt-2 lg:mt-0 lg:ml-0">
          <Link href={"/"} className="text-sm text-[#d5d6da]">
            Home <span>/</span>
          </Link>
          <Link
            href={"/dashboard/my-profile"}
            className="text-sm text-[#d5d6da]"
          >
            Dashboard <span>/</span>
          </Link>
          <Link href={""} className="text-base font-semibold text-yellow-600">
            wallet
          </Link>
        </div>
      </div>

      {/* Wallet */}
      <div className="bg-neutral-800 mx-4 mt-4 rounded-xl">
        <Wallet wallet={wallet} />
      </div>

      {/* Transactions history */}
      <div className="mt-6 mx-4">
        <Transaction />
      </div>
    </div>
  );
};

export default WalletPage;

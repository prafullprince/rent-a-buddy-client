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
    <div className="min-h-screen w-full overflow-hidden bg-[#090b10] bg-[linear-gradient(135deg,rgba(245,158,11,0.08)_0%,transparent_30%,transparent_70%,rgba(20,184,166,0.06)_100%)] px-4 py-5 text-white sm:px-6 lg:px-10">
      {/* route */}
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center gap-2 text-sm">
          <Link href={"/"} className="text-white/45 transition-colors hover:text-amber-200">
            Home <span>/</span>
          </Link>
          <Link
            href={"/dashboard/my-profile"}
            className="text-white/45 transition-colors hover:text-amber-200"
          >
            Dashboard <span>/</span>
          </Link>
          <span className="font-semibold text-amber-300">Wallet</span>
        </div>

        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Money center</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Your wallet</h1>
          <p className="mt-2 text-sm text-white/50">Keep your balance ready for the moments that matter.</p>
        </div>

        {/* Wallet */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20 backdrop-blur-xl">
          <Wallet wallet={wallet} />
        </div>

        {/* Transactions history */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10 backdrop-blur-xl">
          <Transaction />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;

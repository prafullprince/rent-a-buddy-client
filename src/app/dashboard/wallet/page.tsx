"use client";
import Transaction from "@/components/Dashboard/wallet/Transaction"
import Wallet from "@/components/Dashboard/wallet/Wallet"
import { getUserWallet } from "@/service/apiCall/wallet.api"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"

const WalletPage = () => {

  // hooks
  const { data: session } = useSession();

  // state
  const [wallet, setWallet] = useState<any>(null);
  console.log("wallet", wallet);
  // sideEffect
  useEffect(() => {
    async function getWallet() {
      const result = await getUserWallet(session?.serverToken);
      setWallet(result);
    }
    getWallet();
  }, [session]);

  return (
    <div className="w-full">
      {/* Wallet */}
      <div className="bg-gray-100/80 mx-4 mt-8 rounded-xl">
        <Wallet wallet={wallet} />
      </div>

      {/* Transactions history */}
      <div className="mt-6 mx-4">
        <Transaction />
      </div>
    </div>
  )
}

export default WalletPage

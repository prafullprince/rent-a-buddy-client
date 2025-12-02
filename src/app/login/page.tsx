"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
// import "@/styles/globals.css";
import { motion } from "framer-motion";
import LOGO from "@/assets/logo3a.png";

// LoginPage
const LoginPage = () => {
  // state
  const [loading, setLoading] = useState<boolean>(false);

  // loginHandler
  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/dashboard/my-profile",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, x: 200 }}
      exit={{ opacity: 0 }}
      className="text-white flex items-center justify-center my-12 lg:my-36"
    >
      {/* Login Form */}
      <div className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-6 sm:p-8 mx-auto flex flex-col gap-8 bg-[#1e1e1a82]">
        <div className="flex flex-col gap-2 items-center">
          {/* heading */}
          <h1 className="text-xl sm:text-3xl font-extrabold text-center text-wrap break-words max-w-[350px]">
            Welcome to RentBuddy
          </h1>

          {/* para */}
          <p className="text-base font-semibold text-zinc-500 mt-2">
            {loading ? "Logging in..." : "Sign in to proceed"}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-center">
          {/* logo */}
          <Image src={LOGO} alt="logo" className="w-32 h-24" />
        </div>

        {/* login */}
        {loading ? (
          <div className="flex items-center justify-center w-full h-[64px] rounded-xl text-zinc-200 bg-black">
            <div className="loader1"></div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <button
              className="text-white/70 font-bold py-3 px-3 rounded-xl cursor-pointer bg-black/60 flex items-center justify-center gap-2 hover:bg-black/90 duration-300 transition-all w-full max-w-[300px]"
              onClick={handleLogin}
            >
              <FcGoogle className="text-2xl" />
              <p className="text-sm">Continue with Google</p>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LoginPage;

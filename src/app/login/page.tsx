"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import "@/styles/globals.css";
import { motion } from "framer-motion";
import LOGO from "@/assets/logoHomeIcon.png";

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
      className="min-h-screen text-black flex items-center justify-center"
    >
      {/* Login Form */}
      <div className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-8 mx-auto flex flex-col gap-8 m-4 bg-white">
        <div className="flex flex-col gap-2 items-center">
          {/* logo */}
          <Image src={LOGO} alt="logo" className="w-32 h-24" />

          {/* heading */}
          <h1 className="text-3xl font-extrabold mt-8 text-center text-wrap break-words">
            Welcome to RentBuddy
          </h1>

          {/* para */}
          <p className="text-base font-semibold text-zinc-700">
            {loading ? "Logging in..." : "Sign in to proceed"}
          </p>
        </div>

        {/* login */}
        {loading ? (
          <div className="flex items-center justify-center w-full h-16 text-zinc-200 bg-white">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <button
              className="text-black font-bold py-3 px-5 rounded-xl cursor-pointer bg-zinc-200 flex items-center gap-3 hover:scale-95 duration-300 transition-all w-fit"
              onClick={handleLogin}
            >
              <FcGoogle className="text-4xl" />
              <p className="text-lg">Continue with Google</p>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LoginPage;

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
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-[calc(100vh-7rem)] items-center justify-center overflow-hidden bg-[#090b10] bg-[linear-gradient(135deg,rgba(245,158,11,0.1)_0%,transparent_32%,transparent_68%,rgba(20,184,166,0.08)_100%)] px-4 py-8 text-white sm:px-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_28%)]" />
      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-8 rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-10"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10 p-2 shadow-lg shadow-amber-300/10">
            <Image src={LOGO} alt="RentBuddy logo" className="h-full w-full object-contain" priority />
          </div>
          {/* heading */}
          <h1 className="max-w-[350px] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome to RentBuddy
          </h1>

          {/* para */}
          <p className="mt-2 text-sm font-medium text-white/50 sm:text-base">
            {loading ? "Logging in..." : "Sign in to proceed"}
          </p>
        </div>

        {/* login */}
        {loading ? (
          <div className="flex h-14 w-full items-center justify-center rounded-xl border border-white/10 bg-black/30 text-zinc-200">
            <div className="loader1"></div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <button
              type="button"
              className="flex w-full max-w-[300px] cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-3 py-3 font-semibold text-black shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              onClick={handleLogin}
            >
              <FcGoogle className="text-2xl" />
              <p className="text-sm">Continue with Google</p>
            </button>
          </div>
        )}
        <p className="text-center text-xs leading-5 text-white/35">Connect with your account to discover trusted companions and meaningful plans.</p>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;

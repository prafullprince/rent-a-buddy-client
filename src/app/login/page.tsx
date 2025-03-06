"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import logo from "../../assets/Screenshot 2025-02-03 at 23.53.50.png";
import Image from "next/image";
import '@/styles/globals.css';


// LoginPage
const LoginPage = () => {
  // state
  const [loading, setLoading] = useState<Boolean>(false);

  // loginHandler
  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-200 min-h-screen text-black flex items-center justify-center">
      {/* Login Form */}
      <div className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-8 mx-auto flex flex-col gap-8 m-4 bg-white">
        <div className="flex flex-col gap-2 items-center">
          {/* logo */}
          <Image src={logo} alt="logo" className="w-32 h-32" />

          {/* heading */}
          <h1 className="text-4xl font-extrabold mt-2 text-center text-wrap break-words">
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
          <button
            className="text-black font-bold py-2 px-4 rounded-xl cursor-pointer bg-zinc-200 flex items-center gap-4"
            onClick={handleLogin}
          >
            <FcGoogle className="text-3xl" />
            <p>Continue with Google</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

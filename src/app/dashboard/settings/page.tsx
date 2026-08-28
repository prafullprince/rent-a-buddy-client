/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import Label from "@/components/ui/Label";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  fetchUserDetailsById,
  updateProfileApiCall,
  updateProfilePictureApiCall,
} from "../../../service/apiCall/user.api";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";
import toast from "react-hot-toast";
import PlanetSpinner from "@/loading/PageLoadingSpinner";
import { motion } from "framer-motion";
import IntergalacticSpinner from "@/loading/Loading1";
import { useRouter } from "next/navigation";

const Page = () => {
  // hook
  const imageRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm();

  // state
  const [userDetails, setUserDetails] = useState<any>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [dpLoading, setDpLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  // imageChangeHandler
  const imageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
      setValue("thumbnail", e.target.files);
    }
  };

  // uploadProfilePicture
  const uploadProfilePicture = async () => {
    const formData = new FormData();
    const currentValues = getValues();
    formData.append("thumbnail", currentValues.thumbnail[0]);
    setDpLoading(true);
    try {
      await updateProfilePictureApiCall(session?.serverToken, formData);
      toast.success("Profile picture updated successfully");
      setPreview("");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log(error);
    } finally {
      setDpLoading(false);
    }
  };

  // formDataUpdated
  const isFormUpdated = () => {
    if (userDetails) {
      const currentValues = getValues();
      if (
        currentValues.username !== userDetails.username ||
        currentValues.phoneNumber !== userDetails.phoneNumber
      ) {
        return true;
      } else {
        toast.error("No changes made");
        return false;
      }
    }
  };

  // submitHandler
  const onsubmit = async (data: any) => {
    console.log(data);
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("phoneNumber", data.phoneNumber);

    if (isFormUpdated()) {
      setLoading(true);
      try {
        await updateProfileApiCall(session?.serverToken, formData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  // fetchUserDetailsById
  const fetchUserDetailsByIds = async () => {
    setUserLoading(true);
    try {
      const result = await fetchUserDetailsById(session?.serverToken);
      console.log("result", result);
      setUserDetails(result);
    } catch (error) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  };

  // sideEffect
  useEffect(() => {
    if (status === "authenticated" && session?.serverToken) {
      fetchUserDetailsByIds();
      setValue("username", userDetails?.username);
      setValue("phoneNumber", userDetails?.phoneNumber);
    }
  }, [session, status, refresh]);

  // reset form because useForm run initially
  useEffect(() => {
    if (userDetails) {
      reset({
        username: userDetails.username,
        phoneNumber: userDetails.phoneNumber,
      });
    }
  }, [userDetails, reset]);

  // session
  if (!session) return null;
  if (!userDetails)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-200"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen overflow-hidden bg-[#090b10] bg-[linear-gradient(135deg,rgba(245,158,11,0.08)_0%,transparent_30%,transparent_70%,rgba(20,184,166,0.06)_100%)] px-4 py-5 text-white sm:px-6 lg:px-10">
      {/* route */}
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        <div className="flex items-center gap-2 text-sm">
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer text-white/45 transition-colors hover:text-amber-200"
          >
            Home <span>/</span>
          </div>
          <div
            onClick={() => router.push("/dashboard/my-profile")}
            className="cursor-pointer text-white/45 transition-colors hover:text-amber-200"
          >
            Dashboard <span>/</span>
          </div>
          <span className="font-semibold text-amber-300">Settings</span>
        </div>
      </div>

      {/*  */}
      {userLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-100"></div>
          </div>
        </div>
      ) : (
        <div className="mt-7 w-full">
          {/* Box */}
          <div className="flex flex-col gap-6">
            {/* heading */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Account center</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Edit profile</h1>
              <p className="mt-2 text-sm text-white/50">Keep your public details current and recognizable.</p>
            </div>

            {/* change profilePictire */}
            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* pp */}
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    imageRef?.current?.click();
                  }}
                >
                  {preview ? (
                    <Image
                      src={preview || fallbackImage}
                      alt="profile"
                      width={100}
                      height={100}
                      priority
                      className="h-24 w-24 rounded-full border-2 border-amber-300/30 object-cover shadow-lg shadow-black/20"
                    />
                  ) : (
                    <Image
                      src={userDetails?.image || fallbackImage}
                      alt="profile"
                      width={96}
                      height={96}
                      priority
                      className="h-24 w-24 rounded-full border-2 border-white/10 object-cover shadow-lg shadow-black/20"
                    />
                  )}
                  <input
                    type="file"
                    {...register("thumbnail")}
                    onChange={imageChangeHandler}
                    className="hidden"
                    ref={imageRef}
                  />
                  {errors.thumbnail && (
                    <p className="text-sm text-green-700 mt-2">
                      {errors.thumbnail.message as string}
                      <br />
                    </p>
                  )}
                </div>

                {/* buttons */}
                <div className="flex flex-col items-start gap-2">
                  <h3 className="text-base font-semibold text-white">
                    Change profile picture
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {!preview && (
                      <button
                        onClick={() => {
                          imageRef.current?.click();
                        }}
                        className="cursor-pointer rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                      >
                        Change
                      </button>
                    )}
                    {preview && (
                      <motion.button
                        layoutId="submitbuttonofupdatedp"
                        onClick={() => {
                          uploadProfilePicture();
                        }}
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                      >
                        Submit
                        {dpLoading && <IntergalacticSpinner />}
                      </motion.button>
                    )}
                    {preview && (
                      <button
                        onClick={() => {
                          setPreview("");
                        }}
                        className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* change details */}
            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 lg:max-w-3xl">
              <form
                onSubmit={handleSubmit(onsubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-4">
                  {/* username */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label labelname="Username" />
                    <input
                      className="w-full rounded-xl border border-white/10 bg-black/25 p-3 text-sm text-white/80 outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                      {...register("username")}
                      placeholder="change username"
                      type="text"
                    />
                  </div>

                  {/* phoneNumber */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label labelname="Phone Number" />
                    <input
                      className="w-full rounded-xl border border-white/10 bg-black/25 p-3 text-sm text-white/80 outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                      {...register("phoneNumber")}
                      placeholder="change phone number"
                      type="text"
                      max={10}
                      min={10}
                    />
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label labelname="Bio" />
                    <textarea
                      className="min-h-32 w-full resize-y rounded-xl border border-white/10 bg-black/25 p-3 text-sm text-white/80 outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                      {...register("about")}
                      placeholder="change bio"
                      rows={5}
                      cols={30}
                      name="about"
                      id="Bio"
                    />
                  </div>
                </div>

                <div className="flex justify-end w-full">
                  <motion.button
                    layoutId="submitbuttonofsettings"
                    type="submit"
                    className="flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-amber-300 px-5 py-2 text-base font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                  >
                    Submit
                    {loading && <PlanetSpinner />}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

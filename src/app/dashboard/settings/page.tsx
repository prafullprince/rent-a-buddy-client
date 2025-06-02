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
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );

  return (
    <div className="">
      {/* route */}
      <div className="p-4 mt-2">
        <div className="flex items-center gap-2">
          <div
            onClick={() => router.push("/")}
            className="text-sm text-[#838894] cursor-pointer"
          >
            Home <span>/</span>
          </div>
          <div
            onClick={() => router.push("/dashboard/my-profile")}
            className="text-sm text-[#838894] cursor-pointer"
          >
            Dashboard <span>/</span>
          </div>
          <span className="text-base font-semibold text-yellow-600">
            settings
          </span>
        </div>
      </div>

      {/*  */}
      {userLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      ) : (
        <div className="px-6 w-full">
          {/* Box */}
          <div className="flex flex-col gap-4">
            {/* heading */}
            <h2 className="text-xl mt-4 font-semibold text-black">
              Edit Profile
            </h2>

            {/* change profilePictire */}
            <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between bg-black/5 px-4 py-4 rounded-lg sm:min-w-lg sm:max-w-lg w-full shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
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
                      className="rounded-full min-h-24 max-h-24"
                    />
                  ) : (
                    <Image
                      src={userDetails?.image || fallbackImage}
                      alt="profile"
                      width={96}
                      height={96}
                      priority
                      className="rounded-full min-h-24 max-h-24"
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
                  <h3 className="text-sm font-semibold">
                    Change Profile Picture
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {!preview && (
                      <button
                        onClick={() => {
                          imageRef.current?.click();
                        }}
                        className="cursor-pointer bg-yellow-400 px-3 py-[6px] rounded-lg text-sm font-semibold"
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
                        className="cursor-pointer bg-black text-white px-3 py-[6px] rounded-lg text-sm font-semibold flex items-center gap-2"
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
                        className="cursor-pointer bg-yellow-300 px-3 py-[6px] rounded-lg text-sm font-semibold text-black"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* change details */}
            <div className="shadow-md px-6 py-4 rounded-lg bg-black/5 sm:min-w-lg sm:max-w-lg w-full">
              <form
                onSubmit={handleSubmit(onsubmit)}
                className="flex flex-col gap-10"
              >
                <div className="flex flex-col gap-4">
                  {/* username */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label labelname="Username" />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-lg outline-none shadow-sm bg-white text-sm"
                      {...register("username")}
                      placeholder="change username"
                      type="text"
                    />
                  </div>

                  {/* phoneNumber */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label labelname="Phone Number" />
                    <input
                      className="w-full p-2 border border-gray-300 rounded-lg outline-none shadow-sm bg-white text-sm"
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
                      className="w-full p-2 border shadow-sm border-gray-300 rounded-lg outline-none bg-white text-sm"
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
                    className="w-fit px-4 py-2 rounded-lg bg-black text-white text-base cursor-pointer flex items-center gap-2"
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

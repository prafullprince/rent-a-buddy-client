"use client";
import GradientInput from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";

const page = () => {
  // hook
  const { data: session } = useSession();

  // form-hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // submitHandler
  const onsubmit = (data: any) => {
    console.log(data);
  };

  // session
  if (!session) return null;

  return (
    <div className="p-6">
      {/* Box */}
      <div className="flex flex-col gap-4">
        {/* heading */}
        <h2 className="text-2xl mt-6 font-semibold text-black">Edit Profile</h2>

        {/* change profilePictire */}
        <div className="shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] px-6 py-4 rounded-lg bg-black/5 min-w-lg max-w-xl">
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="flex flex-col gap-10"
          >
            {/* profile image */}
            <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between">
              {/* left */}
              <div className="flex items-center gap-4">
                {/* pp */}
                <Image
                  src={session?.user?.image}
                  alt="profile"
                  width={100}
                  height={100}
                  className="rounded-full"
                />

                {/* buttons */}
                <div className="flex flex-col items-start gap-2">
                  <h3 className="text-lg font-medium">
                    Change Profile Picture
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="cursor-pointer bg-yellow-400 px-4 py-2 rounded-lg text-base font-semibold">
                      Change
                    </button>
                    <button className="cursor-pointer bg-black px-4 py-2 rounded-lg text-base font-semibold text-white">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* username */}
              <div className="flex flex-col gap-1">
                <Label labelname="Username" />
                <GradientInput
                  name="username"
                  register={register}
                  placeholder="change username"
                  type="text"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs italic">
                    Username is required
                  </p>
                )}
              </div>

              {/* phoneNumber */}
              <div className="flex flex-col gap-1">
                <Label labelname="Phone Number" />
                <GradientInput
                  name="phoneNumber"
                  register={register}
                  placeholder="change phone number"
                  type="text"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs italic">
                    Phone Number is required
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1">
                <Label labelname="Bio" />
                <GradientInput
                  name="about"
                  register={register}
                  placeholder="change bio"
                  type="text"
                />
                {errors.about && (
                  <p className="text-red-500 text-xs italic">Bio is required</p>
                )}
              </div>
            </div>

            <div className="flex justify-end w-full">
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-yellow-400 text-black text-xl cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;

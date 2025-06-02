/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Label from "@/components/ui/Label";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloudUploadOutline } from "react-icons/io5";
import "@/styles/globals.css";
import Image from "next/image";
import { createPostApiCall } from "@/service/apiCall/user.api";

// EventForm
const PostForm = () => {
  // hook
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const imageRef = useRef<any>(null);
  const { data: session } = useSession();

  // state
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // changeHandler
  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
      setValue("imageUrl", e.target.files);
    }
  }

  // submitHandler
  async function onsubmit(data: any) {
    // make formdata
    const formdata = new FormData();
    formdata.append("imageUrl", data.imageUrl[0]);

    setLoading(true);
    // make api call -> createPost
    try {
      const result = await createPostApiCall(session?.serverToken, formdata);
        console.log("result", result);
    } catch (error) {
      console.log("error in createEvent", error);
    } finally {
      setLoading(false);
      setPreview("");
    }

    // reset form
    reset({
      imageUrl: "",
    });
  }

  return (
    <div className="sm:w-full mt-6 max-w-fit">
      {/* form */}
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="flex flex-col gap-4 sm:max-w-lg sm:min-w-lg max-w-56"
      >
        <div className="flex flex-col gap-4">
          {/* thumbnail */}
          <div
            onClick={() => imageRef.current?.click()}
            className="flex flex-col gap-[6px] cursor-pointer"
          >
            <Label labelname="Thumbnail" />
            <input
              className="text-slate-100 bg-slate-800 hidden"
              type="file"
              {...register("imageUrl", {
                required: "Upload a thumbnail",
                // validate: {
                //   lessThan1MB: (files) =>
                //     files[0]?.size < 100 * 1024 * 1024 ||
                //     "File size must be less than 100MB",
                //   acceptedFormats: (files) =>
                //     ["image/jpeg", "image/png", "application/pdf"].includes(
                //       files[0]?.type
                //     ) || "Only JPEG, PNG, or PDF files are allowed",
                //   required: (files) => files.length >= 1 || "Upload thumbnail",
                // },
              })}
              ref={imageRef}
              onChange={changeHandler}
            />
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                priority
                width={500}
                height={500}
                className="w-full h-[300px] object-cover bg-center bg-cover rounded-md shadow-xl transition-all duration-300"
              />
            ) : (
              <div className="shadow-lg transition-all duration-300 w-full h-[300px] border border-[#2C333F] border-dashed rounded-lg flex flex-col gap-8 items-center justify-center py-8 bg-white">
                {/* icon */}
                <div className="">
                  <div className="h-16 w-16 rounded-full bg-[#ced8d9] flex justify-center items-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
                    <IoCloudUploadOutline className="text-[#373110] text-4xl" />
                  </div>
                </div>
                {/* text */}
                <div className="max-w-[220px] text-[#999DAA] text-center text-xs">
                  Drag and drop an image, or{" "}
                  <span className="text-[#FFD60A] text-sm font-semibold">
                    Browse{" "}
                  </span>
                  Max 1MB each (only image)
                </div>
                {/* size */}
                <div className="flex items-center px-4 gap-6 text-xs max-w-[380px] text-[#6E727F]">
                  <div>Aspect ratio 16:9</div>
                  <div>Recommended size 1024x576</div>
                </div>
              </div>
            )}
            {errors.imageUrl && (
              <p className="text-sm text-green-700 mt-2">
                {errors.imageUrl.message as string}
                <br />
              </p>
            )}
          </div>
        </div>

        {/* button */}
        <>
          {loading ? (
            <>
              <div className="w-full flex justify-end">
                <div className="flex items-center px-6 py-3 rounded-lg justify-center w-fit h-12 text-zinc-800 bg-black/50">
                  <div className="loader1"></div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-yellow-300 text-black text-base cursor-pointer font-semibold"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </>
      </form>
    </div>
  );
};

export default PostForm;

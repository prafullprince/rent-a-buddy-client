/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import GradientInput from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { createEvent, editEventApi } from "@/service/apiCall/event.api";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloudUploadOutline } from "react-icons/io5";
import "@/styles/globals.css";
import { useDispatch, useSelector } from "react-redux";
import { setEditService, setEvent, setStep } from "@/redux/slice/event.slice";
import Image from "next/image";

// EventForm
const EventForm = () => {
  // hook
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const imageRef = useRef<any>(null);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { editEvent, event } = useSelector((state: any) => state.event);

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

  // isFormUpdated
  const isFormUpdated = () => {
    if (editEvent) {
      const currentValues = getValues();
      if (
        currentValues.availability !== event.availability ||
        currentValues.location !== event.location ||
        currentValues.imageUrl !== event.imageUrl
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  // submitHandler
  async function onsubmit(data: any) {
    if (editEvent) {
      try {
        if (isFormUpdated()) {
          const currentValues = getValues();
          const formData = new FormData();
          formData.append("eventId", event?._id);
          if (
            currentValues.availability &&
            currentValues.availability !== event.availability
          ) {
            formData.append("availability", data.availability);
          }
          if (
            currentValues.location &&
            currentValues.location !== event.location
          ) {
            formData.append("location", data.location);
          }
          if (currentValues.imageUrl && currentValues.imageUrl.length > 0) {
            formData.append("imageUrl", data.imageUrl[0]); // Ensure correct file appending
          }

          // apiCall
          try {
            const result = await editEventApi(formData, session?.serverToken);
            if (result) {
              dispatch(setStep(2));
              dispatch(setEditService(true));
              // dispatch(setEvent(result));
            }
          } catch (error) {
            console.log("error in editEventHandler", error);
          }
        }
      } catch (error) {
        console.log(error);
      }
      return;
    }

    // make formdata
    const formdata = new FormData();
    formdata.append("availability", data.availability);
    formdata.append("location", data.location);
    formdata.append("imageUrl", data.imageUrl[0]);

    setLoading(true);
    // make api call -> createEvent
    try {
      const result = await createEvent(formdata, session?.serverToken);
      dispatch(setStep(2));
      dispatch(setEditService(true));
      dispatch(setEvent(result));
    } catch (error) {
      console.log("error in createEvent", error);
    } finally {
      setLoading(false);
      setPreview("");
    }

    // reset form
    reset({
      availability: "",
      location: "",
      imageUrl: "",
    });
  }

  // sideEffect
  useEffect(() => {
    if (editEvent) {
      setValue("availability", event?.availability);
      setValue("location", event?.location);
      setValue("imageUrl", event?.imageUrl);
      setPreview(event?.imageUrl);
    }
  }, []);

  return (
    <div className="w-full mt-6">
      {/* form */}
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="flex flex-col gap-4 sm:max-w-lg sm:min-w-lg w-full"
      >
        <div className="flex flex-col gap-4">
          {/* availability */}
          <div className="flex flex-col gap-1">
            <Label labelname="Availability" />
            <GradientInput
              type="text"
              placeholder="Type availability date and time range"
              register={register}
              name="availability"
              errors={errors}
              className="w-full"
            />
            {errors.availability && (
              <p className="text-sm text-green-700 mt-2">
                {errors.availability.message as string}
                <br />
              </p>
            )}
          </div>

          {/* location */}
          <div className="flex flex-col gap-1 cursor-pointer">
            <Label labelname="Location" />
            <select
              className="w-full h-12 rounded-sm px-2 shadow-sm border border-gray-300 outline-none bg-white"
              {...register("location", {
                required: "Please select a location",
              })}
            >
              <option value="">Select an option</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="patna">Patna</option>
              <option value="pune">Pune</option>
            </select>
            {errors.location && (
              <p className="text-sm text-green-700 mt-2">
                {errors.location.message as string}
                <br />
              </p>
            )}
          </div>

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
        {editEvent ? (
          <>
            <div className="w-full flex justify-end">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-3 py-2 rounded-md bg-black text-white text-sm cursor-pointer font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    dispatch(setEditService(true));
                    dispatch(setStep(2));
                  }}
                  className="px-3 py-2 rounded-md bg-yellow-400 text-black text-sm cursor-pointer font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
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
                    className="px-3 py-[6px] rounded-lg bg-yellow-300 text-black text-base cursor-pointer font-semibold"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default EventForm;

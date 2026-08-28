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
// import "@/styles/globals.css";
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
      dispatch(setEditService(false));
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
        className="flex w-full max-w-3xl flex-col gap-5"
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
              className="h-12 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white/90 outline-none transition-colors focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
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
                className="h-56 w-full rounded-2xl object-cover shadow-xl transition-all duration-300 sm:h-72"
              />
            ) : (
              <div className="flex h-56 w-full flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-white/15 bg-black/25 py-8 text-white/90 shadow-lg transition-all duration-300 hover:border-amber-300/50 sm:h-72">
                {/* icon */}
                <div className="">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-300 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
                    <IoCloudUploadOutline className="text-4xl text-black" />
                  </div>
                </div>
                {/* text */}
                <div className="max-w-[220px] text-[#999DAA] text-center text-xs">
                  Drag and drop an image, or{" "}
                    <span className="text-sm font-semibold text-amber-300">
                    Browse{" "}
                  </span>
                  Max 1MB each (only image)
                </div>
                {/* size */}
                <div className="flex max-w-[380px] flex-wrap items-center justify-center gap-3 px-4 text-center text-xs text-white/35 sm:gap-6">
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
                  onClick={() => {
                    dispatch(setEditService(true));
                    dispatch(setStep(2));
                  }}
                  className="cursor-pointer rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200"
                >
                  Next
                </button>

                <button
                  type="submit"
                  className="cursor-pointer rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black/50"
                >
                  Save
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
                    className="cursor-pointer rounded-xl bg-amber-300 px-5 py-2 text-base font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-amber-200"
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

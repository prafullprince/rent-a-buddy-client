/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React from "react";
import BuilderForm from "./BuilderForm";
import { useSelector } from "react-redux";

const EventBuilder = () => {
  const { editService } = useSelector((state: any) => state.event);

  return (
    <div className="flex w-full flex-col gap-2">
      {/* heading */}
      <div className="">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Step 2</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">
          {editService ? "Edit Service" : "Create Services"}
        </h2>
        <p className="mt-1 text-sm text-white/50">Choose your services and describe what you offer.</p>
      </div>

      {/* Builder /> */}
      <BuilderForm />
    </div>
  );
};

export default EventBuilder;

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React from "react";
import BuilderForm from "./BuilderForm";
import { useSelector } from "react-redux";

const EventBuilder = () => {
  const { editService } = useSelector((state: any) => state.event);

  return (
    <div className="flex flex-col gap-2 w-fit">
      {/* heading */}
      <div className="">
        <h2 className="text-xl font-semibold text-[#e11313]">
          {editService ? "Edit Service" : "Create Services"}
        </h2>
      </div>

      {/* Builder /> */}
      <BuilderForm />
    </div>
  );
};

export default EventBuilder;

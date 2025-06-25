/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import React from "react";
import { MdDescription } from "react-icons/md";
import { PiCurrencyInr } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";

// Box
const Box = ({ selectedCategory, selectedData, setSelectedData }: any) => {
  console.log("selectedDataInsideBox", selectedData);
  // Check if subcategory is selected
  const isSelected = (subCategoryId: string) => {
    return selectedData?.serviceData?.some((service: any) =>
      service?.subCategories?.some((sub: any) => sub.id === subCategoryId)
    );
  };

  // Handle tick click (Select / Deselect Subcategory)
  const handleSelect = (categoryId: string, subCategory: any) => {
  setSelectedData((prev: any) => {
    let updatedServiceData = Array.isArray(prev?.serviceData)
      ? prev.serviceData.map((service: any) => {
          if (service.id === categoryId) {
            const exists = service.subCategories.some(
              (sub: any) => sub.id === subCategory._id
            );

            const updatedSubCategories = exists
              ? service.subCategories.filter(
                  (sub: any) => sub.id !== subCategory._id
                )
              : [
                  ...service.subCategories,
                  { id: subCategory._id, about: "", price: 0 },
                ];

            return {
              ...service,
              subCategories: updatedSubCategories,
            };
          }
          return service;
        })
      : [];

    // Remove categories with no subcategories
    updatedServiceData = updatedServiceData.filter(
      (service: any) => service.subCategories.length > 0
    );

    // If category does not exist at all, add it
    const alreadyExists = updatedServiceData.some(
      (service: any) => service.id === categoryId
    );

    if (!alreadyExists) {
      updatedServiceData.push({
        id: categoryId,
        subCategories: [{ id: subCategory?._id, about: "", price: 0 }],
      });
    }

    return {
      ...prev,
      serviceData: updatedServiceData,
    };
  });
};


  // Handle input change for both price & description
  const handleInputChange = (
    categoryId: string,
    subCategoryId: string,
    field: "price" | "about",
    value: string | number
  ) => {
    setSelectedData((prev: any) => ({
      ...prev,
      serviceData: prev?.serviceData?.map((service: any) =>
        service.id === categoryId
          ? {                         
              ...service,
              subCategories: service.subCategories?.map((sub: any) =>
                sub.id === subCategoryId ? { ...sub, [field]: value } : sub
              ),
            }
          : service
      ),
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {selectedCategory?.subCategories?.map((subCategory: any) => {
        const isChecked = isSelected(subCategory?._id);

        return (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={subCategory?._id}
            className={`bg-white px-4 pt-1 pb-4 rounded-md shadow-black/30 ${
              isChecked ? "border-0 border-black shadow-lg" : "shadow-sm"
            }`}
          >
            <div className="flex flex-col gap-2">
              {/* Topbar */}
              <div className="flex gap-4 items-center justify-between">
                {/* Image, name */}
                <div className="flex items-center gap-3 mt-2">
                  {/* Image */}
                  <Image
                    src={subCategory?.imageUrl}
                    width={48}
                    height={48}
                    alt="category"
                    className="border-0 rounded-full min-w-12 min-h-12 max-w-12 max-h-12"
                  />

                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-semibold text-gray-800 leading-[1.1]">
                      {subCategory?.name}
                    </div>
                  </div>
                </div>

                {/* Tick */}
                <div
                  onClick={() =>
                    handleSelect(selectedCategory?._id, subCategory)
                  }
                  className={`flex items-center justify-center min-w-7 min-h-7 max-w-7 max-h-7 border-1 border-slate-400 cursor-pointer rounded-sm ${
                    isChecked ? "bg-black text-white font-semibold" : "bg-white"
                  }`}
                >
                  <AnimatePresence>
                    {isChecked && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        exit={{ opacity: 0 }}
                      >
                        ✔
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* About */}
              <div className="text-sm text-gray-500 leading-[1.2]">
                {subCategory?.about}
              </div>

              {/* Data input */}
              <div className="flex flex-col gap-2 mt-4">
                {/* Price Input */}
                <div className="max-w-xl flex items-center border border-gray-400 rounded-lg w-full">
                  <PiCurrencyInr className="sm:mx-4 mx-2 text-xl md:text-2xl text-yellow-600 font-extrabold" />
                  <input
                    type="number"
                    placeholder="Set price"
                    className="py-2 outline-none w-full text-xs md:text-sm"
                    value={
                      selectedData?.serviceData
                        ?.find((s: any) => s.id === selectedCategory?._id)
                        ?.subCategories?.find(
                          (sub: any) => sub.id === subCategory?._id
                        )?.price || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        selectedCategory._id,
                        subCategory._id,
                        "price",
                        Number(e.target.value)
                      )
                    }
                  />
                  <span className="text-xs md:text-sm pr-2 text-gray-500">
                    /hr
                  </span>
                </div>

                {/* Description Input */}
                <div className="max-w-xl flex items-center border border-gray-400 rounded-lg w-full pr-2">
                  <MdDescription className="mx-2 sm:mx-4 text-xl md:text-2xl text-gray-500" />
                  <input
                    type="text"
                    placeholder="Edit description"
                    className="py-2 outline-none w-full text-xs md:text-sm"
                    value={
                      selectedData?.serviceData
                        ?.find((s: any) => s.id === selectedCategory?._id)
                        ?.subCategories?.find(
                          (sub: any) => sub.id === subCategory?._id
                        )?.about || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        selectedCategory?._id,
                        subCategory?._id,
                        "about",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default memo(Box);

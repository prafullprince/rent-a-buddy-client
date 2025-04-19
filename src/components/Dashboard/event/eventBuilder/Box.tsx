import Image from "next/image";
import React from "react";
import { MdDescription } from "react-icons/md";
import { PiCurrencyInr } from "react-icons/pi";

// Box
const Box = ({ selectedCategory, selectedData, setSelectedData }: any) => {
  // Check if subcategory is selected
  const isSelected = (subCategoryId: string) => {
    return selectedData.serviceData.some((service: any) =>
      service.subCategories.some((sub: any) => sub.id === subCategoryId)
    );
  };

  // Handle tick click (Select / Deselect Subcategory)
  const handleSelect = (categoryId: string, subCategory: any) => {
    
    setSelectedData((prev: any) => {
      let updatedServiceData = prev.serviceData.map((service: any) => {
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
      });

      // Remove categories with no subcategories
      updatedServiceData = updatedServiceData.filter(
        (service: any) => service.subCategories.length > 0
      );

      // If category does not exist, add it
      if (
        !updatedServiceData.some((service: any) => service.id === categoryId) &&
        !prev.serviceData.some((service: any) => service.id === categoryId)
      ) {
        updatedServiceData.push({
          id: categoryId,
          subCategories: [{ id: subCategory._id, about: "", price: 0 }],
        });
      }

      return { ...prev, serviceData: updatedServiceData };
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
      serviceData: prev.serviceData.map((service: any) =>
        service.id === categoryId
          ? {
              ...service,
              subCategories: service.subCategories.map((sub: any) =>
                sub.id === subCategoryId ? { ...sub, [field]: value } : sub
              ),
            }
          : service
      ),
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {selectedCategory?.subCategories?.map((subCategory: any) => {
        const isChecked = isSelected(subCategory._id);

        return (
          <div
            key={subCategory?._id}
            className={`bg-white p-4 rounded-md shadow-black/30 ${
              isChecked ? "border-0 border-black shadow-lg" : "shadow-sm"
            }`}
          >
            <div className="flex flex-col gap-2">
              {/* Topbar */}
              <div className="flex gap-4 items-start">
                {/* Image */}
                <Image
                  src={subCategory?.imageUrl}
                  width={48}
                  height={48}
                  alt="category"
                  className="border-0 rounded-full min-w-12 min-h-12 max-w-12 max-h-12"
                />

                {/* Name, About */}
                <div className="flex flex-col gap-1">
                  <div className="text-lg font-semibold text-gray-800 leading-[1.1]">
                    {subCategory?.name}
                  </div>
                  <div className="text-sm text-gray-500 leading-[1.2]">
                    {subCategory?.about}
                  </div>
                </div>

                {/* Tick */}
                <div
                  onClick={() =>
                    handleSelect(selectedCategory._id, subCategory)
                  }
                  className={`flex items-center justify-center min-w-8 min-h-8 max-w-8 max-h-8 border-2 border-black cursor-pointer ${
                    isChecked ? "bg-black text-white font-semibold" : "bg-white"
                  }`}
                >
                  {isChecked && "✔"}
                </div>

              </div>

              {/* Data input */}
              <div className="flex flex-col gap-2 mt-4">

                {/* Price Input */}
                <div className="max-w-xl flex items-center border border-gray-400 rounded-lg w-full">
                  <PiCurrencyInr className="mx-4 text-2xl text-yellow-600 font-extrabold" />
                  <input
                    type="number"
                    placeholder="Set price"
                    className="py-2 outline-none w-full"
                    value={
                      selectedData.serviceData
                        .find((s: any) => s.id === selectedCategory._id)
                        ?.subCategories.find(
                          (sub: any) => sub.id === subCategory._id
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
                  <span className="text-lg pr-2">/hr</span>
                </div>

                {/* Description Input */}
                <div className="max-w-xl flex items-center border border-gray-400 rounded-lg w-full pr-2">
                  <MdDescription className="mx-4 text-2xl text-gray-500" />
                  <input
                    type="text"
                    placeholder="Edit description"
                    className="py-2 outline-none w-full"
                    value={
                      selectedData.serviceData
                        .find((s: any) => s.id === selectedCategory._id)
                        ?.subCategories.find(
                          (sub: any) => sub.id === subCategory._id
                        )?.about || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        selectedCategory._id,
                        subCategory._id,
                        "about",
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Box;

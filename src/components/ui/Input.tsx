/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { UseFormRegister } from "react-hook-form";

interface GradientInputProps {
  name: string;
  type?: string;
  placeholder?: string;
  gradientColor?: string;
  className?: string;
  register: UseFormRegister<any>;
  errors: any;
}

const GradientInput: React.FC<GradientInputProps> = ({
  name,
  type = "text",
  placeholder = "Enter text...",
  gradientColor = "from-gray-900 to-transparent",
  className = "",
  register,
  errors
}) => {
  return (
    <div className={`relative sm:w-full sm:min-w-lg sm:max-w-lg ${className}`}>
      {/* Input Field */}
      <input
        type={type}
        placeholder={placeholder}
        {...register(name,{
          required: `Please enter ${name}`,
        })}
        className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] w-full p-3 h-12 rounded-md border border-gray-300 focus:outline-none bg-white relative z-10"
      />
      {errors?.name && (
        <p className="text-sm text-green-700 mt-2">{errors?.name?.message as string}</p>
      )}

      {/* Bottom Gradient Overlay */}
      <div className={`absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t ${gradientColor} rounded-b-md`}></div>
    </div>
  );
};

export default GradientInput;

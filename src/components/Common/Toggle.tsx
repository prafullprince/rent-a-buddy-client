/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";

const Toggle = ({ isToggleOpen, setIsToggleOpen, setFormData }: any) => {
  console.log("isToggleOpen", isToggleOpen);
  return (
    <button className="relative cursor-pointer" onClick={() => {
      setIsToggleOpen(!isToggleOpen);
      setFormData((prevState: any) => ({
        ...prevState,
        isActive: !prevState.isActive
      }));
    }}>
      <div
        className={`w-14 h-7 relative rounded-full flex items-center justify-center transition-all duration-300 ${
          isToggleOpen ? "bg-green-600" : "bg-gray-400"
        }`}
      >
        <div
          className={`w-5 h-5 absolute rounded-full left-1 bg-white shadow-md transform transition-transform duration-300 ${
            isToggleOpen ? "translate-x-7" : ""
          }`}
        ></div>
      </div>
    </button>
  );
};

export default Toggle;

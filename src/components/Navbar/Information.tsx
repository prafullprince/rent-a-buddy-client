import React from "react";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

const Information = () => {
  return (
    <>
      <div className="text-sm font-medium hidden md:block">
        <div className="flex items-center gap-2">
          {/* faq */}
          <Link href={"/faq"}>
            <div className="hover:text-green-800 cursor-pointer">Faq</div>
          </Link>
          {/* terms */}

          <Link href={"/terms"}>
            <div className="hover:text-green-800 cursor-pointer">Terms</div>
          </Link>

          {/* contact */}
          <Link href={"/contact"}>
            <div className="hover:text-green-800 cursor-pointer">Contact</div>
          </Link>
        </div>
      </div>

      {/* for mobile */}
      <div className="md:hidden cursor-pointer group">
        <IoIosArrowDown className="text-xl text-black font-bold" />
        <div className="invisible opacity-0 absolute top-16 left-[25%] -translate-x-[50%] shadow-xl rounded-lg p-2 w-fit z-[1000] bg-slate-100 text-slate-700 duration-300 transition-all text-sm font-semibold group-hover:opacity-100 group-hover:visible">
          <div className="flex flex-col gap-3 items-start px-2 py-[6px]">
            <Link
              href={"/faq"}
              className="cursor-pointer flex items-center gap-1 hover:text-green-800"
            >
              <div>Faq</div>
            </Link>
            <Link
              href={"/terms"}
              className="cursor-pointer flex items-center gap-1 hover:text-green-800"
            >
              <div>Terms</div>
            </Link>
            <Link
              href={"/contact"}
              className="cursor-pointer flex items-center gap-1 hover:text-green-800"
            >
              <div>Contact</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Information;

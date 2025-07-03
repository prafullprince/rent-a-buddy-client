"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

const Information = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reusable nav links
  const navLinks = [
    { href: "/faq", label: "Faq" },
    { href: "/terms", label: "Terms" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Desktop Links */}
      <div className="text-sm font-medium hidden md:flex items-center gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-green-800 transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          className="cursor-pointer group"
        >
          <IoIosArrowDown className="text-xl text-black font-bold" />
        </button>

        {isOpen && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 shadow-xl rounded-lg p-3 bg-slate-100 text-slate-700 z-[1000] w-fit transition-all duration-200 ease-in-out">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    // Delay closing to allow Next.js to navigate
                    setTimeout(() => setIsOpen(false), 100);
                  }}
                  className="hover:text-green-800 text-sm font-semibold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Information;

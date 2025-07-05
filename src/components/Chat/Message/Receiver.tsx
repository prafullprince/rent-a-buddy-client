/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import React, { memo } from "react";
import { MdOutlineCancel } from "react-icons/md";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";
import { FaHandsHelping } from "react-icons/fa";
import PlanetSpinner from "@/loading/PageLoadingSpinner";
import { CiStopwatch } from "react-icons/ci";

const Receiver = ({
  msg,
  userDetails,
  socket,
  setAcceptLoading,
  acceptLoading,
  chatId,
  current,
  other,
}: any) => {
  return (
    <>
      {msg?.receiver === userDetails?._id && (
        <div className="flex justify-start">
          <div
            className={`max-w-[65%] text-wrap break-words relative text-black rounded-lg rounded-tl-none ${
              msg.type === "text"
                ? "bg-white px-3 pt-1"
                : "bg-white min-w-[270px] max-w-sm"
            }`}
          >
            <div
              className={`absolute left-0 top-0 border-t-[10px] border-t-transparent border-l-[10px] ${
                msg.type === "text" ? "border-white" : "border-l-gray-400"
              } w-0 h-0 rotate-180 -translate-x-2 translate-y-0`}
            ></div>
            {msg.type === "text" ? (
              <div className="pr-9 pb-2 break-words text-wrap text-sm">{msg.text}</div>
            ) : (
              <div
                className={`${msg?.type === "text" ? "pr-14" : "pr-0"} pb-6`}
              >
                <div className="flex flex-col gap-2">
                  {/* topbar */}
                  <div className="flex items-center justify-between bg-gray-400 h-14 px-2 rounded-tr-lg">
                    {/* left */}
                    <div className="flex items-start gap-2">
                      <Image
                        src={
                          msg?.text?.subId?.subCategoryId?.imageUrl ||
                          fallbackImage
                        }
                        alt="subSectionImage"
                        width={40}
                        height={30}
                        className="rounded-lg aspect-square"
                      />
                      <div className="flex flex-col gap-1">
                        {/* name */}
                        <div className="text-black text-xs font-semibold">
                          {msg?.text?.subId?.subCategoryId?.name}
                        </div>

                        {/* price */}
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-medium text-gray-600">
                            {msg?.text?.subId?.price}
                            /hr
                          </p>
                        </div>
                        {/* about */}
                      </div>
                    </div>

                    {/* right */}
                    <div className="px-2 py-1 text-[12px] rounded-full font-semibold">
                      {msg?.order?.status === "rejected" && (
                        <div className="px-2 py-1 text-[8px] bg-red-800 text-white rounded-full font-semibold">
                          Rejected
                        </div>
                      )}

                      {msg?.order?.status === "pending" && (
                        <div className="px-2 py-1 text-[8px] bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                          Pending
                        </div>
                      )}

                      {msg?.order?.status === "accepted" &&
                        msg?.order?.isActive === false && 
                        msg?.order?.isCompleted === false
                       && (
                          <div className="px-2 py-1 text-[8px] bg-green-800 text-white rounded-full font-semibold">
                            Accepted
                          </div>
                        )}

                      {/* active */}
                      {msg?.order?.status === "accepted" && msg?.order?.isActive === true && (
                          <div className="flex justify-end">
                            <div className="px-4 py-1 text-[12px] bg-blue-300 text-black rounded-full font-semibold">
                              Live...
                            </div>
                          </div>
                        )}

                      {/* completed */}
                      {msg?.order?.status === "accepted" &&
                        msg?.order?.isActive === false &&
                        msg?.order?.isCompleted === true && (
                          <div className="flex justify-end">
                            <div className="px-2 py-1 text-[8px] bg-green-800 text-white rounded-full font-semibold">
                              Completed
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-1 px-2 mt-1">
                    {/* date */}
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-black font-semibold">
                        Date:{" "}
                      </div>
                      <p className="text-xs font-semibold text-gray-400">
                        {msg?.text?.date}
                      </p>
                    </div>

                    {/* time */}
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-black font-semibold">
                        Time:{" "}
                      </div>
                      <p className="text-xs font-semibold text-gray-400">
                        {msg?.text?.time}
                      </p>
                    </div>

                    {/* venue */}
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-black font-semibold">
                        Location:{" "}
                      </div>
                      <p className="text-xs font-semibold text-gray-400">
                        {msg?.text?.location}
                      </p>
                    </div>

                    {/* additionalInfo */}
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-black font-semibold">
                        Info:{" "}
                      </div>
                      <p className="text-xs font-semibold text-gray-400">
                        {msg?.text?.additionalInfo}
                      </p>
                    </div>

                    {/* cabFare */}
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-black font-semibold">
                        CabFare:{" "}
                      </div>
                      <p className="text-xs font-semibold text-gray-400">
                        {msg?.text?.cabFare}
                      </p>
                    </div>

                    {/* FinalPrice */}
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-black font-semibold">
                        FinalPrice:{" "}
                      </div>
                      <p className="text-xs font-semibold text-gray-400">
                        {msg?.text?.totalPrice}.00 Rs
                      </p>
                    </div>
                  </div>

                  {/* buttons */}
                  {msg?.order?.status === "accepted" &&
                    msg?.order?.isActive === false && (
                      <div className="flex items-center justify-start gap-1 mt-1">
                        <div className="px-3 py-2 bg-amber-200 text-black text-sm w-fit ml-2 rounded-lg flex items-center gap-1">
                          <CiStopwatch className="text-black text-xl font-bold" />
                          Waiting for Payment
                        </div>
                      </div>
                    )}

                  {msg?.order?.status === "rejected" && (
                      <div className="flex items-center justify-start gap-1 mt-1">
                        <div className="px-3 py-2 bg-red-200 text-black w-fit ml-2 text-sm rounded-lg">
                          Rejected
                        </div>
                      </div>
                    )}

                  {/* completed */}
                  {msg?.order?.status === "accepted" &&
                    msg?.order?.isActive === false &&
                    msg?.order?.isCompleted === true && (
                      <div className="flex justify-end">
                        <div className="px-2 py-1 text-[8px] bg-green-800 text-white rounded-full font-semibold">
                          Completed
                        </div>
                      </div>
                    )}

                  {msg?.order?.status === "pending" && (
                      <div className="px-2 py-1 flex items-center justify-start gap-1 mt-1">
                        {/* accept */}
                        <button
                          onClick={() => {
                            setAcceptLoading(true);
                            socket?.emit("acceptOrder", {
                              msgId: msg?._id,
                              mark: "accepted",
                              chatId,
                              current,
                              other,
                            });
                          }}
                          className="bg-yellow-300 text-black px-3 py-2 rounded-md text-sm font-semibold cursor-pointer flex items-center gap-1"
                        >
                          <FaHandsHelping className="text-black text-xl" />
                          Accept
                          {acceptLoading && <PlanetSpinner />}
                        </button>

                        {/* reject */}
                        <button
                          onClick={() => {
                            socket?.emit("acceptOrder", {
                              msgId: msg?._id,
                              mark: "rejected",
                              chatId,
                              current,
                              other,
                            });
                          }}
                          className="bg-red-500 text-white rounded-md text-sm font-semibold ml-2 cursor-pointer flex items-center gap-1 px-3 py-2"
                        >
                          <MdOutlineCancel className="text-white text-xl" />
                          Reject
                        </button>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* dateTime */}
            <span className="text-right text-[10px] text-gray-500 text-richblack-25 font-bold absolute bottom-1 right-2">
              {new Date(msg?.createdAt).toLocaleString("en-us", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }) === "Invalid Date" ? (
                <>23:59</>
              ) : (
                <>
                  {new Date(msg?.createdAt).toLocaleString("en-us", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </>
              )}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Receiver);

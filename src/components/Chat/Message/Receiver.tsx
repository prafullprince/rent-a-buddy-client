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
            className={`relative max-w-[88%] break-words rounded-2xl rounded-tl-none text-[#111b21] shadow-sm sm:max-w-[65%] ${
              msg.type === "text"
                ? "bg-white px-3 pt-1 text-[#111b21]"
                : "w-full max-w-sm bg-white shadow-md"
            }`}
          >
            <div
              className={`absolute left-0 top-0 border-t-[10px] border-t-transparent border-l-[10px] ${
                msg.type === "text" ? "border-white" : "border-l-gray-900"
              } w-0 h-0 rotate-180 -translate-x-2 translate-y-0`}
            ></div>
            {msg.type === "text" ? (
              <div className="px-1 pb-2 pr-9 pt-1 text-sm leading-5 break-words text-wrap">{msg.text}</div>
            ) : (
              <div
                className={`${msg?.type === "text" ? "pr-14" : "pr-0"} pb-6`}
              >
                <div className="flex flex-col gap-2">
                  {/* topbar */}
                  <div className="flex h-14 items-center justify-between rounded-tr-2xl bg-[#202c33] px-3">
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
                        <div className="text-xs font-semibold text-white/90">
                          {msg?.text?.subId?.subCategoryId?.name}
                        </div>

                        {/* price */}
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-medium text-white/55">
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
                  <div className="mt-1 flex flex-col gap-1 px-3 text-[#54656f]">
                    {/* date */}
                    <div className="flex items-center gap-1">
                      <div className="text-xs font-semibold text-[#667781]">
                        Date:{" "}
                      </div>
                      <p className="text-xs font-medium text-[#111b21]">
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
                          className="flex cursor-pointer items-center gap-1 rounded-xl bg-[#25d366] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"
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
                          className="ml-2 flex cursor-pointer items-center gap-1 rounded-xl bg-[#ef4444] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#dc2626]"
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

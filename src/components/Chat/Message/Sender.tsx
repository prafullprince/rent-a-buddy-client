/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import React from "react";
import { IoMdDoneAll } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import fallbackImage from "@/assets/Screenshot 2025-02-03 at 23.53.50.png";

const Sender = ({
  msg,
  userDetails,
  socketRef,
  setModalData,
  session
}: any) => {
  return (
    <>
      {msg?.sender === userDetails?._id && (
        <div className="flex justify-end">
          <div
            className={`max-w-[65%] relative text-black rounded-lg rounded-tr-none ${
              msg?.type === "text"
                ? "bg-green-200 px-3 pt-1"
                : "bg-white min-w-xs max-w-sm"
            }`}
          >
            <div
              className={`absolute right-0 top-0 border-t-[10px] border-t-transparent border-l-[10px] ${
                msg.type !== "text" ? "border-l-gray-400" : "border-l-green-200"
              } w-0 h-0 rotate-90 translate-x-2 translate-y-0`}
            ></div>
            {msg?.type === "text" ? (
              <div className="pr-14 pb-2 break-words text-wrap">{msg.text}</div>
            ) : (
              <div
                className={`${msg?.type === "text" ? "pr-14" : "pr-0"} pb-6`}
              >
                <div className="flex flex-col gap-2">
                  {/* topbar */}
                  <div className="flex items-center justify-between bg-gray-400 h-14 px-2 rounded-tl-lg">
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
                          Waiting for response
                        </div>
                      )}

                      {msg?.order?.status === "accepted" &&
                        msg?.order?.isActive === false &&
                        msg?.order?.isCompleted === false && (
                          <div className="px-2 py-1 text-[8px] bg-green-800 text-white rounded-full font-semibold">
                            Accepted
                          </div>
                        )}

                      {/* active */}
                      {msg?.order?.status === "accepted" &&
                          msg?.order?.isActive === true && msg?.order?.isCompleted === false && (
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
                  <div className="flex flex-col gap-1 px-2">
                    {/* date */}
                    <div className="flex items-center gap-1">
                      <div className="text-sm text-black font-semibold">
                        Date:{" "}
                      </div>
                      <p className="text-xs font-semibold text-gray-400">
                        {msg?.text?.date}
                      </p>
                    </div>

                    {/* time */}
                    <div className="flex items-center gap-1">
                      <div className="text-sm text-black font-semibold">
                        Time:{" "}
                      </div>
                      <p className="text-xs font-semibold text-gray-400">
                        {msg?.text?.time}
                      </p>
                    </div>

                    {/* venue */}
                    <div className="flex items-center gap-1">
                      <div className="text-sm text-black font-semibold">
                        Location:{" "}
                      </div>
                      <p className="text-xs font-semibold text-gray-400">
                        {msg?.text?.location}
                      </p>
                    </div>

                    {/* additionalInfo */}
                    <div className="flex items-center gap-1">
                      <div className="text-sm text-black font-semibold">
                        Info:{" "}
                      </div>
                      <p className="text-xs font-semibold text-gray-400">
                        {msg?.text?.additionalInfo}
                      </p>
                    </div>

                    {/* cabFare */}
                    <div className="flex items-center gap-1">
                      <div className="text-sm text-black font-semibold">
                        CabFare:{" "}
                      </div>
                      <p className="text-xs font-semibold text-gray-400">
                        {msg?.text?.cabFare}
                      </p>
                    </div>

                    {/* FinalPrice */}
                    <div className="flex items-center gap-1">
                      <div className="text-sm text-black font-semibold">
                        FinalPrice:{" "}
                      </div>
                      <p className="text-xs font-semibold text-gray-400">
                        {msg?.text?.totalPrice}.00 Rs
                      </p>
                    </div>
                  </div>

                  {/* buttons */}
                  {msg?.order?.status === "accepted" &&
                      msg?.order?.isActive === false &&
                      msg?.order?.isCompleted === false && (
                      <div className="flex justify-end">
                        <button
                          className="bg-yellow-300 cursor-pointer text-black py-2 px-4 rounded-lg mr-3"
                          onClick={() => {
                            setModalData({
                              heading: `Send Money `,
                              subHeading: `(${
                                msg?.order?.totalPrice
                              }rs)`,
                              text1: "Are you sure to make payment?",
                              text2: "This action cannot be undone.",
                              btn1Text: "Confirm",
                              btn2Text: "Cancel",
                              btn2Handler: () => {
                                setModalData(null);
                              },
                              receiverId: msg?.receiver,
                              amount: msg?.order?.totalPrice,
                              token: session?.serverToken,
                              orderId: msg?.order?._id,
                            });
                          }}
                        >
                          Make Payment
                        </button>
                      </div>
                    )}

                  {/* rejected */}
                  {msg?.order?.status === "rejected" && (
                      <div className="flex justify-end">
                        <button className="bg-red-200 hover:bg-blue-700 text-black py-2 px-4 rounded-lg mr-3">
                          Order rejected
                        </button>
                      </div>
                    )}

                  {/* pending */}
                  {msg?.order?.status === "pending" && (
                      <div className="flex items-center gap-1 mt-2 justify-end">
                        <button
                          onClick={() => {
                            socketRef.current?.send(
                              JSON.stringify({
                                type: "acceptOrder",
                                payload: {
                                  msgId: msg?._id,
                                  mark: "rejected",
                                },
                              })
                            );
                          }}
                          className="bg-red-500 text-white rounded-md text-base font-semibold ml-2 cursor-pointer flex items-center gap-2 px-4 py-2 mr-3"
                        >
                          <MdOutlineCancel className="text-white text-2xl" />
                          Cancel
                        </button>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* dateTime */}
            <span className="text-right text-xs text-gray-500 text-richblack-25 font-bold absolute bottom-1 right-6">
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

            {/* checkMark */}
            <span className="absolute right-1 bottom-1">
              <IoMdDoneAll
                className={msg.isSeen ? "text-blue-500" : "text-gray-500"}
              />
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Sender;

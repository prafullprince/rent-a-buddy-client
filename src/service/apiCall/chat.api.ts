/* eslint-disable @typescript-eslint/no-explicit-any */

import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { authEndPoints, chatEndPoints } from "../api";

// fetchAllChat
export const fetchAllChat = async (token: any) => {
  const tid = toast.loading("Fetching all chat...");
  try {
    // apiCall
    const response = await apiConnector(
      "POST",
      chatEndPoints.FETCH_CHAT,
      {},
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.log("fetchAllChatError", error);
    if (error.response?.status === 429) {
      toast.error(error?.response?.data?.message || "Too many requests, please try again later");
    } else {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

// getUserDetailsById
export const fetchUserDetailsById = async (token: any) => {
  try {
    // apiCall
    const response = await apiConnector(
      "POST",
      authEndPoints.GET_USER_DETAILS,
      {},
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data.data;
  } catch (error:any) {
    console.log("fetchUserDetailsByIdError",error);
    if (error.response?.status === 429) {
      toast.error(error?.response?.data?.message || "Too many requests, please try again later");
    } else {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    return error;
  }
};

// fetchAllMessages
export const fetchMessage = async (chatId: any, token: any) => {
  try {
    // apiCall
    const response = await apiConnector(
      "POST",
      chatEndPoints.FETCH_MESSAGE,
      { chatId },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data.data;
  } catch (error:any) {
    console.log("fetchMessageError",error);
    if (error.response?.status === 429) {
      toast.error(error?.response?.data?.message || "Too many requests, please try again later");
    } else {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    return error;
  }
};

// fetch other user
export const fetchOtherUser = async (userId: any) => {    
  const tid = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", chatEndPoints.FETCH_OTHER_USER, {
      userId: userId
    });
    return response.data.data;
  } catch (error:any) {
    console.log(error);
    if (error.response?.status === 429) {
      toast.error(error?.response?.data?.message || "Too many requests, please try again later");
    } else {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

// fetchOrdersOfParticularChat
export const fetchOrdersOfParticularChat = async (chatId: any, token:any) => {
  const tid = toast.loading("Loading orders of particular chat...");
  try {
    const response = await apiConnector("POST", chatEndPoints.FETCH_ORDERS_CHAT, {
      chatId: chatId
    },{
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    return response.data.data;
  } catch (error:any) {
    console.log(error);
    if (error.response?.status === 429) {
      toast.error(error?.response?.data?.message || "Too many requests, please try again later");
    } else {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

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
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

// getUserDetailsById
export const fetchUserDetailsById = async (token: any) => {
  const tid = toast.loading("Fetching user details...");
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
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

// fetchAllMessages
export const fetchMessage = async (chatId: any, token: any) => {
  const tid = toast.loading("Fetching all messages...");
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
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    toast.dismiss(tid);
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
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

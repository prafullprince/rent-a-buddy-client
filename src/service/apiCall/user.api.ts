/* eslint-disable @typescript-eslint/no-explicit-any */

import toast from "react-hot-toast";
import { profileEndpoints } from "../api";
import { apiConnector } from "../apiConnector";

// userDetailsById
export const fetchUserDetailsById = async (token:any) => {
  try {
    const response = await apiConnector("GET", profileEndpoints.GET_USER_DETAILS_BY_ID,{},{
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
  }
};


// updateProfilePicture apiCall
export const updateProfilePictureApiCall = async (token:any,formData:any) => {
  try {
    const response = await apiConnector("POST", profileEndpoints.UPLOAD_PROFILE_PICTURE,formData,{
      "Content-Type": "multipart/form-data",
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
  }
};


// updateProfileApiCall
export const updateProfileApiCall = async (token:any,formData:any) => {
  try {
    const response = await apiConnector("POST", profileEndpoints.UPDATE_PROFILE,formData,{
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    toast.success("Profile updated successfully");
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    if (error.response?.status === 429) {
      toast.error(error?.response?.data?.message || "Too many requests, please try again later");
    } else {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    return error;
  }
};


// createPostApiCall
export const createPostApiCall = async (token:any,formData:any) => {
  const tid = toast.loading("Creating post...");
  try {
    const response = await apiConnector("POST", profileEndpoints.CREATE_POST,formData,{
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    toast.success("Post created successfully");
    return response.data.data;
  } catch (error: any) {
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


// getPostsByUserApiCall
export const getPostsByUserApiCall = async (userId:any, token:any) => {
  try {
    const response = await apiConnector("POST", profileEndpoints.GET_USER_POSTS,{ userId }, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    if (error.response?.status === 429) {
      toast.error(error?.response?.data?.message || "Too many requests, please try again later");
    } else {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    return error;
  }
};


// deletePostByIdApiCall
export const deletePostByIdApiCall = async (token:any,postId:any) => {
  const tid = toast.loading("Deleting post...");
  try {
    const response = await apiConnector("POST", profileEndpoints.DELETE_POST_BY_ID,{
      postId: postId
    },{
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    toast.success("Post deleted successfully");
    return response.data.data;
  } catch (error: any) {
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

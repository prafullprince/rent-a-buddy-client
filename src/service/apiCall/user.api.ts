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
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
    return error;
  }
};

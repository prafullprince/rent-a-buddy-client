/* eslint-disable @typescript-eslint/no-explicit-any */

import toast from "react-hot-toast";
import { eventEndPoints } from "../api";
import { apiConnector } from "../apiConnector";


// getInfiniteEvents
export const getInfiniteEvents = async (limit:number,filters?:any,cursor?:any) => {
  try {
    console.log("filters are:",filters);
    // apiCall
    const response = await apiConnector("POST", eventEndPoints.GET_INFINTE_EVENTS_FILTERS, {
        limit,
        cursor,
        filters
    },{
      "Content-Type": "application/json",
    });
    // console.log("response is:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// createEvent
export const createEvent = async (formData:any,token:any) => {
  const  tid = toast.loading("Creating event...");
  try {
    // apiCall
    const response = await apiConnector("POST", eventEndPoints.CREATE_EVENT,formData, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("response is:", response.data.data);
    toast.success("Success");
    return response.data.data;
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

// createService
export const createServiceApi = async (selectedData:any,token:any) => {
  const tid = toast.loading("Creating service...");
  try {
    console.log("first",selectedData,token);

    // apiCall
    const response = await apiConnector("POST", eventEndPoints.CREATE_SERVICE,selectedData, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    console.log("response is:", response);
    toast.success("Success");
    return response;
  } catch (error) {
    console.log("createService error is:",error);
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

// eventSummary
export const eventSummary = async (eventId:any,token:any) => {
  const  tid = toast.loading("Fetching event summary...");
  try {
    // apiCall
    const response = await apiConnector("POST", eventEndPoints.EVENT_SUMMARY,{eventId}, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    toast.success("Success");
    return response.data.data.data;
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

// published
export const published = async (eventId:any,status:any,token:any) => {
  const  tid = toast.loading("Publishing event...");
  try {
    // apiCall
    const response = await apiConnector("POST", eventEndPoints.PUBLISH_EVENT,{eventId,status}, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    console.log("response isasdasdasd:", response.data.data);
    toast.success("Success");
    // return response.data.data;
    return;
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

// eventSummaryOfUser
export const eventSummaryOfUser = async (token:any) => {
  const  tid = toast.loading("Fetching event summary...");
  try {
    // apiCall
    const response = await apiConnector("GET", eventEndPoints.EVENT_SUMMARY_OF_USER, {}, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    return response.data.data.data[0];
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

// editEvent
export const editEventApi = async (updates:any, token:any) => {
  const  tid = toast.loading("Editing event...");
  try {
    // apiCall
    const response = await apiConnector("POST", eventEndPoints.EDIT_EVENT,updates, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("response is:", response.data.data);
    toast.success("Success");
    return true;
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

// eventDetailsById
export const eventDetailsById = async (eventId:any) => {
  const  tid = toast.loading("Fetching event details...");
  try {
    // apiCall
    const response = await apiConnector("POST", eventEndPoints.EVENT_BY_ID,{eventId});
    toast.success("Success");
    return response.data.data;
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

// allAvailableEvents
export const allAvailableEvents = async () => {
  try {
    // apiCall
    const response = await apiConnector("GET", eventEndPoints.ALL_EVENTS);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// markAsActiveInactive
export const markAsActiveInactive = async (mark:any,token:any, eventId:any) => {
  const  tid = toast.loading("Marking event as active/inactive...");
  try {
    // apiCall
    const response = await apiConnector("POST", eventEndPoints.MARK_AS_ACTIVE_INACTIVE,{eventId,mark}, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    console.log("response is:", response.data.data);
    toast.success("Success");
    return response.data.data;
  } catch (error:any) {
    console.log(error);
    toast.error(error.response.data.message);
    return error;
  } finally {
    toast.dismiss(tid);
  }
};

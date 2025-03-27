import toast from "react-hot-toast";
import { eventEndPoints } from "../api";
import { apiConnector } from "../apiConnector";


// getInfiniteEvents
export const getInfiniteEvents = async (limit:number,filters?:any,cursor?:any) => {
  try {
    // apiCall
    const response = await apiConnector("POST", eventEndPoints.GET_INFINTE_EVENTS_FILTERS, {
        limit,
        cursor,
        filters
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

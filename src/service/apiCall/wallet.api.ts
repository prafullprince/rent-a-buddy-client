/* eslint-disable @typescript-eslint/no-explicit-any */

import toast from "react-hot-toast";
import { paymentEndPoints } from "../api";
import { apiConnector } from "../apiConnector";

// get wallet
export const getUserWallet = async (token:any) => {
    try {
        const response = await apiConnector("POST", paymentEndPoints.GET_USER_WALLET,{},{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        });
        console.log("response",response)
        return response.data.data;
    } catch (error:any) {
        console.log(error);
        toast.error(error?.response?.data?.message);
        return error;
    }
}

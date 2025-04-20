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
    } catch (error) {
        console.log(error);
    }
}

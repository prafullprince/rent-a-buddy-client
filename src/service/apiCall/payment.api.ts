/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { paymentEndPoints } from "../api";
import rzpLogo from "../../../src/assets/rentb-opengraph.png";  


// load razorpay script
function loadScript(src: any) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

// handle recharge
export async function handleRecharge(
  amount: any,
  token: any,
  minOrderAmount: any,
  navigate: any,
  userDetails: any
) {
    console.log("first")
  const tid = toast.loading("Loading...");
  try {
    // load scripts
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      toast.error("error on loading");
      return;
    }

    // creating razorpay order
    const orderResponse = await apiConnector(
      "POST",
      paymentEndPoints.CREATE_ORDER,
      { amount, minOrderAmount },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    if (!orderResponse.data.success) {
      throw new Error("error order");
    }

    // opening the razorpay SDK/creating dialogue box
    const options = {
      key: "rzp_test_vY4u0103zO7z4I",
      currency: orderResponse.data.data.currency,
      amount: orderResponse.data.data.amount,
      order_id: orderResponse.data.data.id,
      name: "RentBuddy",
      description: "Thank you for recharging",
      image: rzpLogo,
      prefill: {
        name: `${userDetails.name}`,
        email: `${userDetails.email}`,
      },
      handler: function (response: any) {
        // send successfullyMail
        // sendPaymentSuccessEmail(response, orderResponse.data.amount, token);
        // verifyPayment
        verifyPayment(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature,
          token,
          navigate
        );
      },
    };

    // open dialog box of razorpay SDK
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
    console.log("paymentObject",paymentObject)
    paymentObject.on("payment.failed", function (response: any) {
      toast.error("Oops! Payment Failed.");
      console.log(response.error);
    });
  } catch (error: any) {
    console.log(error);
    console.log(error.message);
    toast.error(error.response.data.message);
  }
  toast.dismiss(tid);
}

// verify payment function
async function verifyPayment(
  razorpay_payment_id: any,
  razorpay_order_id: any,
  razorpay_signature: any,
  token: any,
  navigate: any
) {
  const toastId = toast.loading("Verifying Payment...");
  try {
    const response = await apiConnector(
      "POST",
      paymentEndPoints.VERIFY_PAYMENT,
      { razorpay_payment_id, razorpay_order_id, razorpay_signature },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment Successful.");
    navigate.push("/");

} catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error);
    toast.error("Could Not Verify Payment.");
  }
  toast.dismiss(toastId);
}

// sendMoney
export async function sendMoneyApiCall(amount: any, receiverId: any, token: any, orderId: any) {
  const tid = toast.loading("Sending money...");
  try {
    // apiCall
    const response = await apiConnector(
      "POST",
      paymentEndPoints.SEND_MONEY,
      { amount, receiverId, orderId },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    toast.success("Success");
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    toast.error(error.response.data.message);
    return error;
  } finally {
    toast.dismiss(tid);
  }
}

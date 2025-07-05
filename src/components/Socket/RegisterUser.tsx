/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import socket from "@/utills/socket";
import { useSession } from "next-auth/react";
import { fetchUserDetailsById } from "@/service/apiCall/user.api";
import toast from "react-hot-toast";

const RegisterUser = () => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<any>(null);

  // Fetch user details
  useEffect(() => {
    if (!session) return;
    (async () => {
      const data = await fetchUserDetailsById(session.serverToken);
      setUserDetails(data);
    })();
  }, [session]);

  // Handle socket connection and registration
  useEffect(() => {
    if (!userDetails) return;

    if (!socket.connected) socket.connect();

    // register user
    const handleConnect = () => {
      socket.emit("register", { userId: userDetails._id });
    };

    // Handle online -> confirmation after successfull registration
    const handleOnline = () => {
      toast.success("You are online");
    };

    // Handle disconnect
    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    // Handle error
    const handleError = () => {
      console.log("Socket error");
    };

    // Add listeners
    socket.on("connect", handleConnect);
    socket.on("online", handleOnline);
    socket.on("disconnect", handleDisconnect);
    socket.on("error", handleError);

    // Clean up listeners (but not disconnect unless you own socket lifecycle)
    return () => {
      socket.off("connect", handleConnect);
      socket.off("online", handleOnline);
      socket.off("disconnect", handleDisconnect);
      socket.off("error", handleError);
    };
  }, [userDetails]);

  return null;
};

export default RegisterUser;

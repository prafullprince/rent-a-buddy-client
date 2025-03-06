"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const page = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.serverToken) {
      async function fetchUser() {
        console.log("first");
        console.log("session: ", session);
        console.log("status: ", status);
        const data = await axios.get("http://localhost:4000/api/auth/getUser", {
          headers: {
            Authorization: `Bearer ${session?.serverToken}`, // Send token in the request
            "Content-Type": "application/json",
          },
        });
        console.log("data: ", data.data);
      }

      fetchUser();
    }
  }, [session, status]);

  return <div></div>;
};

export default page;

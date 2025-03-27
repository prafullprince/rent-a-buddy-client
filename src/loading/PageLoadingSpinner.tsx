"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { Spinner } from "@/components/Spinner"; // Create a Spinner component

const LoadingSpinner = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // Simulate loading time
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return loading ? "<Spinner />" : null;
};

export default LoadingSpinner;

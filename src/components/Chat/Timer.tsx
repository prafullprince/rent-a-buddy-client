/* eslint-disable react-hooks/exhaustive-deps */

import React, { memo, useEffect, useState } from "react";

const Timer = ({ startTimeISO }: { startTimeISO: string }) => {
  const getRemainingTime = () => {
    const start = new Date(startTimeISO).getTime(); // fixed start time
    const end = start + 2 * 60 * 60 * 1000; // 2 hours later
    const now = Date.now();
    return Math.max(end - now, 0); // avoid negative numbers
  };

  const [remainingTime, setRemainingTime] = useState(getRemainingTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(getRemainingTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [startTimeISO]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return <div>{formatTime(remainingTime)}</div>;
};

export default memo(Timer);

import Sidebar from "@/components/Dashboard/Sidebar";
import React from "react";

const layout = ({ children }: { children: any }) => {
  return (
    <div className="flex gap-2 items-stretch min-h-screen">
      <Sidebar />
      <div className="w-full min-h-screen">{children}</div>
    </div>
  );
};

export default layout;

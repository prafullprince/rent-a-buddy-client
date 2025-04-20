"use client";
import React from "react";
import { motion } from 'framer-motion';

const tabs = [
  { name: "All", id: 1 },
  { name: "Expense", id: 2 },
  { name: "Pending Income", id: 3 },
  { name: "Referall Balance", id: 4 },
];

const TransationTabs = () => {
  const [activeTab, setActiveTab] = React.useState(1);

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex items-center gap-4 mt-6">
      {/* tabs */}
      {tabs.map((tab, index) => {
        return (
          <button
            key={index}
            onClick={() => handleTabClick(tab.id)}
            className={`bg-white text-black px-5 font-semibold flex items-center gap-2 py-3 rounded-lg cursor-pointer relative ${
              tab.id === activeTab ? "border-b" : ""
            }`}
          >
            <p>{tab.name}</p>
            {
                activeTab === tab.id && (
                    <motion.div
                        layout
                        layoutId="tab-active"
                        className="bg-gray-700 w-full h-[2px] rounded-full absolute bottom-0 left-0"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )
            }
          </button>
        );
      })}
    </div>
  );
};

export default TransationTabs;

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
    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {/* tabs */}
      {tabs.map((tab, index) => {
        return (
          <button
            key={index}
            onClick={() => handleTabClick(tab.id)}
            className={`relative flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-all sm:px-4 ${
              tab.id === activeTab ? "border-amber-300/30 bg-amber-300/10 text-amber-100" : "border-white/10 bg-black/20 text-white/65 hover:bg-white/[0.08]"
            }`}
          >
            <p>{tab.name}</p>
            {
                activeTab === tab.id && (
                    <motion.div
                        layout
                        layoutId="tab-active"
                        className="absolute bottom-0 left-3 h-[2px] w-[calc(100%-1.5rem)] rounded-full bg-gradient-to-r from-amber-300 to-teal-300 sm:left-4 sm:w-[calc(100%-2rem)]"
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

import React from "react";

const WarrantyPeriodStats = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    {stats.map((stat, index) => (
      <div
        key={index}
        className={`
          ${stat.bgColor}
          ${stat.textColor || "text-white"}
          rounded-xl shadow-md border border-black/10
          p-5 flex items-center justify-between
          hover:shadow-lg transition-all duration-300
        `}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm opacity-90 mt-1">
            {stat.title}
          </p>
          <h4 className="text-2xl font-semibold mt-1 whitespace-nowrap">
            {stat.count}
          </h4>
        </div>
        <div className="flex-shrink-0 ml-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-2xl bg-white/20">
            {stat.icon}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default WarrantyPeriodStats;

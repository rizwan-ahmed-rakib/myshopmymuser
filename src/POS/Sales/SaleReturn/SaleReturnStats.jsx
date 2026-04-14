import React from "react";

const SaleReturnStats = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">

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

        {/* Text Block */}
        <div className="flex-1 min-w-0">

          {/* 👉 Title = truncate (never wraps) */}
          {/*<p className="text-sm opacity-90 truncate">*/}
          <p className="text-sm opacity-90 mt-1 ">
            {stat.title}
          </p>

          {/* 👉 Count = single line, no break */}
          {/*<h4 className="text-2xl font-semibold mt-1 whitespace-nowrap overflow-hidden text-ellipsis">*/}
          <h4 className="text-1xl font-semibold mt-1 whitespace-nowrap">
            {stat.count}
          </h4>
        </div>

        {/* Icon */}
        <div className="flex-shrink-0 ml-3">
          <div className={`w-12 h-12 flex items-center justify-center rounded-full text-xl ${stat.iconBg}`}>
            {stat.icon}
          </div>
        </div>

      </div>
    ))}

  </div>
);

export default SaleReturnStats;

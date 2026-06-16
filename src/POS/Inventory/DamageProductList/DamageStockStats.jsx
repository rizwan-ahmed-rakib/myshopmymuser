// import React from 'react';

// const DamageStockStats = ({ stats }) => {
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
//             {stats.map((stat, index) => (
//                 <div
//                     key={index}
//                     className={`${stat.bgColor} rounded-xl shadow-sm p-4 text-white transform hover:scale-105 transition-transform duration-200`}
//                 >
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-sm opacity-90 mb-1">{stat.title}</p>
//                             <p className="text-2xl font-bold">{stat.count}</p>
//                         </div>
//                         <span className="text-3xl opacity-50">{stat.icon}</span>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default DamageStockStats;









import React from "react";

const statThemes = [
  { bg: "bg-indigo-50", border: "border-indigo-100", icon: "bg-indigo-100", text: "text-indigo-600", val: "text-indigo-700" },
  { bg: "bg-orange-50", border: "border-orange-100", icon: "bg-orange-100", text: "text-orange-600", val: "text-orange-700" },
  { bg: "bg-emerald-50", border: "border-emerald-100", icon: "bg-emerald-100", text: "text-emerald-600", val: "text-emerald-700" },
  { bg: "bg-rose-50", border: "border-rose-100", icon: "bg-rose-100", text: "text-rose-600", val: "text-rose-700" },
  { bg: "bg-teal-50", border: "border-teal-100", icon: "bg-teal-100", text: "text-teal-600", val: "text-teal-700" },
  { bg: "bg-amber-50", border: "border-amber-100", icon: "bg-amber-100", text: "text-amber-600", val: "text-amber-700" },
  { bg: "bg-violet-50", border: "border-violet-100", icon: "bg-violet-100", text: "text-violet-600", val: "text-violet-700" },
];

const DamageStockStats = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
    {stats.map((stat, index) => {
      const theme = statThemes[index % statThemes.length];
      return (
        <div key={index} className={`${theme.bg} border ${theme.border} rounded-xl p-3.5 flex items-center gap-2.5`}>
          <div className={`w-9 h-9 ${theme.icon} rounded-lg flex items-center justify-center text-base shrink-0`}>
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className={`text-[9px] font-semibold ${theme.text} uppercase tracking-wide leading-none mb-1`}>
              {stat.title}
            </p>
            <p className={`text-[13px] font-bold ${theme.val} leading-none truncate`}>
              {stat.count}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);

export default DamageStockStats;
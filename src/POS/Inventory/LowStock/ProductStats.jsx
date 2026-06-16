// import React from "react";
//
// const WarrantyPeriodStats = ({ stats }) => (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//                 {stats.map((stat, index) => (
//                     <div key={index} className={`${stat.bgColor} ${stat.textColor} rounded-lg shadow-sm border-0`}>
//                         <div className="p-6 flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm opacity-90 mb-1">{stat.title}</p>
//                                 <h4 className="text-2xl font-bold">{stat.count}</h4>
//                             </div>
//                             <div>
//                 <span className={`flex items-center justify-center w-12 h-12 ${stat.iconBg} rounded-full text-lg`}>
//                   {stat.icon}
//                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
// );
//
// export default WarrantyPeriodStats;


//////////////////////////////////////////

// import React from "react";

// const ProductStats = ({ stats }) => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">

//     {stats.map((stat, index) => (
//       <div
//         key={index}
//         className={`
//           ${stat.bgColor}
//           ${stat.textColor || "text-white"}
//           rounded-xl shadow-md border border-black/10
//           p-5 flex items-center justify-between
//           hover:shadow-lg transition-all duration-300
//         `}
//       >

//         {/* Text Block */}
//         <div className="flex-1 min-w-0">

//           {/* 👉 Title = truncate (never wraps) */}
//           {/*<p className="text-sm opacity-90 truncate">*/}
//           <p className="text-sm opacity-90 mt-1 ">
//             {stat.title}
//           </p>

//           {/* 👉 Count = single line, no break */}
//           {/*<h4 className="text-2xl font-semibold mt-1 whitespace-nowrap overflow-hidden text-ellipsis">*/}
//           <h4 className="text-1xl font-semibold mt-1 whitespace-nowrap">
//             {stat.count}
//           </h4>
//         </div>

//         {/* Icon */}
//         <div className="flex-shrink-0 ml-3">
//           <div className={`w-12 h-12 flex items-center justify-center rounded-full text-xl ${stat.iconBg}`}>
//             {stat.icon}
//           </div>
//         </div>

//       </div>
//     ))}

//   </div>
// );

// export default ProductStats;







import React from "react";

const statThemes = [
  { bg: "bg-indigo-50", border: "border-indigo-100", iconBg: "bg-indigo-100", text: "text-indigo-600", val: "text-indigo-700" },
  { bg: "bg-emerald-50", border: "border-emerald-100", iconBg: "bg-emerald-100", text: "text-emerald-600", val: "text-emerald-700" },
  { bg: "bg-rose-50", border: "border-rose-100", iconBg: "bg-rose-100", text: "text-rose-600", val: "text-rose-700" },
  { bg: "bg-amber-50", border: "border-amber-100", iconBg: "bg-amber-100", text: "text-amber-600", val: "text-amber-700" },
  { bg: "bg-violet-50", border: "border-violet-100", iconBg: "bg-violet-100", text: "text-violet-600", val: "text-violet-700" },
];

const ProductStats = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
    {stats.map((stat, index) => {
      const theme = statThemes[index % statThemes.length];
      return (
        <div key={index} className={`${theme.bg} border ${theme.border} rounded-xl p-4 flex items-center gap-3`}>
          <div className={`w-10 h-10 ${theme.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
            {typeof stat.icon === "string" ? (
              <span className="text-lg">{stat.icon}</span>
            ) : (
              <span className={theme.text}>{stat.icon}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className={`text-[10px] font-semibold ${theme.text} uppercase tracking-wide leading-none mb-1`}>
              {stat.title}
            </p>
            <p className={`text-[15px] font-bold ${theme.val} leading-none truncate`}>
              {stat.count}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);

export default ProductStats;
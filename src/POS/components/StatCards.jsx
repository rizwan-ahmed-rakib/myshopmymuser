// import React from 'react';
//
// /**
//  * StatCards - Standardized statistics display for module summaries.
//  * @param {Array} stats - Array of objects: { title, count, bgColor, icon }
//  */
// const StatCards = ({ stats }) => {
//     if (!stats || stats.length === 0) return null;
//
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
//             {stats.map((stat, index) => (
//                 <div
//                     key={index}
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow group overflow-hidden relative"
//                 >
//                     <div className="flex items-center justify-between relative z-10">
//                         <div className="flex-1">
//                             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
//                                 {stat.title}
//                             </p>
//                             <h3 className="text-2xl font-black text-gray-900 leading-tight">
//                                 {stat.count}
//                             </h3>
//                         </div>
//                         <div className={`${stat.bgColor || 'bg-blue-600'} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform`}>
//                             {stat.icon}
//                         </div>
//                     </div>
//                     {/* Decorative background element */}
//                     <div className={`absolute -right-4 -bottom-4 w-20 h-20 ${stat.bgColor || 'bg-blue-600'} opacity-5 rounded-full`}></div>
//                 </div>
//             ))}
//         </div>
//     );
// };
//
// export default StatCards;


///////////////////////////////////////////

// import React from 'react';
// import PropTypes from 'prop-types';
//
// /**
//  * StatCards - Standardized statistics display for module summaries.
//  * Modern micro-card layout with an elegant top-right curve overlay.
//  */
// const StatCards = ({ stats }) => {
//     if (!stats || stats.length === 0) return null;
//
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
//             {stats.map((stat, index) => {
//                 // কালার ফলব্যাক সেফটি
//                 const currentBg = stat.bgColor || 'bg-blue-600';
//
//                 return (
//                     <div
//                         key={index}
//                         className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
//                     >
//                         {/* Top-Right Premium Curve Element:
//                           এটি ওপরের ডান কোণায় পজিশন করা হয়েছে এবং বাম-নিচের দিকে (Bottom-Left)
//                           একটি বড় কার্ভ তৈরি করে কার্ডের ভেতর প্রবেশ করেছে।
//                         */}
//                         <div className={`absolute -top-6 -right-6 w-28 h-28 ${currentBg} opacity-[0.03] rounded-bl-[4rem] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12`}></div>
//
//                         <div className="flex items-start justify-between relative z-10">
//                             <div className="flex-1 pr-2">
//                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">
//                                     {stat.title}
//                                 </p>
//                                 <h3 className="text-2xl font-black text-gray-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
//                                     {stat.count}
//                                 </h3>
//                             </div>
//
//                             {/* Icon block with subtle shadow boundary */}
//                             <div className={`${currentBg} text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200/60 text-base flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
//                                 {stat.icon}
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };
//
// StatCards.propTypes = {
//     stats: PropTypes.arrayOf(
//         PropTypes.shape({
//             title: PropTypes.string.isRequired,
//             count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//             bgColor: PropTypes.string,
//             icon: PropTypes.node
//         })
//     ).isRequired
// };
//
// export default StatCards;


// import React from 'react';
// import PropTypes from 'prop-types';
//
// /**
//  * StatCards - Standardized statistics display for module summaries.
//  * Production-level responsive layout: Compact on mobile, spacious on desktop.
//  */
// const StatCards = ({ stats }) => {
//     if (!stats || stats.length === 0) return null;
//
//     return (
//         /* 🔥 গ্রিড রেসপন্সিভনেস আপডেট:
//           - মোবাইলে পাশাপাশি ২টি কার্ড দেখাবে (`grid-cols-2`)
//           - মাঝারি স্ক্রিন বা ট্যাবলেটে ৩টি করে (`md:grid-cols-3`)
//           - ল্যাপটপ বা বড় মনিটরে আগের মতোই ৪টি সুন্দর কলাম থাকবে (`lg:grid-cols-4`)
//           - মোবাইলে গ্যাপ একটু কম (gap-3.5) এবং বড় স্ক্রিনে স্ট্যান্ডার্ড (lg:gap-6) থাকবে।
//         */
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 lg:gap-6 mb-6">
//             {stats.map((stat, index) => {
//                 const currentBg = stat.bgColor || 'bg-blue-600';
//
//                 return (
//                     <div
//                         key={index}
//                         /* মোবাইলে প্যাডিং একটু কম (p-4) এবং ডেস্কটপে লাক্সারিয়াস স্পেস (lg:p-6) */
//                         className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
//                     >
//                         {/* Premium Curve Effect */}
//                         <div className={`absolute -top-6 -right-6 w-24 lg:w-28 h-24 lg:h-28 ${currentBg} opacity-[0.03] rounded-bl-[4rem] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12`}></div>
//
//                         {/* মোবাইলে টেক্সট এবং আইকন নিচে-উপরে (flex-col-reverse) চমৎকার ফিট হবে,
//                           আর বড় স্ক্রিনে (sm থেকে) আগের মতো পাশাপাশি (sm:flex-row) এলাইন হবে।
//                         */}
//                         <div className="flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-3 relative z-10">
//                             <div className="flex-1 min-w-0 pr-1">
//                                 <p className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none truncate">
//                                     {stat.title}
//                                 </p>
//                                 <h3 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight truncate">
//                                     {stat.count}
//                                 </h3>
//                             </div>
//
//                             {/* Icon Block - মোবাইলে কিছুটা কমপ্যাক্ট (w-9 h-9) এবং ডেস্কটপে স্ট্যান্ডার্ড (sm:w-10 sm:h-10) */}
//                             <div className={`${currentBg} text-white w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200/60 text-sm sm:text-base flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
//                                 {stat.icon}
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };
//
// StatCards.propTypes = {
//     stats: PropTypes.arrayOf(
//         PropTypes.shape({
//             title: PropTypes.string.isRequired,
//             count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//             bgColor: PropTypes.string,
//             icon: PropTypes.node
//         })
//     ).isRequired
// };
//
// export default StatCards;


// import React from 'react';
// import PropTypes from 'prop-types';
//
// /**
//  * StatCards - Standardized statistics display for module summaries.
//  * Production-level compact scrollable layout for mobile, structural grid for desktop.
//  */
// const StatCards = ({ stats }) => {
//     if (!stats || stats.length === 0) return null;
//
//     return (
//         /* 🔥 পরিবর্তন এখানে:
//           - মোবাইলে এক লাইনে থাকবে এবং ডানে-বামে স্ক্রোল হবে (`flex overflow-x-auto scrollbar-none`)
//           - মাঝারি বা ল্যাপটপ স্ক্রিন থেকে (`md:grid`) গ্রিড লেআউটে কনভার্ট হয়ে যাবে।
//           - `[scrollbar-width:none]` এবং `[&::-webkit-scrollbar]:hidden` দিয়ে বিশ্রী স্ক্রোলবার লুকিয়ে ফেলা হয়েছে।
//         */
//         <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-3.5 lg:gap-6 mb-6 scrollbar-none max-w-full pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//             {stats.map((stat, index) => {
//                 const currentBg = stat.bgColor || 'bg-blue-600';
//
//                 return (
//                     <div
//                         key={index}
//                         /* মোবাইলে `w-[190px] xs:w-[220px] shrink-0` ব্যবহার করা হয়েছে
//                            যাতে এক লাইনে থাকার সময় কার্ডের উইথ কুঁচকে বা ছোট হয়ে না যায় */
//                         className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group w-[185px] xs:w-[210px] md:w-auto shrink-0"
//                     >
//                         {/* Premium Curve Effect */}
//                         <div className={`absolute -top-6 -right-6 w-24 lg:w-28 h-24 lg:h-28 ${currentBg} opacity-[0.03] rounded-bl-[4rem] transition-transform duration-500 group-hover:scale-110`}></div>
//
//                         {/* কন্টেন্ট লেআউট: ডেটা সবসময় এক লাইনে সুন্দর রাখতে পাশাপাশি (flex-row) রাখা হয়েছে */}
//                         <div className="flex items-start justify-between gap-2 relative z-10">
//                             <div className="flex-1 min-w-0 pr-1">
//                                 <p className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none truncate">
//                                     {stat.title}
//                                 </p>
//                                 <h3 className="text-lg lg:text-2xl font-black text-gray-900 tracking-tight truncate">
//                                     {stat.count}
//                                 </h3>
//                             </div>
//
//                             {/* Icon Block — ওজনে হালকা এবং কমপ্যাক্ট (w-8 h-8) করা হয়েছে */}
//                             <div className={`${currentBg} text-white w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md shadow-gray-200/40 text-xs lg:text-base flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
//                                 {stat.icon}
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };
//
// StatCards.propTypes = {
//     stats: PropTypes.arrayOf(
//         PropTypes.shape({
//             title: PropTypes.string.isRequired,
//             count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//             bgColor: PropTypes.string,
//             icon: PropTypes.node
//         })
//     ).isRequired
// };
//
// export default StatCards;


// import React from 'react';
// import PropTypes from 'prop-types';
//
// /**
//  * StatCards - Standardized statistics display for module summaries.
//  * Production-level highly compact scrollable layout for mobile/tabs, clean grid for desktop.
//  */
// const StatCards = ({ stats }) => {
//     if (!stats || stats.length === 0) return null;
//
//     return (
//         /* 🔥 পরিবর্তন এখানে:
//           - মোবাইলে এক লাইনে থাকবে এবং স্মুথলি স্ক্রোল হবে (`flex overflow-x-auto`)
//           - `pb-2 -mb-2` যোগ করা হয়েছে যাতে স্ক্রোল করার সময় কার্ডের নিচের শ্যাডো (Shadow) কেটে না যায়।
//           - ল্যাপটপ বা বড় স্ক্রিনে স্বয়ংক্রিয়ভাবে ৪ কলামের গ্রিডে রূপান্তর হবে।
//         */
//         <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6 mb-5 scrollbar-none max-w-full pb-2 -mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//             {stats.map((stat, index) => {
//                 const currentBg = stat.bgColor || 'bg-blue-600';
//
//                 return (
//                     <div
//                         key={index}
//                         /* 🔥 মোবাইল অপ্টিমাইজেশন:
//                           - কার্ডের উইথ কিছুটা কমিয়ে `w-[145px] xs:w-[165px]` করা হয়েছে। এর ফলে ৬টি কার্ড থাকলেও ছোট স্ক্রিনে এক লাইনেই থাকবে এবং একসাথে স্ক্রিনে বেশি কার্ড দেখা যাবে।
//                           - প্যাডিং কমিয়ে `p-3` করা হয়েছে যেন কার্ডগুলো অতিরিক্ত বড় না দেখায়।
//                         */
//                         className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group w-[145px] xs:w-[165px] md:w-auto shrink-0"
//                     >
//                         {/* Premium Curve Effect */}
//                         <div className={`absolute -top-6 -right-6 w-20 lg:w-28 h-20 lg:h-28 ${currentBg} opacity-[0.03] rounded-bl-[4rem] transition-transform duration-500 group-hover:scale-110`}></div>
//
//                         {/* Layout Content */}
//                         <div className="flex items-start justify-between gap-1.5 relative z-10">
//                             <div className="flex-1 min-w-0">
//                                 {/* ছোট স্ক্রিনে টেক্সট সাইজ এবং মার্জিন আরও সুক্ষ্ম করা হয়েছে */}
//                                 <p className="text-[8px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 leading-none truncate">
//                                     {stat.title}
//                                 </p>
//                                 <h3 className="text-base lg:text-2xl font-black text-gray-900 tracking-tight truncate">
//                                     {stat.count}
//                                 </h3>
//                             </div>
//
//                             {/* Icon Block — মোবাইলে হালকা ও ছোট (w-7 h-7) করা হয়েছে যেন টেক্সটের জন্য বেশি জায়গা থাকে */}
//                             <div className={`${currentBg} text-white w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md shadow-gray-200/40 text-[10px] lg:text-base flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
//                                 {stat.icon}
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };
//
// StatCards.propTypes = {
//     stats: PropTypes.arrayOf(
//         PropTypes.shape({
//             title: PropTypes.string.isRequired,
//             count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//             bgColor: PropTypes.string,
//             icon: PropTypes.node
//         })
//     ).isRequired
// };
//
// export default StatCards;


import React from 'react';
import PropTypes from 'prop-types';

/**
 * StatCards - Standardized statistics display for module summaries.
 * Ultra-compact scrollable layout for mobile to fit at least 4 cards in viewport.
 */
const StatCards = ({stats}) => {
    if (!stats || stats.length === 0) return null;

    return (
        /* 🔥 লেআউট কন্টেইনার:
          - মোবাইলে এক সারিতে ৪+ কার্ড দেখানোর জন্য ফ্লেক্স ও গ্যাপ ২.৫ (`gap-2.5`) করা হয়েছে।
          - শ্যাডো যেন কেটে না যায় সেজন্য `pb-2 -mb-2` রাখা হয়েছে।
        */
        <div
            className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-2.5 lg:gap-6 mb-5 scrollbar-none max-w-full pb-2 -mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {stats.map((stat, index) => {
                const currentBg = stat.bgColor || 'bg-blue-600';

                return (
                    <div
                        key={index}
                        /* 🔥 আল্ট্রা-কমপ্যাক্ট মোবাইল রেসপন্সিভনেস:
                          - কার্ডের উইথ কমিয়ে `w-[115px]` এবং `xs:w-[130px]` করা হয়েছে যাতে স্ক্রিনে একসাথে ৪টি কার্ড ধরে যায়।
                          - মোবাইলে প্যাডিং কমিয়ে `p-2.5` করা হয়েছে যেন জায়গা নষ্ট না হয়।
                        */
                        className="bg-white rounded-xl lg:rounded-2xl p-2.5 lg:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group w-[115px] xs:w-[130px] md:w-auto shrink-0"
                    >
                        {/* Premium Curve Effect */}
                        <div
                            className={`absolute -top-6 -right-6 w-16 lg:w-28 h-16 lg:h-28 ${currentBg} opacity-[0.03] rounded-bl-[4rem] transition-transform duration-500 group-hover:scale-110`}></div>

                        {/* Layout Content */}
                        <div className="flex items-start justify-between gap-1 relative z-10">
                            <div className="flex-1 min-w-0">
                                {/* টাইটেল এবং কাউন্টের সাইজ মোবাইলের জন্য আরও ছোট ও নিখুঁত করা হয়েছে */}
                                <p className="text-[8px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 leading-none truncate">
                                    {stat.title}
                                </p>
                                <h3 className="text-sm lg:text-2xl font-black text-gray-900 tracking-tight truncate">
                                    {stat.count}
                                </h3>
                            </div>

                            {/* Icon Block — মোবাইলে একদম মিনিমাল (w-6 h-6) এবং আইকন সাইজ ছোট করা হয়েছে */}
                            <div
                                className={`${currentBg} text-white w-6 h-6 lg:w-10 lg:h-10 rounded-md lg:rounded-xl flex items-center justify-center shadow-sm text-[10px] lg:text-base flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                                <span className="scale-90 lg:scale-100">{stat.icon}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

StatCards.propTypes = {
    stats: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            bgColor: PropTypes.string,
            icon: PropTypes.node
        })
    ).isRequired
};

export default StatCards;


///////////////////////////////////////////////////////


// import React from 'react';
// import PropTypes from 'prop-types';
//
// /**
//  * StatCards - Standardized statistics display for module summaries.
//  * Updated to match the modern corporate micro-card design.
//  */
// const StatCards = ({ stats }) => {
//     if (!stats || stats.length === 0) return null;
//
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
//             {stats.map((stat, index) => {
//                 //bgColor না থাকলে সেফটি ফলব্যাক হিসেবে bg-blue-600 সেট করা
//                 const currentBg = stat.bgColor || 'bg-blue-600';
//
//                 return (
//                     <div
//                         key={index}
//                         className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
//                     >
//                         {/* Decorative Corner Background Element */}
//                         <div className={`absolute top-0 right-0 w-24 h-24 ${currentBg} opacity-[0.03] rounded-bl-full transition-transform duration-500 group-hover:scale-110`}></div>
//
//                         <div className="flex items-start justify-between relative z-10">
//                             <div className="flex-1 pr-2">
//                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">
//                                     {stat.title}
//                                 </p>
//                                 <h3 className="text-2xl font-black text-gray-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
//                                     {stat.count}
//                                 </h3>
//                             </div>
//
//                             {/* Icon Wrapper with dynamically controlled shadow tint */}
//                             <div className={`${currentBg} text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200/50 text-base flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
//                                 {stat.icon}
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };
//
// StatCards.propTypes = {
//     stats: PropTypes.arrayOf(
//         PropTypes.shape({
//             title: PropTypes.string.isRequired,
//             count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//             bgColor: PropTypes.string,
//             icon: PropTypes.node
//         })
//     ).isRequired
// };
//
// export default StatCards;
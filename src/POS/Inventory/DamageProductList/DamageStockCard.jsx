// import React, {useState, useRef, useEffect} from "react";
// import {useNavigate} from "react-router-dom";
// import UpdateDamageStockModal from "./UpdateDamageStockModal";
// import SuccessPopup from "./SuccessPopup";
// import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";

// const DamageStockCard = ({record, onEdit, onDelete}) => {
//     const navigate = useNavigate();
//     const [selectedRecord, setSelectedRecord] = useState(null);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showSuccess, setShowSuccess] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");
//     const [loadingId, setLoadingId] = useState(null);

//     const [showDropdown, setShowDropdown] = useState(false);
//     const dropdownRef = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setShowDropdown(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const handleDetailsClick = () => {
//         navigate(`/inventory/damage-stock/details/${record.id}`);
//     };

//     const handleEdit = () => {
//         setSelectedRecord(record);
//         setShowEditModal(true);
//         setShowDropdown(false);
//     };

//     const handleDelete = async () => {
//         if (!window.confirm(`আপনি কি ${record.product_name} ড্যামেজ রেকর্ডটি ডিলিট করতে চান?`)) {
//             return;
//         }

//         setLoadingId(record.id);
//         try {
//             await posDamageProductAPI.delete(record.id);
//             setSuccessMessage(`${record.product_name} ড্যামেজ রেকর্ড সফলভাবে ডিলিট করা হয়েছে!`);
//             setShowSuccess(true);
//             setShowDropdown(false);

//             if (onDelete) {
//                 onDelete();
//             }
//         } catch (error) {
//             console.error("Delete error:", error);
//             alert("রেকর্ড ডিলিট করতে সমস্যা হয়েছে।");
//         } finally {
//             setLoadingId(null);
//         }
//     };

//     const handleUpdateSuccess = (updatedData) => {
//         setShowEditModal(false);
//         setSuccessMessage("রেকর্ড সফলভাবে আপডেট করা হয়েছে!");
//         setShowSuccess(true);

//         if (onEdit) {
//             onEdit();
//         }
//     };

//     const formatMoney = (value) => {
//         return new Intl.NumberFormat('bn-BD', {
//             style: 'currency',
//             currency: 'BDT',
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2
//         }).format(value);
//     }

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('bn-BD', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     }

//     const getDamageTypeBadge = (type) => {
//         if (type === 'returnable') {
//             return <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">রিটার্নযোগ্য</span>;
//         } else {
//             return <span className="px-2 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">নন-রিটার্নযোগ্য</span>;
//         }
//     }

//     const getCompensationBadge = (isCompensated) => {
//         if (isCompensated) {
//             return <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">ক্ষতিপূরণ দেওয়া হয়েছে</span>;
//         } else {
//             return <span className="px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-100 rounded-full">ক্ষতিপূরণ বাকি</span>;
//         }
//     }

//     return (
//         <>
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
//                 <div className="relative h-32 bg-gradient-to-r from-red-50 to-orange-50 p-4">
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <h3
//                                 onClick={handleDetailsClick}
//                                 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
//                             >
//                                 {record.product_name}
//                             </h3>
//                             <p className="text-xs text-gray-500">কোড: {record.product_code}</p>
//                         </div>

//                         <div className="relative" ref={dropdownRef}>
//                             <button
//                                 onClick={() => setShowDropdown(!showDropdown)}
//                                 className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
//                                 disabled={loadingId === record.id}
//                             >
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                             d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
//                                 </svg>
//                             </button>

//                             {showDropdown && (
//                                 <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
//                                     <button
//                                         onClick={handleEdit}
//                                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                                         disabled={loadingId === record.id}
//                                     >
//                                         এডিট করুন
//                                     </button>
//                                     <button
//                                         onClick={handleDelete}
//                                         className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
//                                         disabled={loadingId === record.id}
//                                     >
//                                         ডিলিট করুন
//                                     </button>
//                                     <div className="border-t border-gray-100 my-1"></div>
//                                     <button
//                                         onClick={handleDetailsClick}
//                                         className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
//                                     >
//                                         বিস্তারিত দেখুন
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className="mt-2 flex flex-wrap gap-2">
//                         {getDamageTypeBadge(record.damage_type)}
//                         {getCompensationBadge(record.is_compensated)}
//                     </div>
//                 </div>

//                 <div className="p-4">
//                     <div className="grid grid-cols-2 gap-3 mb-3">
//                         <div>
//                             <p className="text-xs text-gray-500">পরিমাণ</p>
//                             <p className="font-bold text-lg text-gray-900">{record.quantity} পিস</p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-gray-500">ইউনিট খরচ</p>
//                             <p className="font-semibold text-gray-700">{formatMoney(record.unit_cost)}</p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-gray-500">মোট ক্ষতি</p>
//                             <p className="font-semibold text-red-600">{formatMoney(record.total_loss)}</p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-gray-500">তারিখ</p>
//                             <p className="text-sm text-gray-600">{formatDate(record.created_at)}</p>
//                         </div>
//                     </div>

//                     {record.reason && (
//                         <div className="mt-2 p-2 bg-gray-50 rounded-lg">
//                             <p className="text-xs text-gray-500">কারণ:</p>
//                             <p className="text-sm text-gray-700 line-clamp-2">{record.reason}</p>
//                         </div>
//                     )}

//                     <div className="mt-3 text-xs text-gray-400">
//                         সোর্স: {record.source_display}
//                     </div>
//                 </div>
//             </div>

//             {showEditModal && selectedRecord && (
//                 <UpdateDamageStockModal
//                     isOpen={showEditModal}
//                     onClose={() => {
//                         setShowEditModal(false);
//                         setSelectedRecord(null);
//                     }}
//                     onSuccess={handleUpdateSuccess}
//                     recordData={selectedRecord}
//                 />
//             )}

//             {showSuccess && (
//                 <SuccessPopup
//                     message={successMessage}
//                     onClose={() => setShowSuccess(false)}
//                     duration={3000}
//                 />
//             )}
//         </>
//     );
// };

// export default DamageStockCard;


















import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UpdateDamageStockModal from "./UpdateDamageStockModal";
import SuccessPopup from "./SuccessPopup";
import { posDamageProductAPI } from "../../../context_or_provider/pos/damageProducts/damage_productAPI";

const DamageStockCard = ({ record, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDetailsClick = () => navigate(`/inventory/damage-stock/details/${record.id}`);

  const handleEdit = () => { setSelectedRecord(record); setShowEditModal(true); setShowDropdown(false); };

  const handleDelete = async () => {
    if (!window.confirm(`"${record.product_name}" ড্যামেজ রেকর্ডটি ডিলিট করবেন?`)) return;
    setLoadingId(record.id);
    try {
      await posDamageProductAPI.delete(record.id);
      setSuccessMessage(`${record.product_name} ড্যামেজ রেকর্ড সফলভাবে ডিলিট করা হয়েছে!`);
      setShowSuccess(true);
      setShowDropdown(false);
      if (onDelete) onDelete();
    } catch {
      alert("রেকর্ড ডিলিট করতে সমস্যা হয়েছে।");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdateSuccess = () => {
    setShowEditModal(false);
    setSuccessMessage("রেকর্ড সফলভাবে আপডেট করা হয়েছে!");
    setShowSuccess(true);
    if (onEdit) onEdit();
  };

  const formatMoney = (value) =>
    new Intl.NumberFormat("bn-BD", { style: "currency", currency: "BDT", minimumFractionDigits: 2 }).format(value);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" });

  const isReturnable = record.damage_type === "returnable";

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 overflow-hidden group">

        {/* Top accent header */}
        <div className={`px-4 pt-4 pb-3 ${isReturnable ? "bg-emerald-50/60" : "bg-rose-50/60"} border-b border-slate-100`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3
                onClick={handleDetailsClick}
                className="text-[13px] font-semibold text-slate-800 hover:text-orange-500 cursor-pointer truncate transition-colors"
              >
                {record.product_name}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">কোড: {record.product_code}</p>
            </div>

            {/* 3-dot menu */}
            <div className="relative ml-2 shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={loadingId === record.id}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/70 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-10">
                  <button onClick={handleEdit} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[12px] text-slate-700 hover:bg-slate-50">
                    <svg className="w-3.5 h-3.5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    এডিট করুন
                  </button>
                  <button onClick={() => { handleDetailsClick(); setShowDropdown(false); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[12px] text-slate-700 hover:bg-slate-50">
                    <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    বিস্তারিত দেখুন
                  </button>
                  <div className="my-1 border-t border-slate-100"/>
                  <button onClick={handleDelete} disabled={loadingId === record.id} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[12px] text-rose-600 hover:bg-rose-50">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    </svg>
                    ডিলিট করুন
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
              isReturnable
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}>
              {isReturnable ? "↩ রিটার্নযোগ্য" : "✕ নন-রিটার্নযোগ্য"}
            </span>
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
              record.is_compensated
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              {record.is_compensated ? "✓ ক্ষতিপূরণ দেওয়া" : "⏳ বাকি"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">পরিমাণ</p>
              <p className="text-[14px] font-bold text-slate-800">{record.quantity} <span className="text-[10px] font-normal text-slate-400">পিস</span></p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">ইউনিট খরচ</p>
              <p className="text-[12px] font-semibold text-slate-600">{formatMoney(record.unit_cost)}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">মোট ক্ষতি</p>
              <p className="text-[13px] font-bold text-rose-600">{formatMoney(record.total_loss)}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">তারিখ</p>
              <p className="text-[11px] text-slate-500">{formatDate(record.created_at)}</p>
            </div>
          </div>

          {record.reason && (
            <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">কারণ</p>
              <p className="text-[11px] text-slate-600 line-clamp-2">{record.reason}</p>
            </div>
          )}

          <p className="mt-2.5 text-[10px] text-slate-400">সোর্স: {record.source_display}</p>
        </div>
      </div>

      {showEditModal && selectedRecord && (
        <UpdateDamageStockModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedRecord(null); }}
          onSuccess={handleUpdateSuccess}
          recordData={selectedRecord}
        />
      )}
      {showSuccess && (
        <SuccessPopup message={successMessage} onClose={() => setShowSuccess(false)} duration={3000} />
      )}
    </>
  );
};

export default DamageStockCard;
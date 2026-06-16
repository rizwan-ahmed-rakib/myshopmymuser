// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import UpdateDamageStockModal from './UpdateDamageStockModal';
// import SuccessPopup from './SuccessPopup';
// import { posDamageProductAPI } from '../../../context_or_provider/pos/damageProducts/damage_productAPI';

// const DamageStockList = ({ records, onUpdate }) => {
//     const navigate = useNavigate();
//     const [selectedRecord, setSelectedRecord] = useState(null);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showSuccess, setShowSuccess] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");
//     const [loadingId, setLoadingId] = useState(null);

//     const handleEdit = (record) => {
//         setSelectedRecord(record);
//         setShowEditModal(true);
//     };

//     const handleDelete = async (record) => {
//         if (!window.confirm(`আপনি কি ${record.product_name} ড্যামেজ রেকর্ডটি ডিলিট করতে চান?`)) {
//             return;
//         }

//         setLoadingId(record.id);
//         try {
//             await posDamageProductAPI.delete(record.id);
//             setSuccessMessage(`${record.product_name} ড্যামেজ রেকর্ড সফলভাবে ডিলিট করা হয়েছে!`);
//             setShowSuccess(true);

//             if (onUpdate) {
//                 onUpdate();
//             }
//         } catch (error) {
//             console.error("Delete error:", error);
//             alert("রেকর্ড ডিলিট করতে সমস্যা হয়েছে।");
//         } finally {
//             setLoadingId(null);
//         }
//     };

//     const handleUpdateSuccess = () => {
//         setShowEditModal(false);
//         setSuccessMessage("রেকর্ড সফলভাবে আপডেট করা হয়েছে!");
//         setShowSuccess(true);

//         if (onUpdate) {
//             onUpdate();
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
//             return <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">দেওয়া হয়েছে</span>;
//         } else {
//             return <span className="px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-100 rounded-full">বাকি</span>;
//         }
//     }

//     return (
//         <>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">প্রোডাক্ট</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ধরণ</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">পরিমাণ</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ইউনিট খরচ</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">মোট ক্ষতি</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ক্ষতিপূরণ</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {records.map((record) => (
//                             <tr key={record.id} className="hover:bg-gray-50">
//                                 <td className="px-6 py-4">
//                                     <div>
//                                         <div className="font-medium text-gray-900">{record.product_name}</div>
//                                         <div className="text-sm text-gray-500">কোড: {record.product_code}</div>
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     {getDamageTypeBadge(record.damage_type)}
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <span className="font-medium">{record.quantity}</span> পিস
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     {formatMoney(record.unit_cost)}
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <span className="font-medium text-red-600">{formatMoney(record.total_loss)}</span>
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     {getCompensationBadge(record.is_compensated)}
//                                 </td>
//                                 <td className="px-6 py-4 text-sm text-gray-500">
//                                     {formatDate(record.created_at)}
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <div className="flex space-x-2">
//                                         <button
//                                             onClick={() => navigate(`/inventory/damage-stock/details/${record.id}`)}
//                                             className="text-blue-600 hover:text-blue-800"
//                                             title="বিস্তারিত"
//                                         >
//                                             👁️
//                                         </button>
//                                         <button
//                                             onClick={() => handleEdit(record)}
//                                             className="text-green-600 hover:text-green-800"
//                                             title="এডিট"
//                                             disabled={loadingId === record.id}
//                                         >
//                                             ✏️
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(record)}
//                                             className="text-red-600 hover:text-red-800"
//                                             title="ডিলিট"
//                                             disabled={loadingId === record.id}
//                                         >
//                                             🗑️
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
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

// export default DamageStockList;












import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateDamageStockModal from "./UpdateDamageStockModal";
import SuccessPopup from "./SuccessPopup";
import LoadingSpinner from "./LoadingSpinner";
import { posDamageProductAPI } from "../../../context_or_provider/pos/damageProducts/damage_productAPI";

const DamageStockList = ({ records, onUpdate }) => {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const handleEdit = (record) => { setSelectedRecord(record); setShowEditModal(true); };

  const handleDelete = async (record) => {
    if (!window.confirm(`"${record.product_name}" ড্যামেজ রেকর্ডটি ডিলিট করবেন?`)) return;
    setLoadingId(record.id);
    try {
      await posDamageProductAPI.delete(record.id);
      setSuccessMessage(`${record.product_name} ড্যামেজ রেকর্ড সফলভাবে ডিলিট করা হয়েছে!`);
      setShowSuccess(true);
      if (onUpdate) onUpdate();
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
    if (onUpdate) onUpdate();
  };

  const formatMoney = (value) =>
    new Intl.NumberFormat("bn-BD", { style: "currency", currency: "BDT", minimumFractionDigits: 2 }).format(value);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" });

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Table header */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <div className="grid grid-cols-12 gap-3 min-w-[700px]">
            <div className="col-span-3"><span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">প্রোডাক্ট</span></div>
            <div className="col-span-2"><span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">ধরণ</span></div>
            <div className="col-span-1"><span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">পরিমাণ</span></div>
            <div className="col-span-2"><span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">মোট ক্ষতি</span></div>
            <div className="col-span-2"><span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">ক্ষতিপূরণ</span></div>
            <div className="col-span-2 text-right"><span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Actions</span></div>
          </div>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {records?.filter(Boolean).map((record) => (
            <div key={record.id} className="px-5 py-3.5 hover:bg-slate-50/70 transition-colors min-w-[700px]">
              <div className="grid grid-cols-12 gap-3 items-center">

                {/* Product */}
                <div className="col-span-3">
                  <p
                    onClick={() => navigate(`/inventory/damage-stock/details/${record.id}`)}
                    className="text-[13px] font-medium text-slate-800 hover:text-orange-500 cursor-pointer truncate transition-colors"
                  >
                    {record.product_name}
                  </p>
                  <p className="text-[10px] text-slate-400">কোড: {record.product_code}</p>
                </div>

                {/* Damage type */}
                <div className="col-span-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    record.damage_type === "returnable"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}>
                    {record.damage_type === "returnable" ? "↩ রিটার্নযোগ্য" : "✕ নন-রিটার্ন"}
                  </span>
                </div>

                {/* Quantity */}
                <div className="col-span-1">
                  <p className="text-[13px] font-semibold text-slate-700">{record.quantity}</p>
                  <p className="text-[9px] text-slate-400">পিস</p>
                </div>

                {/* Total loss */}
                <div className="col-span-2">
                  <p className="text-[12px] font-bold text-rose-600">{formatMoney(record.total_loss)}</p>
                  <p className="text-[9px] text-slate-400">{formatDate(record.created_at)}</p>
                </div>

                {/* Compensation */}
                <div className="col-span-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    record.is_compensated
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {record.is_compensated ? "✓ দেওয়া হয়েছে" : "⏳ বাকি"}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button onClick={() => navigate(`/inventory/damage-stock/details/${record.id}`)} title="বিস্তারিত" className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button onClick={() => handleEdit(record)} title="এডিট" disabled={loadingId === record.id} className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(record)} title="ডিলিট" disabled={loadingId === record.id} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    {loadingId === record.id ? <LoadingSpinner size="xs" /> : (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {(!records || records.length === 0) && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <p className="text-[13px] font-medium text-slate-700">কোনো রেকর্ড পাওয়া যায়নি</p>
            </div>
          )}
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

export default DamageStockList;
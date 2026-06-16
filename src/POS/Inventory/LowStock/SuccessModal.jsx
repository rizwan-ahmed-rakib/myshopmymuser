// const SuccessModal = ({ isOpen, onClose, employee: product }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm text-center p-6">
                
//                 <div className="mx-auto bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
//                     <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
//                 </div>

//                 <h2 className="text-2xl font-bold text-gray-800 mt-4">
//                     Product Added!
//                 </h2>

//                 <p className="text-gray-600 mb-4">The new product has been successfully added to your inventory.</p>

//                 <div className="bg-gray-50 rounded-lg p-4 my-4 text-left">
//                     <div className="flex items-center space-x-4">
//                         <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
//                             {product.image ? (
//                                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
//                             ) : (
//                                 <div className="w-full h-full flex items-center justify-center text-gray-400">
//                                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 18" /></svg>
//                                 </div>
//                             )}
//                         </div>
//                         <div>
//                             <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
//                             <p className="text-sm text-gray-500">Price: <span className="font-semibold">${parseFloat(product.selling_price).toFixed(2)}</span></p>
//                             <p className="text-sm text-gray-500">Stock: <span className="font-semibold">{product.stock} units</span></p>
//                         </div>
//                     </div>
//                 </div>

//                 <button
//                     className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//                     onClick={onClose}
//                 >
//                     Great, thanks!
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default SuccessModal;

















import React from "react";

const SuccessModal = ({ isOpen, onClose, employee: product }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">

        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400" />

        <div className="p-6 text-center">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>

          <h2 className="text-[16px] font-semibold text-slate-800 mb-1">Product Added!</h2>
          <p className="text-[12px] text-slate-500 mb-5">Successfully added to your inventory.</p>

          {/* Product preview */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-left mb-5">
            <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-white shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-slate-800 truncate">{product.name}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Price: <span className="font-medium text-slate-700">৳{parseFloat(product.selling_price || 0).toFixed(2)}</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Stock: <span className="font-medium text-slate-700">{product.stock} units</span>
              </p>
            </div>
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
              Active
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-[13px] font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
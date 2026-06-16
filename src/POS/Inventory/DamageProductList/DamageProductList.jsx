// import React, {useState} from "react";
// import {useNavigate} from "react-router-dom";
// import LoadingSpinner from "./LoadingSpinner";
// import UpdateDamageProductModal from "./UpdateDamageProductModal";
// import SuccessPopup from "./SuccessPopup";
// import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";

// const DamageProductList = ({products, onUpdate}) => {
//     const navigate = useNavigate();
//     const [loadingId, setLoadingId] = useState(null);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [showSuccess, setShowSuccess] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");

//     const handleViewDetails = (product) => {
//         navigate(`/inventory/damage-product/details/${product.id}`);
//         // navigate(`/inventory/products/${product.id}`);

//     };

//     const handleEdit = (product) => {
//         setSelectedProduct(product);
//         setShowEditModal(true);
//     };

//     const handleDelete = async (product) => {
//         if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) {
//             return;
//         }

//         setLoadingId(product.id);
//         try {
//             await posDamageProductAPI.delete(product.id);
//             setSuccessMessage(`${product.name} deleted successfully!`);
//             setShowSuccess(true);

//             if (onUpdate) {
//                 onUpdate();
//             }
//         } catch (error) {
//             console.error("Delete error:", error);
//             alert("Failed to delete product.");
//         } finally {
//             setLoadingId(null);
//         }
//     };

//     const handleUpdateSuccess = (updatedData) => {
//         setShowEditModal(false);
//         setSuccessMessage("Product updated successfully!");
//         setShowSuccess(true);

//         if (onUpdate) {
//             onUpdate();
//         }
//     };

//     return (
//         <>
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
//                     <div className="grid grid-cols-12 gap-4">
//                         <div className="col-span-4">
//                             <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Product
//                             </span>
//                         </div>
//                         <div className="col-span-2">
//                             <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Category
//                             </span>
//                         </div>
//                         <div className="col-span-2">
//                             <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Price
//                             </span>
//                         </div>
//                         <div className="col-span-2">
//                             <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Stock
//                             </span>
//                         </div>
//                         <div className="col-span-2 text-right">
//                             <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Actions
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="divide-y divide-gray-100">
//                     {products?.filter(p => p).map((product) => (
//                         <div
//                             key={product.id}
//                             className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
//                         >
//                             <div className="grid grid-cols-12 gap-4 items-center">
//                                 <div className="col-span-4">
//                                     <div className="flex items-center">
//                                         <div className="flex-shrink-0">
//                                             <img
//                                                 className="h-10 w-10 rounded-lg border border-gray-200"
//                                                 src={product.image || "https://via.placeholder.com/150"}
//                                                 alt={product.name}
//                                                 onError={(e) => {
//                                                     e.target.src = "https://via.placeholder.com/150";
//                                                 }}
//                                             />
//                                         </div>
//                                         <div className="ml-4">
//                                             <p className="text-sm font-medium text-gray-900">
//                                                 {product.name}
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 Code: {product.product_code}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-span-2">
//                                     <span
//                                         className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                         {product.category_name || "N/A"}
//                                     </span>
//                                 </div>

//                                 <div className="col-span-2">
//                                     <p className="text-sm text-gray-900">৳{product.selling_price}</p>
//                                 </div>

//                                 <div className="col-span-2">
//                                     <p className="text-sm text-gray-900">{product.stock}</p>
//                                 </div>

//                                 <div className="col-span-2">
//                                     <div className="flex items-center justify-end space-x-2">
//                                         <button
//                                             onClick={() => handleViewDetails(product)}
//                                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                             title="View Details"
//                                         >
//                                             <svg className="w-4 h-4" fill="none" stroke="currentColor"
//                                                  viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                                       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
//                                             </svg>
//                                         </button>

//                                         <button
//                                             onClick={() => handleEdit(product)}
//                                             className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                                             title="Edit"
//                                             disabled={loadingId === product.id}
//                                         >
//                                             <svg className="w-4 h-4" fill="none" stroke="currentColor"
//                                                  viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                                       d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
//                                             </svg>
//                                         </button>

//                                         <button
//                                             onClick={() => handleDelete(product)}
//                                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                             title="Delete"
//                                             disabled={loadingId === product.id}
//                                         >
//                                             {loadingId === product.id ? (
//                                                 <LoadingSpinner size="xs"/>
//                                             ) : (
//                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor"
//                                                      viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
//                                                 </svg>
//                                             )}
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}

//                     {(!products || products.length === 0) && (
//                         <div className="px-6 py-12 text-center">
//                             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
//                                  stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
//                                       d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
//                             </svg>
//                             <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
//                             <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {showEditModal && selectedProduct && (
//                 <UpdateDamageProductModal
//                     isOpen={showEditModal}
//                     onClose={() => {
//                         setShowEditModal(false);
//                         setSelectedProduct(null);
//                     }}
//                     onSuccess={handleUpdateSuccess}
//                     productData={selectedProduct}
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

// export default DamageProductList;

















import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import UpdateDamageProductModal from "./UpdateDamageProductModal";
import SuccessPopup from "./SuccessPopup";
import { posDamageProductAPI } from "../../../context_or_provider/pos/damageProducts/damage_productAPI";

const DamageProductList = ({ products, onUpdate }) => {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleViewDetails = (p) => navigate(`/inventory/damage-product/details/${p.id}`);
  const handleEdit = (p) => { setSelectedProduct(p); setShowEditModal(true); };

  const handleDelete = async (p) => {
    if (!window.confirm(`"${p.name}" ডিলিট করবেন?`)) return;
    setLoadingId(p.id);
    try {
      await posDamageProductAPI.delete(p.id);
      setSuccessMessage(`${p.name} deleted successfully!`);
      setShowSuccess(true);
      if (onUpdate) onUpdate();
    } catch {
      alert("Failed to delete product.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdateSuccess = () => {
    setShowEditModal(false);
    setSuccessMessage("Product updated successfully!");
    setShowSuccess(true);
    if (onUpdate) onUpdate();
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4"><span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Product</span></div>
            <div className="col-span-2"><span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Category</span></div>
            <div className="col-span-2"><span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Price</span></div>
            <div className="col-span-2"><span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Stock</span></div>
            <div className="col-span-2 text-right"><span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Actions</span></div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {products?.filter(Boolean).map((product) => (
            <div key={product.id} className="px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Product info */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                    <img
                      src={product.image || "https://via.placeholder.com/150?text=P"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=P"; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p onClick={() => handleViewDetails(product)} className="text-[13px] font-medium text-slate-800 hover:text-rose-500 cursor-pointer truncate transition-colors">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-slate-400">Code: {product.product_code}</p>
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-100">
                    {product.category_name || "N/A"}
                  </span>
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <p className="text-[12px] text-slate-700">৳{product.selling_price}</p>
                </div>

                {/* Stock */}
                <div className="col-span-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                    product.stock > 0
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}>
                    {product.stock > 0 ? `${product.stock} units` : "Out"}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button onClick={() => handleViewDetails(product)} title="View" className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button onClick={() => handleEdit(product)} title="Edit" disabled={loadingId === product.id} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(product)} title="Delete" disabled={loadingId === product.id} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    {loadingId === product.id ? <LoadingSpinner size="xs"/> : (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {(!products || products.length === 0) && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <p className="text-[13px] font-medium text-slate-700">No damage products found</p>
            </div>
          )}
        </div>
      </div>

      {showEditModal && selectedProduct && (
        <UpdateDamageProductModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedProduct(null); }}
          onSuccess={handleUpdateSuccess}
          productData={selectedProduct}
        />
      )}
      {showSuccess && (
        <SuccessPopup message={successMessage} onClose={() => setShowSuccess(false)} duration={3000} />
      )}
    </>
  );
};

export default DamageProductList;
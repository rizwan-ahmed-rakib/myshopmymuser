// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from '../../../context_or_provider/pos/posApi';
// 
// import SuccessPopup from "./SuccessPopup";
// import UpdateProductModal from "./UpdateProductModal";
// import { FaBoxOpen, FaDollarSign, FaShoppingCart, FaWarehouse, FaTag, FaInfoCircle } from 'react-icons/fa';

// const ProductDetailsPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");

//     const fetchProductDetails = useCallback(async () => {
//         try {
//             const response = await api.get(`/api/products/product/${id}/`);
//             setProduct(response.data);
//         } catch (error) {
//             console.error("Error fetching product details:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [id]);

//     useEffect(() => {
//         fetchProductDetails();
//     }, [fetchProductDetails]);

//     const handleEditProduct = () => {
//         setShowEditModal(true);
//     };

//     const handleUpdateSuccess = (updatedData) => {
//         setProduct(prev => ({ ...prev, ...updatedData }));
//         setShowEditModal(false);
//         setSuccessMessage("Product has been updated successfully!");
//         setShowSuccessPopup(true);
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                     <p className="mt-4 text-gray-700">Loading product details...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!product) {
//         return (
//             <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//                 <div className="text-center p-8 bg-white rounded-lg shadow-md">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
//                     <button
//                         onClick={() => navigate("/inventoryProducts")}
//                         // onClick={() => navigate("/inventory/units")}
//                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                         Back to Product List
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     const InfoCard = ({ icon, title, value, className = "" }) => (
//         <div className={`bg-white rounded-lg p-4 shadow-sm flex items-center ${className}`}>
//             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
//                 {icon}
//             </div>
//             <div>
//                 <p className="text-sm text-gray-600">{title}</p>
//                 <p className="font-semibold text-lg text-gray-900">{value}</p>
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//                 <div className="mb-6">
//                     <button
//                         onClick={() => navigate("/inventoryProducts")}
//                         // onClick={() => navigate("/inventory/units")}
//                         className="flex items-center text-gray-600 hover:text-blue-700 mb-4 font-medium"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                         </svg>
//                         Back to Product List
//                     </button>
//                 </div>

//                 <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//                     <div className="p-8">
//                         <div className="flex flex-col md:flex-row gap-8">
//                             {/* Product Image */}
//                             <div className="md:w-1/3">
//                                 <div className="w-full h-80 rounded-lg bg-gray-200 shadow-inner flex items-center justify-center">
//                                     <img
//                                         src={product.image || "https://via.placeholder.com/300"}
//                                         alt={product.name}
//                                         className="w-full h-full object-cover rounded-lg"
//                                         onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }}
//                                     />
//                                 </div>
//                             </div>

//                             {/* Product Info */}
//                             <div className="md:w-2/3">
//                                 <div className="flex justify-between items-start">
//                                     <div>
//                                         <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
//                                         <p className="text-gray-500 mt-2">Product Code: {product.product_code}</p>
//                                     </div>
//                                     <button
//                                         onClick={handleEditProduct}
//                                         className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
//                                     >
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                             <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                                         </svg>
//                                         Edit
//                                     </button>
//                                 </div>
                                
//                                 <div className="mt-6 border-t pt-6">
//                                     <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Details</h2>
//                                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
//                                         <InfoCard icon={<FaShoppingCart className="text-blue-500" />} title="Selling Price" value={`৳${product.selling_price}`} />
//                                         <InfoCard icon={<FaDollarSign className="text-green-500" />} title="Purchase Price" value={`৳${product.purchase_price}`} />
//                                         <InfoCard icon={<FaWarehouse className="text-purple-500" />} title="Stock" value={product.stock} />
//                                         <InfoCard icon={<FaBoxOpen className="text-yellow-500" />} title="Unit ID" value={product.unit || 'N/A'} />
//                                         <InfoCard icon={<FaTag className="text-red-500" />} title="Brand ID" value={product.brand || 'N/A'} />
//                                         <InfoCard icon={<FaInfoCircle className="text-indigo-500" />} title="Category ID" value={product.category || 'N/A'} />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {showEditModal && (
//                 <UpdateProductModal
//                     isOpen={showEditModal}
//                     onClose={() => setShowEditModal(false)}
//                     onSuccess={handleUpdateSuccess}
//                     productData={product}
//                 />
//             )}

//             {showSuccessPopup && (
//                 <SuccessPopup
//                     message={successMessage}
//                     onClose={() => setShowSuccessPopup(false)}
//                 />
//             )}
//         </div>
//     );
// };

// export default ProductDetailsPage;






















import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../../context_or_provider/pos/posApi';

import SuccessPopup from "./SuccessPopup";
import UpdateProductModal from "./UpdateProductModal";
import LoadingSpinner from "./LoadingSpinner";

const InfoCard = ({ icon, label, value, accent = "indigo" }) => {
  const accents = {
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-500",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-500",
    violet: "bg-violet-50 border-violet-100 text-violet-500",
    amber: "bg-amber-50 border-amber-100 text-amber-500",
    rose: "bg-rose-50 border-rose-100 text-rose-500",
    blue: "bg-blue-50 border-blue-100 text-blue-500",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${accents[accent]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-[14px] font-semibold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchProductDetails = useCallback(async () => {
    try {
      const response = await api.get(`/api/products/product/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProductDetails(); }, [fetchProductDetails]);

  const handleUpdateSuccess = (updatedData) => {
    setProduct(prev => ({ ...prev, ...updatedData }));
    setShowEditModal(false);
    setSuccessMessage("Product has been updated successfully!");
    setShowSuccessPopup(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <LoadingSpinner size="lg" className="text-indigo-500" />
        <p className="text-[13px] text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
          </div>
          <h2 className="text-[16px] font-semibold text-slate-800 mb-1">Product Not Found</h2>
          <p className="text-[12px] text-slate-500 mb-4">This product may have been deleted or moved.</p>
          <button onClick={() => navigate("/inventoryProducts")} className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] font-medium rounded-lg transition-colors">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isCritical = !isOutOfStock && Number(product.stock) <= Number(product.alarm_when_stock_is_lessthanOrEqualto) * 0.2;
  const isLow = !isOutOfStock && !isCritical && Number(product.stock) <= Number(product.alarm_when_stock_is_lessthanOrEqualto);

  const stockBadge = isOutOfStock
    ? { label: "Out of Stock", cls: "bg-slate-100 text-slate-600 border-slate-200" }
    : isCritical
    ? { label: "Critical Stock", cls: "bg-rose-50 text-rose-700 border-rose-200" }
    : isLow
    ? { label: "Low Stock", cls: "bg-amber-50 text-amber-700 border-amber-200" }
    : { label: "In Stock", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate("/inventoryProducts")}
          className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-indigo-600 mb-5 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Products
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">

              {/* Image */}
              <div className="md:w-1/3 shrink-0">
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={product.image || "https://via.placeholder.com/400?text=No+Image"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=No+Image"; }}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <h1 className="text-[22px] font-bold text-slate-900 leading-tight truncate">{product.name}</h1>
                    <p className="text-[12px] text-slate-400 mt-1">Code: {product.product_code}</p>
                    <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-2 ${stockBadge.cls}`}>
                      {stockBadge.label}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-medium rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Product Details</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <InfoCard
                      icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 8v4l3 3"/></svg>}
                      label="Selling Price" value={`৳${product.selling_price}`} accent="indigo"
                    />
                    <InfoCard
                      icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
                      label="Purchase Price" value={`৳${product.purchase_price}`} accent="emerald"
                    />
                    <InfoCard
                      icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/></svg>}
                      label="Stock" value={`${product.stock} units`} accent="violet"
                    />
                    <InfoCard
                      icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>}
                      label="Unit ID" value={product.unit || "N/A"} accent="amber"
                    />
                    <InfoCard
                      icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>}
                      label="Brand ID" value={product.brand || "N/A"} accent="rose"
                    />
                    <InfoCard
                      icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
                      label="Category ID" value={product.category || "N/A"} accent="blue"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <UpdateProductModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleUpdateSuccess}
          productData={product}
        />
      )}
      {showSuccessPopup && (
        <SuccessPopup message={successMessage} onClose={() => setShowSuccessPopup(false)} />
      )}
    </div>
  );
};

export default ProductDetailsPage;
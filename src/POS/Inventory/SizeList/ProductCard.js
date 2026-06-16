// import React, {useState, useRef, useEffect} from "react";
// import {useNavigate} from "react-router-dom";
// import UpdateSizeModal from "./UpdateSizeModal";
// import SuccessPopup from "./SuccessPopup";
// import {posSizeAPI} from "../../../context_or_provider/pos/sizes/sizeAPI";

// const ProductCard = ({product, onEdit, onDelete}) => {
//     const navigate = useNavigate();
//     const [selectedProduct, setSelectedProduct] = useState(null);
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

//     const handleNameClick = () => {
//         navigate(`/inventory/size/details/${product.id}`);
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
//             await posSizeAPI.delete(product.id); // Corrected API object
//             setSuccessMessage(`${product.name} deleted successfully!`);
//             setShowSuccess(true);

//             if (onDelete) {
//                 onDelete();
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

//         if (onEdit) {
//             onEdit();
//         }
//     };

//     const formatPrice = (price) => {
//         return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
//     }

//     return (
//         <>
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
//                 <div className="relative">
//                     <img
//                         src={product.image || "https://m.sizeofficial.nl/skins/sizev1-mobile/public/img/logos/logo.png"}
//                         className="w-full h-48 object-cover"
//                         alt={product.name}
//                         onError={(e) => { e.target.src = "https://via.placeholder.com/400x300"; }}
//                     />
//                     <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
//                         {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
//                     </div>
//                 </div>

//                 <div className="p-4">
//                     <div className="flex justify-between items-start mb-2">
//                         <div className="text-xs text-gray-500">Code: {product.product_code}</div>
                        
//                         <div className="relative" ref={dropdownRef}>
//                             <button
//                                 onClick={() => setShowDropdown(!showDropdown)}
//                                 className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
//                             >
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                             d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
//                                 </svg>
//                             </button>

//                             {showDropdown && (
//                                 <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
//                                     <button
//                                         onClick={() => handleEdit(product)}
//                                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                                         disabled={loadingId === product.id}
//                                     >
//                                         Edit Product
//                                     </button>
//                                     <button
//                                         onClick={() => handleDelete(product)}
//                                         className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
//                                         disabled={loadingId === product.id}
//                                     >
//                                         Delete Product
//                                     </button>
//                                     <div className="border-t border-gray-100 my-1"></div>
//                                     <button
//                                         onClick={handleNameClick}
//                                         className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
//                                     >
//                                         View Details
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <h3
//                         onClick={handleNameClick}
//                         className="font-semibold text-lg text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer truncate"
//                     >
//                         {product.title}
//                     </h3>

//                     <div className="flex justify-between items-center">
//                         <div className="text-xl font-bold text-gray-800">
//                             {formatPrice(product.selling_price)}
//                         </div>
//                         <div className="text-sm text-gray-500 line-through">
//                             {formatPrice(product.purchase_price)}
//                         </div>
//                     </div>

//                     <div className="mt-2 text-xs text-gray-500">
//                         Category: {product.category} | Brand: {product.brand}
//                     </div>
//                 </div>
//             </div>

//             {showEditModal && selectedProduct && (
//                 <UpdateSizeModal
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

// export default ProductCard;



















import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UpdateSizeModal from "./UpdateSizeModal";
import SuccessPopup from "./SuccessPopup";
import { posSizeAPI } from "../../../context_or_provider/pos/sizes/sizeAPI";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const handleNameClick = () => navigate(`/inventory/size/details/${product.id}`);

  const handleEdit = (p) => { setSelectedProduct(p); setShowEditModal(true); setShowDropdown(false); };

  const handleDelete = async (p) => {
    if (!window.confirm(`"${p.title || p.name}" ডিলিট করবেন?`)) return;
    setLoadingId(p.id);
    try {
      await posSizeAPI.delete(p.id);
      setSuccessMessage(`${p.title || p.name} deleted successfully!`);
      setShowSuccess(true);
      if (onDelete) onDelete();
    } catch {
      alert("Failed to delete size.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdateSuccess = () => {
    setShowEditModal(false);
    setSuccessMessage("Size updated successfully!");
    setShowSuccess(true);
    if (onEdit) onEdit();
  };

  const isOutOfStock = Number(product.stock) === 0;

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 overflow-hidden group">

        {/* Image */}
        <div className="relative h-44 bg-slate-50 overflow-hidden">
          <img
            src={product.image || "https://via.placeholder.com/400x300?text=Size"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            alt={product.title || product.name}
            onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Size"; }}
          />
          {/* Stock badge */}
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${isOutOfStock ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}>
            {isOutOfStock ? "Out of Stock" : `In Stock (${product.stock})`}
          </span>

          {/* 3-dot menu */}
          <div className="absolute top-2.5 right-2.5" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-sm transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-10">
                <button onClick={() => handleEdit(product)} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[12px] text-slate-700 hover:bg-slate-50">
                  <svg className="w-3.5 h-3.5 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Size
                </button>
                <button onClick={() => { handleNameClick(); setShowDropdown(false); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[12px] text-slate-700 hover:bg-slate-50">
                  <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  View Details
                </button>
                <div className="my-1 border-t border-slate-100"/>
                <button onClick={() => handleDelete(product)} disabled={loadingId === product.id} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[12px] text-rose-600 hover:bg-rose-50">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5">
          <p className="text-[10px] text-slate-400 mb-1">Code: {product.product_code || "—"}</p>
          <h3 onClick={handleNameClick} className="text-[14px] font-semibold text-slate-800 hover:text-teal-600 cursor-pointer truncate transition-colors leading-tight mb-2">
            {product.title || product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-800">৳{product.selling_price}</span>
            <span className="text-[11px] text-slate-400 line-through">৳{product.purchase_price}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Cat: {product.category} · Brand: {product.brand}</p>
        </div>
      </div>

      {showEditModal && selectedProduct && (
        <UpdateSizeModal
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

export default ProductCard;
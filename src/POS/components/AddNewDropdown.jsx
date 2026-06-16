// import React, { useState } from "react";
// import { usePosCategory } from "../../context_or_provider/pos/categories/CategoryProvider";
//
// // 🔹 Modals
// import AddCategoryModal from "../Inventory/CategoryList/AddCategoryModal";
// import AddSubCategoryModal from "../Inventory/SubcategoryList/AddSubCategoryModal";
// import AddProductModal from "../Inventory/ProductList/AddProductModal";
// import AddBrandModal from "../Inventory/BrandList/AddBrandModal";
// import AddSizeModal from "../Inventory/SizeList/AddSizeModal";
// import AddUnitModal from "../Inventory/UnitList/AddUnitModal";
// import AddSupplierModal from "../Purchase/SupplierList/AddSupplierModal";
// import AddPurchaseModal from "../Purchase/PurchaseProduct/AddPurchaseModal";
// import AddPurchaseReturnModal from "../Purchase/PurchaseReturn/AddPurchaseReturnModal";
// import AddCustomerModal from "../Sales/CustomerList/AddCustomerModal";
// import AddSaleModal from "../Sales/SaleProduct/AddSaleModal";
// import AddSaleReturnModal from "../Sales/SaleReturn/AddSaleReturnModal";
// import SuccessModal from "./SuccessModal";
//
// const items = [
//     { name: "Category", icon: "📦", key: "category" },
//     { name: "Sub Category", icon: "🗂️", key: "subcategory" },
//     { name: "Product", icon: "➕", key: "product" },
//     { name: "Brand", icon: "🏷️", key: "brand" },
//     { name: "Size", icon: "📏", key: "size" },
//     { name: "Unit", icon: "⚖️", key: "unit" },
//     { name: "Supplier", icon: "✅", key: "supplier" },
//     { name: "Purchase", icon: "🛍️", key: "purchase" },
//     { name: "Purchase Return", icon: "↩️", key: "purchaseReturn" },
//     { name: "Customer", icon: "👥", key: "customer" },
//     { name: "Sale", icon: "🛒", key: "sale" },
//     { name: "Sale Return", icon: "📑", key: "saleReturn" },
// ];
//
// const AddNewDropdown = ({ onClose }) => {
//     const { setSuccessData } = usePosCategory();
//
//     const [activeModal, setActiveModal] = useState(null);
//     const [showSuccessModal, setShowSuccessModal] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");
//     const [createdData, setCreatedData] = useState(null);
//     const [successModalKey, setSuccessModalKey] = useState(null);
//
//     // 🔥 পরিবর্তন এখানে: মডাল ক্লোজ হলে শুধু মডাল স্টেট নাল হবে, মেইন ড্রপডাউন বন্ধ হবে না
//     const closeAll = () => {
//         setActiveModal(null);
//     };
//
//     const handleSuccess = (data, modalKey = activeModal) => {
//         setSuccessData(data);
//         const item = items.find(i => i.key === modalKey);
//         setSuccessMessage(`${item?.name || 'Item'} has been added successfully!`);
//         setCreatedData(data);
//         setSuccessModalKey(modalKey);
//         setActiveModal(null);
//         setShowSuccessModal(true);
//     };
//
//     // 🔥 পরিবর্তন এখানে: সাকসেস মডাল ক্লোজ হলেও মেইন ড্রপডাউনটি ব্যাকগ্রাউন্ডে অন-ই থাকবে
//     const closeSuccessModal = () => {
//         setShowSuccessModal(false);
//         setSuccessModalKey(null);
//     };
//
//     return (
//         <>
//             {/* Dropdown Layout - Z-index এবং রেসপনসিভ পজিশন পারফেক্ট করা হয়েছে */}
//             <div className="absolute right-0 top-full mt-2 z-50 w-screen max-w-[calc(100vw-2rem)] sm:w-[540px] md:w-[560px] rounded-xl bg-white border border-gray-200 shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
//                 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
//                     {items.map((item) => (
//                         <button
//                             key={item.key}
//                             onClick={() => setActiveModal(item.key)}
//                             className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 active:scale-95 group shadow-sm bg-white"
//                         >
//                             <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
//                                 {item.icon}
//                             </span>
//                             <p className="mt-1.5 text-xs font-semibold text-gray-600 text-center leading-tight whitespace-normal break-words w-full">
//                                 {item.name}
//                             </p>
//                         </button>
//                     ))}
//                 </div>
//             </div>
//
//             {/* Inventory Modals */}
//             <AddCategoryModal
//                 isOpen={activeModal === "category"}
//                 onClose={closeAll}
//                 onSuccess={(data) => handleSuccess(data, "category")}
//             />
//
//             <AddSubCategoryModal
//                 isOpen={activeModal === "subcategory"}
//                 onClose={closeAll}
//                 onSuccess={(data) => handleSuccess(data, "subcategory")}
//             />
//
//             <AddProductModal
//                 isOpen={activeModal === "product"}
//                 onClose={closeAll}
//                 onSuccess={(data) => handleSuccess(data, "product")}
//             />
//
//             <AddBrandModal
//                 isOpen={activeModal === "brand"}
//                 onClose={closeAll}
//                 onSuccess={(data) => handleSuccess(data, "brand")}
//             />
//
//             <AddSizeModal
//                 isOpen={activeModal === "size"}
//                 onClose={closeAll}
//                 onSuccess={(data) => handleSuccess(data, "size")}
//             />
//
//             <AddUnitModal
//                 isOpen={activeModal === "unit"}
//                 onClose={closeAll}
//                 onSuccess={(data) => handleSuccess(data, "unit")}
//             />
//
//             {/* Purchase Modals */}
//             <AddSupplierModal
//                 isOpen={activeModal === "supplier"}
//                 onClose={closeAll}
//                 onSuccess={(data) => handleSuccess(data, "supplier")}
//             />
//
//             <AddPurchaseModal
//                 isOpen={activeModal === "purchase"}
//                 onClose={closeAll}
//                 onSuccess={(data) => handleSuccess(data, "purchase")}
//             />
//
//             <AddPurchaseReturnModal
//                 isOpen={activeModal === "purchaseReturn"}
//                 onClose={closeAll}
//                 onSuccess={(data) => handleSuccess(data, "purchaseReturn")}
//             />
//
//             {/* Sales Modals */}
//             <AddCustomerModal
//                 isOpen={activeModal === "customer"}
//                 onClose={closeAll}
//                 onSuccess={(data) => handleSuccess(data, "customer")}
//             />
//
//             <AddSaleModal
//                 isOpen={activeModal === "sale"}
//                 onClose={closeAll}
//                 onSuccess={(data) => handleSuccess(data, "sale")}
//             />
//
//             <AddSaleReturnModal
//                 isOpen={activeModal === "saleReturn"}
//                 onClose={closeAll}
//                 onSuccess={(data) => handleSuccess(data, "saleReturn")}
//             />
//
//             {/* Feedback Modal */}
//             <SuccessModal
//                 isOpen={showSuccessModal}
//                 onClose={closeSuccessModal}
//                 title="Success!"
//                 message={successMessage}
//                 data={createdData}
//                 modalKey={successModalKey}
//             />
//         </>
//     );
// };
//
// export default AddNewDropdown;



import React, { useState } from "react";
import { usePosCategory } from "../../context_or_provider/pos/categories/CategoryProvider";

// 🔹 Modals
import AddCategoryModal from "../Inventory/CategoryList/AddCategoryModal";
import AddSubCategoryModal from "../Inventory/SubcategoryList/AddSubCategoryModal";
import AddProductModal from "../Inventory/ProductList/AddProductModal";
import AddBrandModal from "../Inventory/BrandList/AddBrandModal";
import AddSizeModal from "../Inventory/SizeList/AddSizeModal";
import AddUnitModal from "../Inventory/UnitList/AddUnitModal";
import AddSupplierModal from "../Purchase/SupplierList/AddSupplierModal";
import AddPurchaseModal from "../Purchase/PurchaseProduct/AddPurchaseModal";
import AddPurchaseReturnModal from "../Purchase/PurchaseReturn/AddPurchaseReturnModal";
import AddCustomerModal from "../Sales/CustomerList/AddCustomerModal";
import AddSaleModal from "../Sales/SaleProduct/AddSaleModal";
import AddSaleReturnModal from "../Sales/SaleReturn/AddSaleReturnModal";
import SuccessModal from "./SuccessModal";

const items = [
    { name: "Category", icon: "📦", key: "category" },
    { name: "Sub Category", icon: "🗂️", key: "subcategory" },
    { name: "Product", icon: "➕", key: "product" },
    { name: "Brand", icon: "🏷️", key: "brand" },
    { name: "Size", icon: "📏", key: "size" },
    { name: "Unit", icon: "⚖️", key: "unit" },
    { name: "Supplier", icon: "✅", key: "supplier" },
    { name: "Purchase", icon: "🛍️", key: "purchase" },
    { name: "Purchase Return", icon: "↩️", key: "purchaseReturn" },
    { name: "Customer", icon: "👥", key: "customer" },
    { name: "Sale", icon: "🛒", key: "sale" },
    { name: "Sale Return", icon: "📑", key: "saleReturn" },
];

const AddNewDropdown = ({ onClose }) => {
    const { setSuccessData } = usePosCategory();

    const [activeModal, setActiveModal] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [createdData, setCreatedData] = useState(null);
    const [successModalKey, setSuccessModalKey] = useState(null);

    const closeAll = () => {
        setActiveModal(null);
    };

    const handleSuccess = (data, modalKey = activeModal) => {
        setSuccessData(data);
        const item = items.find(i => i.key === modalKey);
        setSuccessMessage(`${item?.name || 'Item'} has been added successfully!`);
        setCreatedData(data);
        setSuccessModalKey(modalKey);
        setActiveModal(null);
        setShowSuccessModal(true);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setSuccessModalKey(null);
    };

    return (
        <>
            {/* --- RESPONSIVE DROPDOWN CARD --- */}
            {/* মোবাইলে এটি স্ক্রিনের মাঝখানে ফিক্সড থাকবে (fixed left-1/2 -translate-x-1/2) এবং sm স্ক্রিন থেকে absolute ড্রপডাউন হবে */}
            <div className="
                fixed sm:absolute
                left-1/2 sm:left-auto sm:right-0
                top-[70px] sm:top-full
                -translate-x-1/2 sm:translate-x-0
                mt-2 z-50
                w-[92vw] sm:w-[480px] md:w-[560px]
                rounded-xl bg-white border border-gray-200 shadow-2xl p-4
                animate-in fade-in zoom-in-95 duration-150
            ">
                {/* Grid Layout System:
                  - অতি ক্ষুদ্র মোবাইল স্ক্রিনে (যেমন iPhone SE): grid-cols-3 (৩ কলাম)
                  - সাধারণ বড় মোবাইল বা ট্যাবলেটে: grid-cols-4 (৪ কলাম)
                  - ডেস্কটপ বা ল্যাপটপে: md:grid-cols-6 (৬ কলাম)
                */}
                <div className="grid grid-cols-3 xs:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3">
                    {items.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveModal(item.key)}
                            className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 transition-all duration-200 active:scale-95 group shadow-sm bg-slate-50/30"
                        >
                            <span className="text-xl sm:text-2xl transition-transform duration-200 group-hover:scale-110">
                                {item.icon}
                            </span>
                            <p className="mt-1.5 text-[10px] sm:text-xs font-semibold text-gray-600 text-center leading-tight whitespace-normal break-words w-full group-hover:text-indigo-600">
                                {item.name}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Inventory Modals */}
            <AddCategoryModal
                isOpen={activeModal === "category"}
                onClose={closeAll}
                onSuccess={(data) => handleSuccess(data, "category")}
            />

            <AddSubCategoryModal
                isOpen={activeModal === "subcategory"}
                onClose={closeAll}
                onSuccess={(data) => handleSuccess(data, "subcategory")}
            />

            <AddProductModal
                isOpen={activeModal === "product"}
                onClose={closeAll}
                onSuccess={(data) => handleSuccess(data, "product")}
            />

            <AddBrandModal
                isOpen={activeModal === "brand"}
                onClose={closeAll}
                onSuccess={(data) => handleSuccess(data, "brand")}
            />

            <AddSizeModal
                isOpen={activeModal === "size"}
                onClose={closeAll}
                onSuccess={(data) => handleSuccess(data, "size")}
            />

            <AddUnitModal
                isOpen={activeModal === "unit"}
                onClose={closeAll}
                onSuccess={(data) => handleSuccess(data, "unit")}
            />

            {/* Purchase Modals */}
            <AddSupplierModal
                isOpen={activeModal === "supplier"}
                onClose={closeAll}
                onSuccess={(data) => handleSuccess(data, "supplier")}
            />

            <AddPurchaseModal
                isOpen={activeModal === "purchase"}
                onClose={closeAll}
                onSuccess={(data) => handleSuccess(data, "purchase")}
            />

            <AddPurchaseReturnModal
                isOpen={activeModal === "purchaseReturn"}
                onClose={closeAll}
                onSuccess={(data) => handleSuccess(data, "purchaseReturn")}
            />

            {/* Sales Modals */}
            <AddCustomerModal
                isOpen={activeModal === "customer"}
                onClose={closeAll}
                onSuccess={(data) => handleSuccess(data, "customer")}
            />

            <AddSaleModal
                isOpen={activeModal === "sale"}
                onClose={closeAll}
                onSuccess={(data) => handleSuccess(data, "sale")}
            />

            <AddSaleReturnModal
                isOpen={activeModal === "saleReturn"}
                onClose={closeAll}
                onSuccess={(data) => handleSuccess(data, "saleReturn")}
            />

            {/* Feedback Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={closeSuccessModal}
                title="Success!"
                message={successMessage}
                data={createdData}
                modalKey={successModalKey}
            />
        </>
    );
};

export default AddNewDropdown;
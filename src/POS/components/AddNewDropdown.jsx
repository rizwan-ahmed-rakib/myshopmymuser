import React, {useState} from "react";
import {usePosCategory} from "../../context_or_provider/pos/categories/CategoryProvider";

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
    {name: "Category", icon: "📦", key: "category"},
    {name: "Sub Category", icon: "🗂️", key: "subcategory"},
    {name: "Product", icon: "➕", key: "product"},
    {name: "Brand", icon: "🏷️", key: "brand"},
    {name: "Size", icon: "📏", key: "size"},
    {name: "Unit", icon: "⚖️", key: "unit"},
    {name: "Supplier", icon: "✅", key: "supplier"},
    {name: "Purchase", icon: "🛍️", key: "purchase"},
    {name: "Purchase Return", icon: "↩️", key: "purchaseReturn"},
    {name: "Customer", icon: "👥", key: "customer"},
    {name: "Sale", icon: "🛒", key: "sale"},
    {name: "Sale Return", icon: "📑", key: "saleReturn"},
];

const AddNewDropdown = ({onClose}) => {
    const {setSuccessData} = usePosCategory();

    const [activeModal, setActiveModal] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [createdData, setCreatedData] = useState(null);
    const [successModalKey, setSuccessModalKey] = useState(null);

    const closeAll = () => {
        setActiveModal(null);
        onClose?.();
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
        onClose?.();
    }

    return (
        <>
            {/* Dropdown */}
            <div className="absolute right-0 top-14 z-40 w-[560px] rounded-xl bg-white border shadow-xl p-4">
                <div className="grid grid-cols-6 gap-4">
                    {items.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveModal(item.key)}
                            className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition"
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <p className="mt-1 text-sm font-medium text-gray-700">
                                {item.name}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Inventory */}
            <AddCategoryModal
                isOpen={activeModal === "category"}
                onClose={() => setActiveModal(null)}
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

            {/* Purchase */}
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

            {/* Sales */}
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




////////////////////////////////////////////////////////////

// import React from "react";
// import { Link } from "react-router-dom";
// import AddProductModal from "../Inventory/ProductList/AddProductModal";
// import AddSizeModal from "../Inventory/SizeList/AddSizeModal";
// import AddBrandModal from "../Inventory/BrandList/AddBrandModal";
// import AddCategoryModal from "../Inventory/CategoryList/AddCategoryModal";
// import AddSubCategoryModal from "../Inventory/SubcategoryList/AddSubCategoryModal";
// import AddUnitModal from "../Inventory/UnitList/AddUnitModal";
// import AddSupplierModal from "../Purchase/SupplierList/AddSupplierModal";
// import AddPurchaseModal from "../Purchase/PurchaseProduct/AddPurchaseModal"
// import AddPurchaseReturnModal from "../Purchase/PurchaseReturn/AddPurchaseReturnModal";
// import AddCustomerModal from "../Sales/CustomerList/AddCustomerModal";
// import AddSaleModal from "../Sales/SaleProduct/AddSaleModal";
// import AddSaleReturnModal from "../Sales/SaleReturn/AddSaleReturnModal";
//
// const items = [
//   { name: "Category", icon: "📦", to: "/categories" },
//   { name: "Product", icon: "➕", to: "/products/add" },
//   { name: "Purchase", icon: "🛍️", to: "/purchase" },
//   { name: "Sale", icon: "🛒", to: "/sales" },
//   { name: "Expense", icon: "📄", to: "/expenses" },
//   { name: "Quotation", icon: "💾", to: "/quotations" },
//   { name: "Return", icon: "📑", to: "/returns" },
//   { name: "User", icon: "👤", to: "/users" },
//   { name: "Customer", icon: "👥", to: "/customers" },
//   { name: "Biller", icon: "🛡️", to: "/billers" },
//   { name: "Supplier", icon: "✅", to: "/suppliers" },
//   { name: "Transfer", icon: "🚚", to: "/stock-transfer" },
// ];
//
//
//
// const AddNewDropdown = () => {
//   return (
//     <div className="absolute right-0 top-14 z-50 w-[520px] rounded-xl bg-white shadow-xl border p-4">
//       <div className="grid grid-cols-6 gap-4">
//         {items.map((item) => (
//           <Link
//             key={item.name}
//             to={item.to}
//             className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-gray-100 transition"
//           >
//             <span className="text-2xl">{item.icon}</span>
//             <p className="mt-1 text-sm font-medium text-gray-700">
//               {item.name}
//             </p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };
//
// export default AddNewDropdown;

////////////////////  single scratch ///////////////////

// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   Layers,
//   PlusSquare,
//   ShoppingBag,
//   ShoppingCart,
//   FileText,
//   Save,
//   Copy,
//   User,
//   Users,
//   Shield,
//   UserCheck,
//   Truck
// } from "lucide-react";
//
// const items = [
//   { name: "Category", icon: Layers, to: "/categories" },
//   { name: "Product", icon: PlusSquare, to: "/products/add" },
//   { name: "Purchase", icon: ShoppingBag, to: "/purchase" },
//   { name: "Sale", icon: ShoppingCart, to: "/sales" },
//   { name: "Expense", icon: FileText, to: "/expenses" },
//   { name: "Quotation", icon: Save, to: "/quotations" },
//   { name: "Return", icon: Copy, to: "/returns" },
//   { name: "User", icon: User, to: "/users" },
//   { name: "Customer", icon: Users, to: "/customers" },
//   { name: "Biller", icon: Shield, to: "/billers" },
//   { name: "Supplier", icon: UserCheck, to: "/suppliers" },
//   { name: "Transfer", icon: Truck, to: "/stock-transfer" },
// ];
//
// const AddNewDropdown = ({ onClose }) => {
//   return (
//     <div className="absolute right-0 top-14 z-50 w-[540px] rounded-xl bg-white border shadow-2xl p-4">
//       <div className="grid grid-cols-6 gap-4">
//         {items.map(({ name, icon: Icon, to }) => (
//           <Link
//             key={name}
//             to={to}
//             onClick={onClose}
//             className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-gray-100 transition"
//           >
//             <span className="p-2 rounded-md bg-blue-50 text-blue-600">
//               <Icon size={20} />
//             </span>
//             <p className="mt-2 text-sm font-medium text-gray-700">
//               {name}
//             </p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };
//
// export default AddNewDropdown;

///////////////////////////////////////
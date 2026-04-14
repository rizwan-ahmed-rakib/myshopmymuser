import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import UpdateDamageStockModal from "./UpdateDamageStockModal";
import SuccessPopup from "./SuccessPopup";
import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";

const DamageStockCard = ({record, onEdit, onDelete}) => {
    const navigate = useNavigate();
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [loadingId, setLoadingId] = useState(null);

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDetailsClick = () => {
        navigate(`/inventory/damage-stock/details/${record.id}`);
    };

    const handleEdit = () => {
        setSelectedRecord(record);
        setShowEditModal(true);
        setShowDropdown(false);
    };

    const handleDelete = async () => {
        if (!window.confirm(`আপনি কি ${record.product_name} ড্যামেজ রেকর্ডটি ডিলিট করতে চান?`)) {
            return;
        }

        setLoadingId(record.id);
        try {
            await posDamageProductAPI.delete(record.id);
            setSuccessMessage(`${record.product_name} ড্যামেজ রেকর্ড সফলভাবে ডিলিট করা হয়েছে!`);
            setShowSuccess(true);
            setShowDropdown(false);

            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("রেকর্ড ডিলিট করতে সমস্যা হয়েছে।");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = (updatedData) => {
        setShowEditModal(false);
        setSuccessMessage("রেকর্ড সফলভাবে আপডেট করা হয়েছে!");
        setShowSuccess(true);

        if (onEdit) {
            onEdit();
        }
    };

    const formatMoney = (value) => {
        return new Intl.NumberFormat('bn-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    const getDamageTypeBadge = (type) => {
        if (type === 'returnable') {
            return <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">রিটার্নযোগ্য</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">নন-রিটার্নযোগ্য</span>;
        }
    }

    const getCompensationBadge = (isCompensated) => {
        if (isCompensated) {
            return <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">ক্ষতিপূরণ দেওয়া হয়েছে</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-100 rounded-full">ক্ষতিপূরণ বাকি</span>;
        }
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="relative h-32 bg-gradient-to-r from-red-50 to-orange-50 p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3
                                onClick={handleDetailsClick}
                                className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                                {record.product_name}
                            </h3>
                            <p className="text-xs text-gray-500">কোড: {record.product_code}</p>
                        </div>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                disabled={loadingId === record.id}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                                </svg>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        disabled={loadingId === record.id}
                                    >
                                        এডিট করুন
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                        disabled={loadingId === record.id}
                                    >
                                        ডিলিট করুন
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={handleDetailsClick}
                                        className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
                                    >
                                        বিস্তারিত দেখুন
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {getDamageTypeBadge(record.damage_type)}
                        {getCompensationBadge(record.is_compensated)}
                    </div>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <p className="text-xs text-gray-500">পরিমাণ</p>
                            <p className="font-bold text-lg text-gray-900">{record.quantity} পিস</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">ইউনিট খরচ</p>
                            <p className="font-semibold text-gray-700">{formatMoney(record.unit_cost)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">মোট ক্ষতি</p>
                            <p className="font-semibold text-red-600">{formatMoney(record.total_loss)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">তারিখ</p>
                            <p className="text-sm text-gray-600">{formatDate(record.created_at)}</p>
                        </div>
                    </div>

                    {record.reason && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">কারণ:</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{record.reason}</p>
                        </div>
                    )}

                    <div className="mt-3 text-xs text-gray-400">
                        সোর্স: {record.source_display}
                    </div>
                </div>
            </div>

            {showEditModal && selectedRecord && (
                <UpdateDamageStockModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedRecord(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                    recordData={selectedRecord}
                />
            )}

            {showSuccess && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                    duration={3000}
                />
            )}
        </>
    );
};

export default DamageStockCard;
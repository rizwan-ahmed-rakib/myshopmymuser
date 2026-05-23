import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UpdateDamageStockModal from './UpdateDamageStockModal';
import SuccessPopup from './SuccessPopup';
import { posDamageProductAPI } from '../../../context_or_provider/pos/damageProducts/damage_productAPI';

const DamageStockList = ({ records, onUpdate }) => {
    const navigate = useNavigate();
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [loadingId, setLoadingId] = useState(null);

    const handleEdit = (record) => {
        setSelectedRecord(record);
        setShowEditModal(true);
    };

    const handleDelete = async (record) => {
        if (!window.confirm(`আপনি কি ${record.product_name} ড্যামেজ রেকর্ডটি ডিলিট করতে চান?`)) {
            return;
        }

        setLoadingId(record.id);
        try {
            await posDamageProductAPI.delete(record.id);
            setSuccessMessage(`${record.product_name} ড্যামেজ রেকর্ড সফলভাবে ডিলিট করা হয়েছে!`);
            setShowSuccess(true);

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("রেকর্ড ডিলিট করতে সমস্যা হয়েছে।");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = () => {
        setShowEditModal(false);
        setSuccessMessage("রেকর্ড সফলভাবে আপডেট করা হয়েছে!");
        setShowSuccess(true);

        if (onUpdate) {
            onUpdate();
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
            return <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">দেওয়া হয়েছে</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-100 rounded-full">বাকি</span>;
        }
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">প্রোডাক্ট</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ধরণ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">পরিমাণ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ইউনিট খরচ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">মোট ক্ষতি</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ক্ষতিপূরণ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {records.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900">{record.product_name}</div>
                                        <div className="text-sm text-gray-500">কোড: {record.product_code}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {getDamageTypeBadge(record.damage_type)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-medium">{record.quantity}</span> পিস
                                </td>
                                <td className="px-6 py-4">
                                    {formatMoney(record.unit_cost)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-red-600">{formatMoney(record.total_loss)}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {getCompensationBadge(record.is_compensated)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {formatDate(record.created_at)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/inventory/damage-stock/details/${record.id}`)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="বিস্তারিত"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            onClick={() => handleEdit(record)}
                                            className="text-green-600 hover:text-green-800"
                                            title="এডিট"
                                            disabled={loadingId === record.id}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(record)}
                                            className="text-red-600 hover:text-red-800"
                                            title="ডিলিট"
                                            disabled={loadingId === record.id}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

export default DamageStockList;
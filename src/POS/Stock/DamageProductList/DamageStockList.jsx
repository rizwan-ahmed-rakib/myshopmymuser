import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessPopup from './SuccessPopup';
import { posDamageProductAPI } from '../../../context_or_provider/pos/damageProducts/damage_productAPI';
import { FaEye, FaEdit, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const DamageStockList = ({ records, onEdit, onUpdate }) => {
    const navigate = useNavigate();
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [loadingId, setLoadingId] = useState(null);

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete the damage record for ${record.product_name}?`)) {
            return;
        }

        setLoadingId(record.id);
        try {
            await posDamageProductAPI.delete(record.id);
            setShowDeleteSuccess(true);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Problem deleting the record.");
        } finally {
            setLoadingId(null);
        }
    };

    const formatMoney = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'BDT',
            minimumFractionDigits: 2, maximumFractionDigits: 2
        }).format(value).replace('BDT', '৳');
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    const getDamageTypeBadge = (type) => {
        if (type === 'returnable') {
            return <span className="px-3 py-1 text-xs font-bold text-yellow-700 bg-yellow-100 rounded-full border border-yellow-200">Returnable</span>;
        } else {
            return <span className="px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full border border-red-200">Non-Returnable</span>;
        }
    }

    const getCompensationBadge = (isCompensated) => {
        if (isCompensated) {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-green-700 bg-green-50 rounded-full border border-green-200">
                    <FaCheckCircle className="text-[10px]" /> Compensated
                </span>
            );
        } else {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-amber-700 bg-amber-50 rounded-full border border-amber-200">
                    <FaExclamationCircle className="text-[10px]" /> Pending
                </span>
            );
        }
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Info</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Loss Summary</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {records.map((record) => (
                            <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{record.product_name}</div>
                                        <div className="text-xs text-gray-400 font-mono">#{record.reference_no}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{getDamageTypeBadge(record.damage_type)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-gray-800">{record.quantity}</span>
                                        <span className="text-gray-400 text-xs uppercase font-medium">pcs</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <div className="text-sm font-bold text-red-600">{formatMoney(record.total_loss)}</div>
                                        <div className="text-[10px] text-gray-400">at {formatMoney(record.unit_cost)}/pc</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{getCompensationBadge(record.is_compensated)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(record.created_at)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => navigate(`/stock/details/${record.id}`)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"><FaEye /></button>
                                        <button onClick={() => onEdit(record)} className="p-2 text-amber-500 hover:bg-amber-100 rounded-lg transition-colors"><FaEdit /></button>
                                        <button onClick={() => handleDelete(record)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors" disabled={loadingId === record.id}><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showDeleteSuccess && (
                <SuccessPopup message="Damage record deleted successfully" type="success" onClose={() => setShowDeleteSuccess(false)} />
            )}
        </>
    );
};

export default DamageStockList;

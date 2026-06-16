import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackboneTable from '../../components/BackboneTable';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { posDamageProductAPI } from '../../../context_or_provider/pos/damageProducts/damage_productAPI';
import { Eye, Edit, Trash2, AlertTriangle, Calendar, Package, Wallet } from 'lucide-react';

/**
 * DamageStockList - Refactored to use BackboneTable and StatusBadge.
 * Standardized list view for Damage Stock records.
 */
const DamageStockList = ({ records, onEdit, onUpdate }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);

    const handleViewDetails = (record) => {
        navigate(`/stock/details/${record.id}`);
    };

    const handleDelete = async (record) => {
        if (!window.confirm(`Are you sure you want to delete the damage record for ${record.product_name}?`)) {
            return;
        }

        setLoadingId(record.id);
        try {
            await posDamageProductAPI.delete(record.id);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Problem deleting the record.");
        } finally {
            setLoadingId(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const columns = [
        {
            header: "Product & Ref",
            accessor: "product_name",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                        <AlertTriangle size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">{item.product_name}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">
                            #{item.reference_no}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Damage Type",
            accessor: "damage_type",
            className: "text-center",
            render: (item) => (
                <StatusBadge 
                    type={item.damage_type === 'returnable' ? 'warning' : 'danger'} 
                    label={item.damage_type?.replace('_', ' ')} 
                />
            )
        },
        {
            header: "Quantity",
            accessor: "quantity",
            className: "text-center",
            render: (item) => (
                <div className="flex items-center justify-center gap-1.5 font-bold text-gray-800">
                    <Package size={12} className="text-gray-400" />
                    <span>{item.quantity}</span>
                    <span className="text-[10px] text-gray-400 uppercase">pcs</span>
                </div>
            )
        },
        {
            header: "Loss Summary",
            accessor: "total_loss",
            render: (item) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-rose-600 font-black">
                        <Wallet size={12} />
                        <span>৳{parseFloat(item.total_loss).toLocaleString()}</span>
                    </div>
                    <span className="text-[9px] text-gray-400 uppercase font-bold">
                        Cost: ৳{parseFloat(item.unit_cost).toLocaleString()}/pc
                    </span>
                </div>
            )
        },
        {
            header: "Compensation",
            accessor: "is_compensated",
            className: "text-center",
            render: (item) => (
                <StatusBadge 
                    type={item.is_compensated ? 'success' : 'warning'} 
                    label={item.is_compensated ? 'Compensated' : 'Pending'} 
                />
            )
        },
        {
            header: "Incident Date",
            accessor: "created_at",
            render: (item) => (
                <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                    <Calendar size={12} className="text-gray-400" />
                    <span className="text-xs">{formatDate(item.created_at)}</span>
                </div>
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (item) => (
                <div className="flex justify-end gap-1">
                    <button onClick={() => handleViewDetails(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details"><Eye size={16} /></button>
                    <button onClick={() => onEdit(item)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                        {loadingId === item.id ? <LoadingSpinner size="xs" /> : <Trash2 size={16} />}
                    </button>
                </div>
            )
        }
    ];

    return (
        <BackboneTable 
            columns={columns} 
            data={records} 
        />
    );
};

export default DamageStockList;
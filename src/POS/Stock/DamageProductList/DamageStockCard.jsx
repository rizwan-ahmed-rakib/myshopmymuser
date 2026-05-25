import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import SuccessPopup from "./SuccessPopup";
import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const DamageStockCard = ({record, onEdit, onDelete}) => {
    const navigate = useNavigate();
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
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

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the damage record for ${record.product_name}?`)) return;
        setLoadingId(record.id);
        try {
            await posDamageProductAPI.delete(record.id);
            setShowDeleteSuccess(true);
            if (onDelete) onDelete();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Problem deleting the record.");
        } finally {
            setLoadingId(null);
        }
    };

    const formatMoney = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(v).replace('BDT', '৳');
    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group relative">
                <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h3 onClick={() => navigate(`/stock/details/${record.id}`)} className="font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate">
                                {record.product_name}
                            </h3>
                            <p className="text-xs text-gray-400 font-mono mt-1">#{record.reference_no}</p>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setShowDropdown(!showDropdown)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                                <FaEllipsisV size={14} />
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2">
                                    <button onClick={() => { onEdit(); setShowDropdown(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-amber-600 hover:bg-amber-50"><FaEdit size={12}/> Edit</button>
                                    <button onClick={handleDelete} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"><FaTrash size={12}/> Delete</button>
                                    <div className="border-t border-gray-50 my-1"></div>
                                    <button onClick={() => navigate(`/stock/details/${record.id}`)} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"><FaEye size={12}/> Details</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Quantity</p>
                            <p className="font-bold text-gray-800">{record.quantity} pcs</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-[10px] text-red-400 uppercase font-bold tracking-wider">Total Loss</p>
                            <p className="font-bold text-red-600">{formatMoney(record.total_loss)}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${record.damage_type === 'returnable' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {record.damage_type}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">{formatDate(record.created_at)}</span>
                    </div>
                </div>
            </div>
            {showDeleteSuccess && <SuccessPopup message="Deleted successfully" type="success" onClose={() => setShowDeleteSuccess(false)} />}
        </>
    );
};

export default DamageStockCard;

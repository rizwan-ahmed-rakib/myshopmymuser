import React, { useEffect, useState } from "react";
import BaseModal from "../BaseModal";
import { Clock, ShoppingBag, Trash2, ArrowRight, RefreshCw, Search } from "lucide-react";
import {posHoldQuotationAPI} from "../../../context_or_provider/pos/HoldQuotation/holdQuotationAPI";

const HoldListModal = ({ isOpen, onClose, transactionType = "sale", onRestoreHold }) => {
    const [holds, setHolds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchHolds = async () => {
        setLoading(true);
        try {
            const res = await posHoldQuotationAPI.getAll({
                type: transactionType,
                status: "hold",
            });
            setHolds(res.data || []);
        } catch (err) {
            console.error("Failed to load held transactions:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchHolds();
        }
    }, [isOpen, transactionType]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this hold?")) return;
        try {
            await posHoldQuotationAPI.delete(id);
            setHolds(prev => prev.filter(h => h.id !== id));
        } catch (err) {
            alert("Failed to delete held transaction");
        }
    };

    const handleRestore = async (hold) => {
        if (onRestoreHold) {
            onRestoreHold(hold);
        }
        // Optionally delete after restoring
        try {
            await posHoldQuotationAPI.delete(hold.id);
        } catch (e) {
            console.warn("Could not remove hold after restoring:", e);
        }
        onClose();
    };

    const filteredHolds = holds.filter(h => {
        const partyName = transactionType === 'sale' ? h.customer_name : h.supplier_name;
        const search = searchTerm.toLowerCase();
        return (
            (partyName && partyName.toLowerCase().includes(search)) ||
            (h.title && h.title.toLowerCase().includes(search)) ||
            String(h.id).includes(search)
        );
    });

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={transactionType === 'sale' ? "On-Hold Sales" : "On-Hold Purchases"}
            icon={<Clock size={20} className="text-amber-400" />}
            size="xl"
            variant="clean"
        >
            <div className="space-y-4">
                {/* Search & Refresh Bar */}
                <div className="flex justify-between items-center gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, name, or title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={fetchHolds}
                        className="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-600 transition-all"
                        title="Refresh List"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* List Container */}
                {loading ? (
                    <div className="py-12 text-center text-gray-400 text-xs font-medium">
                        Loading held transactions...
                    </div>
                ) : filteredHolds.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-xs font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        No held {transactionType === 'sale' ? 'sales' : 'purchases'} found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                        {filteredHolds.map((hold) => {
                            const partyName = transactionType === 'sale' ? hold.customer_name : hold.supplier_name;
                            const formattedDate = new Date(hold.created_at).toLocaleString('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            });

                            return (
                                <div
                                    key={hold.id}
                                    className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                    Hold #{hold.id}
                                                </span>
                                                {hold.title && (
                                                    <h4 className="text-xs font-bold text-gray-800 mt-1">{hold.title}</h4>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-mono text-gray-400">{formattedDate}</span>
                                        </div>

                                        <div className="text-xs text-gray-600 space-y-1 mb-3">
                                            <p><span className="font-semibold text-gray-500">{transactionType === 'sale' ? 'Customer:' : 'Supplier:'}</span> {partyName || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500">Items:</span> {hold.items?.length || 0} product(s)</p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                                        <div>
                                            <span className="text-[9px] uppercase font-bold text-gray-400 block">Total Amount</span>
                                            <span className="text-sm font-black font-mono text-blue-700">৳{Number(hold.net_total).toFixed(2)}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(hold.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete Hold"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleRestore(hold)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
                                            >
                                                <span>Load to Cart</span>
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default HoldListModal;

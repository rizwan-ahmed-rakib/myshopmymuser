import React, { useEffect, useState } from "react";
import BaseModal from "../BaseModal";
import { printQuotation } from "../../utils/quotationPrintTemplate";
import { FileText, Printer, ArrowRight, Trash2, RefreshCw, Search } from "lucide-react";
import {posHoldQuotationAPI} from "../../../context_or_provider/pos/HoldQuotation/holdQuotationAPI";

const QuotationListModal = ({ isOpen, onClose, transactionType = "sale", onRestoreQuotation }) => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchQuotations = async () => {
        setLoading(true);
        try {
            const res = await posHoldQuotationAPI.getAll({
                type: transactionType,
                status: "quotation",
            });
            setQuotations(res.data || []);
        } catch (err) {
            console.error("Failed to load quotations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchQuotations();
        }
    }, [isOpen, transactionType]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this quotation?")) return;
        try {
            await posHoldQuotationAPI.delete(id);
            setQuotations(prev => prev.filter(q => q.id !== id));
        } catch (err) {
            alert("Failed to delete quotation");
        }
    };

    const handleRestore = (quotation) => {
        if (onRestoreQuotation) {
            onRestoreQuotation(quotation);
        }
        onClose();
    };

    const handlePrint = (quotation) => {
        printQuotation(quotation);
    };

    const filteredQuotations = quotations.filter(q => {
        const partyName = transactionType === 'sale' ? q.customer_name : q.supplier_name;
        const search = searchTerm.toLowerCase();
        return (
            (partyName && partyName.toLowerCase().includes(search)) ||
            (q.title && q.title.toLowerCase().includes(search)) ||
            String(q.id).includes(search)
        );
    });

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={transactionType === 'sale' ? "Sales Quotations" : "Purchase Quotations"}
            icon={<FileText size={20} className="text-blue-500" />}
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
                        onClick={fetchQuotations}
                        className="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-600 transition-all"
                        title="Refresh List"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* List Container */}
                {loading ? (
                    <div className="py-12 text-center text-gray-400 text-xs font-medium">
                        Loading quotations...
                    </div>
                ) : filteredQuotations.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-xs font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        No {transactionType === 'sale' ? 'sales' : 'purchase'} quotations found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                        {filteredQuotations.map((q) => {
                            const partyName = transactionType === 'sale' ? q.customer_name : q.supplier_name;
                            const formattedDate = new Date(q.created_at).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric'
                            });

                            return (
                                <div
                                    key={q.id}
                                    className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                    Quotation #{q.id}
                                                </span>
                                                {q.title && (
                                                    <h4 className="text-xs font-bold text-gray-800 mt-1">{q.title}</h4>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-mono text-gray-400">{formattedDate}</span>
                                        </div>

                                        <div className="text-xs text-gray-600 space-y-1 mb-3">
                                            <p><span className="font-semibold text-gray-500">{transactionType === 'sale' ? 'Customer:' : 'Supplier:'}</span> {partyName || 'N/A'}</p>
                                            <p><span className="font-semibold text-gray-500">Items:</span> {q.items?.length || 0} product(s)</p>
                                            {q.expires_at && (
                                                <p><span className="font-semibold text-gray-500">Expires:</span> {new Date(q.expires_at).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                                        <div>
                                            <span className="text-[9px] uppercase font-bold text-gray-400 block">Total Amount</span>
                                            <span className="text-sm font-black font-mono text-blue-700">৳{Number(q.net_total).toFixed(2)}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(q.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete Quotation"
                                            >
                                                <Trash2 size={15} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handlePrint(q)}
                                                className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all active:scale-95"
                                                title="Print Quotation"
                                            >
                                                <Printer size={14} />
                                                <span>Print</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleRestore(q)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
                                            >
                                                <span>Load Cart</span>
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

export default QuotationListModal;

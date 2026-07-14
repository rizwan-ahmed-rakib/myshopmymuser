import React, { useState, useEffect } from 'react';
import { useQuickCash } from '../../../context_or_provider/pos/QuickCash/quick_cash_provider';
import { Coins, Trash2, ArrowUpDown, Plus, Pencil } from 'lucide-react';
import LoadingSpinner from "../../components/LoadingSpinner";
import BaseModal from "../../components/BaseModal";
import SuccessModal from "../../components/SuccessModal";

const QuickCashGrid = ({
    viewType,
    isAddOpen,
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const { quickCashList, loading, addQuickCashOption, removeQuickCashOption, updateQuickCashOption } = useQuickCash();

    // Add modal states
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [successData, setSuccessData] = useState(null);

    // Edit modal states
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [editAmount, setEditAmount] = useState('');
    const [editName, setEditName] = useState('');
    const [editImageFile, setEditImageFile] = useState(null);
    const [editLoading, setEditLoading] = useState(false);

    // 1. Provide Filter Configuration to Parent Container
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search quick cash...",
                filtersConfig: [
                    {
                        key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5" />, options: [
                            { value: "amount_asc", label: "Amount (Low to High)" },
                            { value: "amount_desc", label: "Amount (High to Low)" }
                        ]
                    }
                ],
                advancedConfig: []
            });
        }
    }, [setFilterConfig]);

    // 2. Calculate and push stats to parent shell
    useEffect(() => {
        if (onStatsLoaded && quickCashList) {
            onStatsLoaded([
                { title: 'Total Denominations', count: quickCashList.length, bgColor: 'bg-emerald-600', icon: <Coins size={24} /> }
            ]);
        }
    }, [quickCashList, onStatsLoaded]);

    /* ── ADD ── */
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        try {
            setActionLoading(true);
            const formData = new FormData();
            formData.append("amount", amount);
            formData.append("name", name || `${amount} Taka`);
            if (imageFile) formData.append("image", imageFile);

            const data = await addQuickCashOption(formData);
            setAmount('');
            setName('');
            setImageFile(null);
            setIsAddOpen(false);
            setSuccessData(data);
        } catch (error) {
            alert("Failed to add quick cash option");
        } finally {
            setActionLoading(false);
        }
    };

    /* ── EDIT OPEN ── */
    const openEdit = (item) => {
        setEditItem(item);
        setEditAmount(item.amount);
        setEditName(item.name);
        setEditImageFile(null);
        setIsEditOpen(true);
    };

    /* ── EDIT SUBMIT ── */
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editAmount || Number(editAmount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        try {
            setEditLoading(true);
            const formData = new FormData();
            formData.append("amount", editAmount);
            formData.append("name", editName || `${editAmount} Taka`);
            if (editImageFile) formData.append("image", editImageFile);

            await updateQuickCashOption(editItem.id, formData);
            setIsEditOpen(false);
            setEditItem(null);
        } catch (error) {
            alert("Failed to update quick cash option");
        } finally {
            setEditLoading(false);
        }
    };

    /* ── DELETE ── */
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this quick cash option?")) {
            try {
                await removeQuickCashOption(id);
            } catch (error) {
                alert("Failed to delete quick cash option");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500 text-sm">Loading quick cash denominations...</p>
            </div>
        );
    }

    // Filter and Sort
    let displayList = [...quickCashList];
    if (searchQuery) {
        displayList = displayList.filter(item =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.amount?.toString().includes(searchQuery)
        );
    }
    const sortBy = filters?.sortBy || "amount_asc";
    displayList.sort((a, b) => {
        if (sortBy === "amount_asc") return Number(a.amount) - Number(b.amount);
        if (sortBy === "amount_desc") return Number(b.amount) - Number(a.amount);
        return 0;
    });

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Coins size={16} className="text-emerald-600" />
                        Quick Cash Denominations
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {displayList.length} OF {quickCashList.length} RECORDS
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-4">
                    {displayList.map((item) => (
                        <div
                            key={item.id}
                            className="relative group rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white flex flex-col justify-between"
                        >
                            {/* Banknote design visual wrapper */}
                            <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 flex-1 flex flex-col items-center justify-center min-h-[120px] relative">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="max-h-[80px] object-contain rounded shadow-sm"
                                    />
                                ) : (
                                    <div className="w-full aspect-[2/1] rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex flex-col justify-between p-3 relative shadow-inner overflow-hidden border border-emerald-600/35">
                                        <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-white/10 blur-sm pointer-events-none"></div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-[9px] font-black tracking-widest opacity-80 uppercase">৳ BDT</span>
                                            <span className="text-[10px] font-bold opacity-60">৳</span>
                                        </div>
                                        <div className="text-center font-black text-xl tracking-tight my-1">
                                            {parseInt(item.amount)}
                                        </div>
                                        <div className="flex justify-between items-end text-[7px] font-bold opacity-75">
                                            <span className="truncate max-w-[80%]">{item.name}</span>
                                            <span>৳</span>
                                        </div>
                                    </div>
                                )}

                                {/* Hover action overlay buttons: Edit + Delete */}
                                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="p-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 border border-blue-100 shadow-sm active:scale-95"
                                        title="Edit Denomination"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-1.5 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all duration-200 border border-rose-100 shadow-sm active:scale-95"
                                        title="Delete Denomination"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>

                            <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] font-black text-slate-800 truncate max-w-[70%]">{item.name}</span>
                                <span className="text-[11px] font-extrabold text-emerald-600 font-mono">৳{Number(item.amount).toFixed(0)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {displayList.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <Coins className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-base font-bold text-gray-800 mb-1">No quick cash options</h3>
                        <p className="text-gray-500 text-xs mb-4">Add quick denominations for faster POS sales change calculation.</p>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md active:scale-95 hover:bg-emerald-700 transition-all"
                        >
                            Add Denomination
                        </button>
                    </div>
                )}
            </div>

            {/* ── Add Modal ── */}
            <BaseModal
                isOpen={isAddOpen}
                onClose={() => { setIsAddOpen(false); setAmount(''); setName(''); setImageFile(null); }}
                title="Add Quick Cash Option"
                size="md"
                variant="clean"
                showFooter={true}
                isLoading={actionLoading}
                onSubmit={handleAddSubmit}
                submitText="Save Option"
                submitColor="bg-emerald-600 hover:bg-emerald-700 text-white"
                icon={<Coins className="text-emerald-600" />}
            >
                <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1 pl-0.5">Amount (৳) *</label>
                        <input
                            type="number" required
                            className="w-full border-2 border-gray-200 p-2 rounded-xl text-xs font-mono outline-none focus:border-emerald-500 transition-colors"
                            placeholder="e.g. 500"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1 pl-0.5">Display Name <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            type="text"
                            className="w-full border-2 border-gray-200 p-2 rounded-xl text-xs outline-none focus:border-emerald-500 transition-colors"
                            placeholder="e.g. 500 Taka Note"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1 pl-0.5">Banknote Image <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            type="file" accept="image/*"
                            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>
                </form>
            </BaseModal>

            {/* ── Edit Modal ── */}
            <BaseModal
                isOpen={isEditOpen}
                onClose={() => { setIsEditOpen(false); setEditItem(null); setEditImageFile(null); }}
                title="Edit Quick Cash Option"
                size="md"
                // variant="clean"
                showFooter={true}
                isLoading={editLoading}
                onSubmit={handleEditSubmit}
                submitText="Update Option"
                submitColor="bg-blue-600 hover:bg-blue-700 text-white"
                icon={<Pencil className="text-blue-600" />}
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    {/* Current info banner */}
                    {editItem && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[10px] text-blue-700 font-medium flex items-center gap-2">
                            <Coins size={14} className="text-blue-500 shrink-0" />
                            Editing: <span className="font-black">৳{Number(editItem.amount).toFixed(0)} — {editItem.name}</span>
                        </div>
                    )}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1 pl-0.5">Amount (৳) *</label>
                        <input
                            type="number" required
                            className="w-full border-2 border-gray-200 p-2 rounded-xl text-xs font-mono outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g. 500"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1 pl-0.5">Display Name</label>
                        <input
                            type="text"
                            className="w-full border-2 border-gray-200 p-2 rounded-xl text-xs outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g. 500 Taka Note"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1 pl-0.5">Replace Image <span className="text-gray-400 font-normal">(optional — leave blank to keep current)</span></label>
                        <input
                            type="file" accept="image/*"
                            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                            onChange={(e) => setEditImageFile(e.target.files[0])}
                        />
                        {editItem?.image && !editImageFile && (
                            <div className="mt-2 flex items-center gap-2">
                                <img src={editItem.image} alt="current" className="h-8 w-auto rounded border border-gray-200" />
                                <span className="text-[9px] text-gray-400">Current image</span>
                            </div>
                        )}
                    </div>
                </form>
            </BaseModal>

            {/* ── Success Modal ── */}
            {successData && (
                <SuccessModal
                    isOpen={!!successData}
                    onClose={() => setSuccessData(null)}
                    title="Quick Cash Added"
                    subtitle="New payment shortcut created successfully"
                    details={[
                        { label: "Display Name", value: successData.name },
                        { label: "Value Amount", value: `৳${Number(successData.amount).toFixed(0)}` }
                    ]}
                />
            )}
        </div>
    );
};

export default QuickCashGrid;

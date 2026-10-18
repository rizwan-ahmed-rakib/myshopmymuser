// pages/StandaloneDosagePrint.jsx
import React, {useState} from "react";
import MedicineDosageChart from "../components/medicine/MedicineDosageChart";
import MedicineDosageConfigModal from "../components/medicine/MedicineDosageConfigModal";
import {printDosageChart, printMultipleDosageCharts} from "../utils/printDosageChart";
import {
    Pill, Plus, Camera, Printer, Trash2, Edit3, X, Copy,
    Image as ImageIcon, Layers,
} from "lucide-react";
import {usePosSettings} from "../../context_or_provider/pos/PosSettings/pos_settings_provider";

const StandaloneDosagePrint = () => {
    // Multiple charts — one session-এ অনেকগুলো ঔষধ print করা যাবে
    const {settings} = usePosSettings();
    const [charts, setCharts] = useState([]);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [draftName, setDraftName] = useState("");

    const openNew = () => {
        setEditingIndex(null);
        setDraftName("");
        setIsConfigOpen(true);
    };

    const openEdit = (idx) => {
        setEditingIndex(idx);
        setDraftName(charts[idx].medicineName || "");
        setIsConfigOpen(true);
    };

    const handleSave = (config) => {
        const finalConfig = {
            ...config,
            medicineName: draftName || config.medicineName || `ঔষধ ${charts.length + 1}`,
        };
        if (editingIndex !== null) {
            setCharts((prev) => {
                const updated = [...prev];
                updated[editingIndex] = finalConfig;
                return updated;
            });
        } else {
            setCharts((prev) => [...prev, finalConfig]);
        }
        setEditingIndex(null);
        setDraftName("");
    };

    const removeChart = (idx) => {
        setCharts((prev) => prev.filter((_, i) => i !== idx));
    };

    const clearAll = () => {
        if (window.confirm("সব chart মুছে ফেলবেন?")) setCharts([]);
    };

    const handlePrintOne = (chart) => {
        printDosageChart(chart, {
            copies: 2,
            settings: settings,   // 🆕 pass shop settings
        });
    };

    const handlePrintAll = () => {
        if (!charts.length) return;
        printMultipleDosageCharts(charts, {
            settings: settings,   // 🆕 pass shop settings
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-6xl mx-auto p-4">
                {/* Header */}
                <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 mb-4 shadow-lg text-white">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur">
                                <Pill size={28}/>
                            </div>
                            <div>
                                <h1 className="text-xl font-black uppercase tracking-wider">
                                    ঔষধ সেবনের নিয়ম Print
                                </h1>
                                <p className="text-[11px] font-semibold text-white/80 mt-0.5">
                                    Sale ছাড়াই যেকোনো ঔষধের ডোজ চার্ট তৈরি করে প্রিন্ট দিন
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={openNew}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-700 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:bg-emerald-50 active:scale-95 transition-all"
                        >
                            <Plus size={16}/> নতুন ঔষধ যোগ করুন
                        </button>
                    </div>
                </div>

                {/* Info banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex items-start gap-3">
                    <Layers size={16} className="text-blue-600 shrink-0 mt-0.5"/>
                    <div className="text-[11px] text-blue-900 font-semibold leading-relaxed">
                        <b>কীভাবে ব্যবহার করবেন:</b> "নতুন ঔষধ যোগ করুন" → ঔষধের নাম লিখুন →
                        ক্যামেরা/গ্যালারি থেকে স্ট্রিপের ছবি তুলুন → কতবার/কখন খাবে সেট করুন →
                        Save → তারপর 👇 এখান থেকে Print দিন। একসাথে ৫-১০টা ঔষধের চার্ট বানিয়ে
                        একসাথে প্রিন্ট দিতে পারবেন।
                    </div>
                </div>

                {/* Charts grid */}
                {charts.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                        <div
                            className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera size={36} className="text-emerald-600"/>
                        </div>
                        <h3 className="text-base font-black text-gray-700 mb-2">
                            এখনো কোনো chart যোগ করা হয়নি
                        </h3>
                        <p className="text-xs text-gray-500 mb-5 max-w-md mx-auto">
                            ঔষধের নাম + স্ট্রিপের ছবি + ডোজ সেট করলেই রোগীর জন্য print-ready chart তৈরি হবে।
                        </p>
                        <button
                            type="button"
                            onClick={openNew}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
                        >
                            <Plus size={16}/> প্রথম ঔষধ যোগ করুন
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Actions bar */}
                        <div
                            className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex items-center justify-between flex-wrap gap-2">
                            <div className="text-xs font-black text-gray-700 uppercase tracking-wider">
                                মোট {charts.length}টি ঔষধ
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="flex items-center gap-1.5 px-3 py-2 border border-rose-200 text-rose-600 rounded-lg font-bold text-[11px] hover:bg-rose-50 transition-all"
                                >
                                    <Trash2 size={14}/> সব মুছুন
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePrintAll}
                                    className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
                                >
                                    <Printer size={14}/> সব একসাথে প্রিন্ট
                                </button>
                            </div>
                        </div>

                        {/* Chart cards grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {charts.map((chart, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl border-2 border-gray-200 hover:border-emerald-400 transition-all shadow-sm hover:shadow-md overflow-hidden"
                                >
                                    {/* Card header */}
                                    <div
                                        className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Pill size={16} className="text-emerald-600 shrink-0"/>
                                            <p className="text-sm font-black text-gray-800 truncate">
                                                {chart.medicineName || `ঔষধ ${idx + 1}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(idx)}
                                                className="p-1.5 hover:bg-white rounded-lg text-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit3 size={14}/>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeChart(idx)}
                                                className="p-1.5 hover:bg-white rounded-lg text-rose-600 transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 size={14}/>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Chart preview */}
                                    <div className="p-4 flex justify-center bg-gray-50">
                                        <MedicineDosageChart
                                            config={chart}
                                            size="sm"
                                        />
                                    </div>

                                    {/* Card footer */}
                                    <div className="p-3 border-t border-gray-100 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handlePrintOne(chart)}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-[11px] uppercase tracking-wider shadow-sm active:scale-95 transition-all"
                                        >
                                            <Printer size={13}/> প্রিন্ট
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Dosage Config Modal */}
            <MedicineDosageConfigModal
                isOpen={isConfigOpen}
                onClose={() => {
                    setIsConfigOpen(false);
                    setEditingIndex(null);
                    setDraftName("");
                }}
                onSave={handleSave}
                medicineName={draftName}
                initialConfig={editingIndex !== null ? charts[editingIndex] : null}
            />
        </div>
    );
};

export default StandaloneDosagePrint;
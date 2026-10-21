import React, { useState, useEffect } from "react";
import { Lock, AlertTriangle, Clock } from "lucide-react";
import api from "../../context_or_provider/pos/posApi";
import BaseModal from "../components/BaseModal";

// ✅ SAFE: explicit local → ISO parsing (no browser ambiguity)
const toLocalInput = (d) => {
    const off = d.getTimezoneOffset();
    return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
};

const localInputToISO = (localStr) => {
    // localStr = "2026-01-20T10:00"  →  treat as local time, output UTC ISO
    if (!localStr) return new Date().toISOString();
    const [datePart, timePart] = localStr.split('T');
    const [y, m, d] = datePart.split('-').map(Number);
    const [hh, mm] = (timePart || '00:00').split(':').map(Number);
    // new Date(y, m-1, d, hh, mm) — LOCAL time constructor
    const localDate = new Date(y, m - 1, d, hh, mm, 0, 0);
    return localDate.toISOString();
};

const CloseDayModal = ({ isOpen, onClose, onSuccess, currentDay }) => {
    const [closedAt, setClosedAt] = useState(toLocalInput(new Date()));
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");

    // ✅ FIX 1: Modal খোলার প্রতিবার state reset করো
    useEffect(() => {
        if (isOpen) {
            setClosedAt(toLocalInput(new Date()));
            setNote("");
            setError("");
            setPreview(null);
        }
    }, [isOpen]);

    // Live preview (safe ISO conversion)
    useEffect(() => {
        if (!isOpen || !currentDay?.id) return;
        const t = setTimeout(async () => {
            try {
                const iso = localInputToISO(closedAt);
                const res = await api.get(
                    `/api/cashbox/business-days/${currentDay.id}/preview_close/?at=${encodeURIComponent(iso)}`
                );
                setPreview(res.data);
            } catch { /* ignore */ }
        }, 300);
        return () => clearTimeout(t);
    }, [closedAt, isOpen, currentDay?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // ✅ FIX 2: Safer ISO + 10-second buffer to handle clock skew
            const rawISO = localInputToISO(closedAt);
            const bufferedISO = new Date(new Date(rawISO).getTime() - 10000).toISOString();

            const res = await api.post(
                `/api/cashbox/business-days/${currentDay.id}/close_day/`,
                { closed_at: bufferedISO, note }
            );
            onSuccess?.(res.data);
        } catch (err) {
            setError(err?.response?.data?.detail || "Close করতে সমস্যা হয়েছে।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Close Business Day"
            size="md"
            icon={<Lock className="text-white" />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Confirm Close"
            isLoading={loading}
        >
            <div className="space-y-5">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                        Current Open Day
                    </p>
                    <p className="text-lg font-black text-gray-800">{currentDay?.business_date}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Opened at {currentDay?.opened_at
                            ? new Date(currentDay.opened_at).toLocaleString('en-GB')
                            : '—'}
                    </p>
                    <p className="text-xs text-gray-500">
                        Opening balance: ৳{Number(currentDay?.opening_balance || 0).toLocaleString()}
                    </p>
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Clock size={12} /> Close Time (adjustable)
                    </label>
                    <input
                        type="datetime-local"
                        value={closedAt}
                        max={toLocalInput(new Date())}
                        onChange={(e) => setClosedAt(e.target.value)}
                        className="w-full mt-1 border border-gray-200 p-3 rounded-xl font-bold text-gray-800 focus:border-indigo-400 outline-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5">
                        * রাত ২টা/৩টায় বন্ধ করলে সেই সময়টাই দিন — midnight-এ split হবে না।
                    </p>
                </div>

                {preview && (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-bold">Calculated Income</span>
                            <span className="font-black text-emerald-600">
                                ৳{Number(preview.calculated_income).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-bold">Calculated Expense</span>
                            <span className="font-black text-rose-600">
                                ৳{Number(preview.calculated_expense).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                            <span className="text-gray-700 font-black">Closing Balance</span>
                            <span className="font-black text-indigo-700 text-lg">
                                ৳{Number(preview.calculated_closing).toLocaleString()}
                            </span>
                        </div>
                        {preview.transactions_to_move > 0 && (
                            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
                                <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-[11px] text-amber-800">
                                    <strong>{preview.transactions_to_move}</strong> transaction এই সময়ের পরে
                                    হয়েছে — সেগুলো <strong>পরবর্তী দিনে</strong> চলে যাবে।
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Close Note (optional)
                    </label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows="2"
                        placeholder="যেমন: ২টায় বন্ধ, ইফতারের পর খোলা হয়নি..."
                        className="w-full mt-1 border border-gray-200 p-3 rounded-xl text-xs font-bold text-gray-700 outline-none resize-none bg-gray-50/50"
                    />
                </div>

                {error && (
                    <p className="bg-rose-50 text-rose-600 p-3 rounded-xl border border-rose-100 text-[10px] font-black uppercase tracking-widest text-center">
                        {error}
                    </p>
                )}
            </div>
        </BaseModal>
    );
};

export default CloseDayModal;




// /////////////////////////////
// 🧪 Test — ৩টা প্রধান Case
//
//
// Test 1: Normal Close (11 PM)
//
// -Open → 11 PM close → Status = closed ✅
// current → returns closed (no reopen) ✅
// Next day txn → new day created ✅
// -------------------------------------------
//
// Test 2: Late Close (2 AM)
//
// Open 11 AM → 2 AM close → Cap check: 2 AM < 4 AM cutoff → no cap ✅
// Status = closed (business_date = yesterday) ✅
// Next 10 AM txn → new day ✅
// -------------------------------------------
//
// Test 3: Forgotten Close (5 AM)
//
// Open 11 AM (Oct 20) → Forgot to close
// 5 AM (Oct 21) try to close → Cap at 3:59:59 AM (Oct 21) ✅
// Note: "[Auto-capped from 2026-10-21 05:00:00]" added ✅
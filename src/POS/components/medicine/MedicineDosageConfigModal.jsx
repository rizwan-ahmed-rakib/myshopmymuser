// components/medicine/MedicineDosageConfigModal.jsx
import React, {useState, useEffect, useRef} from "react";
import BaseModal from "../BaseModal";
import {
    Pill,
    Camera,
    Trash2,
    Plus,
    Minus,
    Smartphone,
    Image as ImageIcon,
} from "lucide-react";
import MedicineDosageChart, {buildDefaultSlots} from "./MedicineDosageChart";
import CameraCapture from "../imagecapture/CameraCapture";
import RemoteScannerPairingModal from "../imagecapture/RemoteScannerPairingModal";

const TIME_OPTIONS = [
    {value: 1, label: "দিনে ১ বার"},
    {value: 2, label: "দিনে ২ বার"},
    {value: 3, label: "দিনে ৩ বার"},
    {value: 4, label: "দিনে ৪ বার (৬ ঘণ্টা পর পর)"},
    {value: 6, label: "দিনে ৬ বার (৪ ঘণ্টা পর পর)"},
];

const SLOT_LABEL = {
    morning: "সকাল",
    midMorning: "সকাল ১০টা",
    noon: "দুপুর",
    afternoon: "বিকাল",
    evening: "সন্ধ্যা",
    night: "রাত",
};

/* Base64 → File */
const dataUrlToFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, {type: mime});
};

const MedicineDosageConfigModal = ({
                                       isOpen,
                                       onClose,
                                       onSave,
                                       initialConfig,
                                       medicineName,
                                   }) => {
    const [timesPerDay, setTimesPerDay] = useState(3);
    const [slots, setSlots] = useState(buildDefaultSlots(3));
    const [stripImage, setStripImage] = useState(null);
    const [note, setNote] = useState("");

    // File picker ref
    const stripInputRef = useRef(null);

    // Camera capture modal
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    // Remote mobile pairing
    const [isRemoteOpen, setIsRemoteOpen] = useState(false);
    const ALL_SLOTS = ["morning", "midMorning", "noon", "afternoon", "evening", "night"];
    const SLOT_ORDER = ["morning", "midMorning", "noon", "afternoon", "evening", "night"];
    const [durationDays, setDurationDays] = useState(0);
    const [durationLanguage, setDurationLanguage] = useState("bn");

    /* Load initial config on open */
    useEffect(() => {
        if (!isOpen) return;
        if (initialConfig?.slots?.length) {
            setTimesPerDay(initialConfig.timesPerDay || 3);
            setSlots(initialConfig.slots);
            setStripImage(initialConfig.stripImage || null);
            setNote(initialConfig.note || "");
            setDurationDays(initialConfig.durationDays || 0);            // 🆕
            setDurationLanguage(initialConfig.durationLanguage || "bn");  // 🆕
        } else {
            setTimesPerDay(3);
            setSlots(buildDefaultSlots(3));
            setStripImage(null);
            setNote("");
            setDurationDays(0);            // 🆕
            setDurationLanguage("bn");     // 🆕
        }
    }, [isOpen, initialConfig]);

    const handleTimesChange = (n) => {
        const next = buildDefaultSlots(n);
        const merged = next.map((s) => {
            const old = slots.find((o) => o.slot === s.slot);
            return old ? {...s, ...old, slot: s.slot} : s;
        });
        setTimesPerDay(n);
        setSlots(merged);
    };

    const updateSlot = (idx, patch) => {
        setSlots((prev) => {
            const arr = [...prev];
            arr[idx] = {...arr[idx], ...patch};
            return arr;
        });
    };

    /* Gallery file picker */
    const handleStripImageFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setStripImage(reader.result);
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    /* Camera capture done */
    const handleCameraCapture = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setStripImage(reader.result);
        reader.readAsDataURL(file);
        setIsCameraOpen(false);
    };

    /* Remote mobile image received */
    const handleRemoteImage = (payload) => {
        if (payload?.kind === "image" && payload?.image) {
            setStripImage(payload.image);
            setIsRemoteOpen(false);
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        onSave?.({
            timesPerDay,
            slots,
            stripImage,
            medicineName,
            note,
            durationDays,             // 🆕
            durationLanguage,         // 🆕
        });
        onClose();
    };

    const previewConfig = {timesPerDay, slots, stripImage, medicineName, note, durationDays, durationLanguage};

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title="ঔষধ সেবনের নিয়ম সেট করুন"
                subtitle={medicineName}
                size="lg"
                icon={<Pill className="text-emerald-600"/>}
                showFooter={true}
                onSubmit={handleSubmit}
                submitText="Save & Preview"
            >
                <div className="space-y-4">
                    {/* Strip image + note */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                            <label
                                className="block text-[10px] font-black uppercase text-emerald-700 mb-2 tracking-wider">
                                স্ট্রিপের ছবি (optional)
                            </label>

                            {stripImage ? (
                                <div className="flex items-center gap-3">
                                    <img
                                        src={stripImage}
                                        alt="strip"
                                        className="h-16 w-auto rounded border border-emerald-200 bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setStripImage(null)}
                                        className="p-1.5 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100"
                                        title="Remove"
                                    >
                                        <Trash2 size={14}/>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Gallery */}
                                    <button
                                        type="button"
                                        onClick={() => stripInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center gap-1 py-2 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <ImageIcon size={14} className="text-blue-600"/>
                                        <span className="text-[9px] font-black uppercase text-blue-700">
                                            গ্যালারি
                                        </span>
                                    </button>

                                    {/* Camera */}
                                    <button
                                        type="button"
                                        onClick={() => setIsCameraOpen(true)}
                                        className="flex flex-col items-center justify-center gap-1 py-2 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                                    >
                                        <Camera size={14} className="text-emerald-600"/>
                                        <span className="text-[9px] font-black uppercase text-emerald-700">
                                            ক্যামেরা
                                        </span>
                                    </button>

                                    {/* Remote Mobile */}
                                    <button
                                        type="button"
                                        onClick={() => setIsRemoteOpen(true)}
                                        className="flex flex-col items-center justify-center gap-1 py-2 bg-purple-50 border-2 border-dashed border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                                    >
                                        <Smartphone size={14} className="text-purple-600"/>
                                        <span className="text-[9px] font-black uppercase text-purple-700">
                                            মোবাইল
                                        </span>
                                    </button>
                                </div>
                            )}

                            <input
                                ref={stripInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleStripImageFile}
                            />
                        </div>

                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                            <label
                                className="block text-[10px] font-black uppercase text-amber-700 mb-2 tracking-wider">
                                নোট (optional)
                            </label>
                            <input
                                type="text"
                                className="w-full border-2 border-amber-200 rounded-lg p-2 text-xs bg-white outline-none focus:border-amber-500"
                                placeholder="যেমন: খাবারের ৩০ মিনিট আগে"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Times per day */}
                    {/* 🆕 Quick Preset Buttons */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-600 mb-2 tracking-wider">
                            দ্রুত সেট করুন (optional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {TIME_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleTimesChange(opt.value)}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-black transition-all border-2 bg-white text-gray-700 border-gray-200 hover:border-emerald-400 active:scale-95"
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">
                            👆 উপরের button চাপলে সব slot অটো-সেট হবে। নিচে নিজে adjust করতে পারবেন।
                        </p>
                    </div>

                    {/* 🆕 Manual Slot Selection — চেক/আনচেক */}
                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-3">
                        <label className="block text-[10px] font-black uppercase text-emerald-700 mb-2 tracking-wider">
                            কোন কোন সময়ে খাবে? (টিক দিয়ে বেছে নিন)
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {ALL_SLOTS.map((slotKey) => {
                                const isSelected = slots.some((s) => s.slot === slotKey);
                                return (
                                    <button
                                        key={slotKey}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                setSlots((prev) => prev.filter((s) => s.slot !== slotKey));
                                            } else {
                                                // maintain order — SLOT_ORDER অনুযায়ী
                                                const next = [...slots, {slot: slotKey, beforeMeal: true, dots: 1}];
                                                next.sort((a, b) =>
                                                    SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot)
                                                );
                                                setSlots(next);
                                            }
                                        }}
                                        className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${
                                            isSelected
                                                ? "bg-emerald-600 text-white border-emerald-700 shadow-md"
                                                : "bg-white text-gray-500 border-gray-200 hover:border-emerald-400"
                                        }`}
                                    >
                    <span className="block text-[14px] mb-0.5">
                        {isSelected ? "✓" : "◯"}
                    </span>
                                        {SLOT_LABEL[slotKey]}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-[10px] text-emerald-700 mt-2 font-bold">
                            বর্তমানে {slots.length}টি সময় নির্বাচিত
                        </p>
                    </div>

                    {/* Per-slot config */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-600 mb-2 tracking-wider">
                            প্রতিটা সময়ের নিয়ম
                        </label>
                        <div className="space-y-2">
                            {slots.map((slot, idx) => (
                                <div
                                    key={idx}
                                    className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-lg p-2 border border-gray-100"
                                >
                                    <div className="col-span-3 text-[11px] font-black text-gray-700">
                                        {SLOT_LABEL[slot.slot]}
                                    </div>

                                    <div className="col-span-4 flex items-center gap-1.5">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase">
                                            কতটা:
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateSlot(idx, {
                                                    dots: Math.max(1, slot.dots - 1),
                                                })
                                            }
                                            className="w-6 h-6 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                        >
                                            <Minus size={11}/>
                                        </button>
                                        <span className="w-8 text-center font-mono font-black text-emerald-700 text-sm">
                                            {slot.dots}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateSlot(idx, {
                                                    dots: Math.min(4, slot.dots + 1),
                                                })
                                            }
                                            className="w-6 h-6 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                        >
                                            <Plus size={11}/>
                                        </button>
                                    </div>

                                    <div className="col-span-5 flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => updateSlot(idx, {beforeMeal: true})}
                                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border-2 ${
                                                slot.beforeMeal
                                                    ? "bg-orange-500 text-white border-orange-600"
                                                    : "bg-white text-gray-500 border-gray-200 hover:border-orange-300"
                                            }`}
                                        >
                                            খাবারের আগে
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateSlot(idx, {beforeMeal: false})}
                                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border-2 ${
                                                !slot.beforeMeal
                                                    ? "bg-emerald-500 text-white border-emerald-600"
                                                    : "bg-white text-gray-500 border-gray-200 hover:border-emerald-300"
                                            }`}
                                        >
                                            খাবারের পরে
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 🆕 Duration / Course Days */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3 space-y-2">
                        <label className="block text-[10px] font-black uppercase text-blue-700 mb-1 tracking-wider">
                            📅 কোর্স / সেবনের দিন সংখ্যা (optional)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">
                                    মোট দিন
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="60"
                                    placeholder="0 = বন্ধ"
                                    className="w-full border-2 border-blue-200 p-2 rounded-xl text-sm font-black font-mono bg-white outline-none focus:border-blue-500"
                                    value={durationDays || ""}
                                    onChange={(e) => {
                                        const val = Math.max(0, Math.min(60, Number(e.target.value) || 0));
                                        setDurationDays(val);
                                    }}
                                />
                                <p className="text-[9px] text-gray-400 mt-1">
                                    যেমন: ৭ দিন / ১০ দিন (0 দিলে counter দেখাবে না)
                                </p>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">
                                    সংখ্যার ভাষা
                                </label>
                                <div className="grid grid-cols-2 gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setDurationLanguage("bn")}
                                        className={`py-2 rounded-xl text-[10px] font-black transition-all border-2 ${
                                            durationLanguage === "bn"
                                                ? "bg-blue-600 text-white border-blue-700"
                                                : "bg-white text-gray-500 border-gray-200 hover:border-blue-300"
                                        }`}
                                    >
                                        বাংলা ১,২,৩
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDurationLanguage("en")}
                                        className={`py-2 rounded-xl text-[10px] font-black transition-all border-2 ${
                                            durationLanguage === "en"
                                                ? "bg-blue-600 text-white border-blue-700"
                                                : "bg-white text-gray-500 border-gray-200 hover:border-blue-300"
                                        }`}
                                    >
                                        English 1,2,3
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-600 mb-2 tracking-wider">
                            প্রিভিউ (এভাবেই প্রিন্ট হবে)
                        </label>
                        <div className="flex justify-center bg-gray-100 rounded-xl p-3">
                            <MedicineDosageChart config={previewConfig} size="sm"/>
                        </div>
                    </div>
                </div>
            </BaseModal>

            {/* 🆕 Camera Capture Modal (desktop webcam / mobile rear camera) */}
            {isCameraOpen && (
                <CameraCapture
                    onClose={() => setIsCameraOpen(false)}
                    onCapture={handleCameraCapture}
                />
            )}

            {/* 🆕 Remote Mobile Pairing Modal */}
            <RemoteScannerPairingModal
                isOpen={isRemoteOpen}
                onClose={() => setIsRemoteOpen(false)}
                enabledModes={["general_image"]}
                onScan={(payload) => {
                    if (payload?.purpose === "general_image" && payload?.kind === "image") {
                        handleRemoteImage(payload);
                    }
                }}
            />
        </>
    );
};

export default MedicineDosageConfigModal;
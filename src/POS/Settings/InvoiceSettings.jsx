// InvoiceSettings.jsx — Invoice & Print Format Configuration
// printTemplates.js ও posReceiptTemplate.js থেকে সরাসরি HTML নিয়ে iframe এ দেখানো হচ্ছে।
// Template বদলালে এখানে কিছু করতে হবে না — automatically মিলে যাবে।

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePosSettings } from '../../context_or_provider/pos/PosSettings/pos_settings_provider';
import { usePrintManager } from '../utils/usePrintManager';
import { getBrandedVoucher } from '../utils/printTemplates';
import { getSalePrintLayout } from '../Sales/SaleProduct/SalePrintLayout';
import { getPOSReceiptHTML } from '../utils/posReceiptTemplate';

// ─── sample invoice (realistic data) ────────────────────────────────────────
const SAMPLE_INVOICE = {
    invoice_no: 'INV-1001',
    created_at: new Date().toISOString(),
    customer_name: 'Rahim Uddin',
    payment_method: 'cash',
    total_amount: 13000,
    itemwise_total_discount: 0,
    subtotal: 12500,
    global_discount: 500,
    globalDiscount: 500,
    total_discount: 500,
    net_total: 12000,
    netTotal: 12000,
    paid_amount: 12000,
    due_amount: 0,
    note: '',
    items: [
        { product_name: 'Samsung Galaxy A55', quantity: 1, unit_price: 8000, discount_amount: 0, net_total: 8000 },
        { product_name: 'Xiaomi Redmi Note 13', quantity: 2, unit_price: 2250, discount_amount: 0, net_total: 4500 },
    ],
};

// ─── Scaled A4 iframe Preview ────────────────────────────────────────────────
// iframe কে 900px wide render করে তারপর CSS scale দিয়ে container এ ফিট করা হচ্ছে
// এতে A4 এর পুরো layout দেখা যাবে, কিছু কাটা যাবে না
const A4Preview = ({ htmlContent }) => {
    const iframeRef = useRef(null);
    const wrapperRef = useRef(null);
    const [scale, setScale] = useState(0.55);
    const IFRAME_WIDTH = 900; // A4 landscape-ish virtual width

    // wrapper এর width অনুযায়ী scale calculate করা
    const calcScale = useCallback(() => {
        if (wrapperRef.current) {
            const w = wrapperRef.current.offsetWidth;
            setScale(w / IFRAME_WIDTH);
        }
    }, []);

    useEffect(() => {
        calcScale();
        const ro = new ResizeObserver(calcScale);
        if (wrapperRef.current) ro.observe(wrapperRef.current);
        return () => ro.disconnect();
    }, [calcScale]);

    useEffect(() => {
        if (!iframeRef.current) return;
        const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (!doc) return;
        const cleanHTML = htmlContent
            .replace(/<script[\s\S]*?<\/script>/gi, '');
        doc.open();
        doc.write(cleanHTML);
        doc.close();
    }, [htmlContent]);

    // scaled height = iframe natural height * scale
    const iframeHeight = 1100;
    const scaledHeight = Math.round(iframeHeight * scale);

    return (
        <div ref={wrapperRef} style={{ width: '100%', position: 'relative', overflow: 'hidden', height: scaledHeight }}>
            <iframe
                ref={iframeRef}
                title="A4 Invoice Preview"
                style={{
                    width: IFRAME_WIDTH,
                    height: iframeHeight,
                    border: 'none',
                    background: '#fff',
                    transformOrigin: 'top left',
                    transform: `scale(${scale})`,
                    display: 'block',
                    pointerEvents: 'none', // scroll prevent করতে
                }}
                scrolling="no"
            />
        </div>
    );
};

// ─── Thermal Receipt Preview ─────────────────────────────────────────────────
// paper roll এর মতো দেখায় — সরু, লম্বা
const ThermalPreview = ({ htmlContent }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (!iframeRef.current) return;
        const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (!doc) return;
        const cleanHTML = htmlContent.replace(/<script[\s\S]*?<\/script>/gi, '');
        doc.open();
        doc.write(cleanHTML);
        doc.close();
    }, [htmlContent]);

    return (
        // paper roll দেখানোর জন্য বাইরে একটি styled wrapper
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '16px 0',
        }}>
            {/* printer body */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                {/* printer top slot */}
                <div style={{
                    width: 310,
                    height: 16,
                    background: 'linear-gradient(180deg,#374151,#4b5563)',
                    borderRadius: '6px 6px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                }}>
                    <div style={{ width: 120, height: 4, background: '#6b7280', borderRadius: 2 }}/>
                    <div style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }}/>
                </div>

                {/* receipt paper */}
                <div style={{
                    width: 290,
                    background: '#fff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15), 2px 0 4px rgba(0,0,0,0.05), -2px 0 4px rgba(0,0,0,0.05)',
                    borderLeft: '1px solid #e5e7eb',
                    borderRight: '1px solid #e5e7eb',
                    overflow: 'hidden',
                }}>
                    <iframe
                        ref={iframeRef}
                        title="Thermal Receipt Preview"
                        style={{
                            width: 290,
                            height: 540,
                            border: 'none',
                            display: 'block',
                            pointerEvents: 'none',
                        }}
                        scrolling="no"
                    />
                </div>

                {/* torn edge — receipt এর নিচে দাঁতের মতো */}
                <div style={{
                    width: 290,
                    height: 12,
                    backgroundImage: 'radial-gradient(circle at 10px 0, transparent 8px, #fff 8px)',
                    backgroundSize: '20px 12px',
                    backgroundRepeat: 'repeat-x',
                    backgroundColor: 'transparent',
                    filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))',
                }}/>
            </div>
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const InvoiceSettings = () => {
    const { settings: posSettings } = usePosSettings();
    const { printFormat, setPrintFormat } = usePrintManager();

    const [previewType, setPreviewType] = useState(printFormat || 'a4');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setPreviewType(printFormat || 'a4');
    }, [printFormat]);

    // HTML একবারই generate করা — template change হলে re-render হবে
    const a4HTML = getBrandedVoucher(
        'Sale Invoice',
        getSalePrintLayout(SAMPLE_INVOICE),
        SAMPLE_INVOICE.invoice_no,
        '#1d4ed8'
    );
    const thermalHTML = getPOSReceiptHTML(SAMPLE_INVOICE);

    const handleFormatChange = (fmt) => {
        setPrintFormat(fmt);
        setPreviewType(fmt);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    // Full preview নতুন tab এ দেখানো (print ছাড়া)
    const openFullPreview = () => {
        const html = previewType === 'a4' ? a4HTML : thermalHTML;
        const cleanHTML = html.replace(/<script[\s\S]*?<\/script>/gi, '');
        const w = window.open('', '_blank', previewType === 'a4' ? 'width=900,height=800' : 'width=360,height=700');
        if (w) { w.document.write(cleanHTML); w.document.close(); }
    };

    const SectionCard = ({ title, icon, children }) => (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[16px]">{icon}</span>
                <h3 className="text-[14px] font-semibold text-slate-800">{title}</h3>
            </div>
            {children}
        </div>
    );

    return (
        <div className="space-y-5">
            {/* page title */}
            <div>
                <h2 className="text-[16px] font-semibold text-slate-900">Invoice & Print Settings</h2>
                <p className="text-[12px] text-slate-500 mt-0.5">
                    Default print format বেছে নিন — সব module এ একসাথে effect পড়বে
                </p>
            </div>

            {saved && (
                <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-[13px] font-medium">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Print format saved! সব module এ এখন থেকে এই format এ print হবে।
                </div>
            )}

            {/* ── Side-by-side layout: Format Selector + Preview ── */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

                {/* LEFT: Format Selector (2 cols) */}
                <div className="xl:col-span-2 space-y-4">
                    <SectionCard title="Default Print Format" icon="🖨️">
                        <p className="text-[11px] text-slate-500 mb-4">
                            এই সেটিং অনুযায়ী সব module এ print হবে।
                        </p>

                        {/* A4 option */}
                        <button
                            type="button"
                            onClick={() => handleFormatChange('a4')}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all mb-3 text-left ${
                                printFormat === 'a4'
                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
                            }`}
                        >
                            {/* A4 paper icon */}
                            <div className={`shrink-0 w-10 h-14 rounded border-2 flex flex-col items-center justify-center gap-1 ${
                                printFormat === 'a4' ? 'border-blue-400 bg-white' : 'border-slate-300 bg-slate-100'
                            }`}>
                                <div className="w-6 h-px bg-slate-400"/>
                                <div className="w-6 h-px bg-slate-400"/>
                                <div className="w-4 h-px bg-slate-400"/>
                                <div className="w-6 h-px bg-slate-400"/>
                                <div className="w-3 h-px bg-slate-400"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[13px] font-semibold ${printFormat === 'a4' ? 'text-blue-700' : 'text-slate-700'}`}>
                                        A4 Full-page Invoice
                                    </span>
                                    {printFormat === 'a4' && (
                                        <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded uppercase tracking-wide">Active</span>
                                    )}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">Branded voucher with company logo</div>
                                <div className="text-[10px] text-slate-400 mt-1">বড় amount • কম sale frequency</div>
                            </div>
                            {printFormat === 'a4' && (
                                <div className="shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                </div>
                            )}
                        </button>

                        {/* POS Thermal option */}
                        <button
                            type="button"
                            onClick={() => handleFormatChange('pos')}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                                printFormat === 'pos'
                                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
                            }`}
                        >
                            {/* thermal receipt icon */}
                            <div className={`shrink-0 w-7 h-14 rounded border-2 flex flex-col items-center justify-center gap-1 ${
                                printFormat === 'pos' ? 'border-emerald-400 bg-white' : 'border-slate-300 bg-slate-100'
                            }`}>
                                <div className="w-4 h-px bg-slate-400"/>
                                <div className="w-4 h-px bg-slate-400"/>
                                <div className="w-2.5 h-px bg-slate-400"/>
                                <div className="w-4 h-px bg-slate-400"/>
                                <div className="w-3 h-px bg-slate-400"/>
                                <div className="w-4 h-px bg-slate-400"/>
                                <div className="w-2 h-px bg-slate-400"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[13px] font-semibold ${printFormat === 'pos' ? 'text-emerald-700' : 'text-slate-700'}`}>
                                        POS Thermal Receipt
                                    </span>
                                    {printFormat === 'pos' && (
                                        <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded uppercase tracking-wide">Active</span>
                                    )}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">80mm slim receipt (thermal printer)</div>
                                <div className="text-[10px] text-slate-400 mt-1">ছোট amount • বেশি sale frequency</div>
                            </div>
                            {printFormat === 'pos' && (
                                <div className="shrink-0 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                </div>
                            )}
                        </button>

                        {/* Save */}
                        <div className="pt-3 border-t border-slate-200 mt-3">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white text-[13px] font-medium rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                                    <polyline points="17 21 17 13 7 13 7 21"/>
                                    <polyline points="7 3 7 8 15 8"/>
                                </svg>
                                Save Settings
                            </button>
                        </div>
                    </SectionCard>
                </div>

                {/* RIGHT: Live Preview (3 cols) */}
                <div className="xl:col-span-3">
                    <SectionCard title="Live Preview — Actual Print Output" icon="👁️">
                        {/* preview type switcher */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setPreviewType('a4')}
                                    className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                                        previewType === 'a4'
                                            ? 'bg-white text-blue-700 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    🖨️ A4
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewType('pos')}
                                    className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                                        previewType === 'pos'
                                            ? 'bg-white text-emerald-700 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    🧾 Thermal
                                </button>
                            </div>

                            {/* full preview button */}
                            <button
                                type="button"
                                onClick={openFullPreview}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                                Full Size
                            </button>
                        </div>

                        {/* preview area */}
                        <div className={`rounded-xl overflow-hidden border border-slate-200 ${
                            previewType === 'a4'
                                ? 'bg-slate-200'
                                : 'bg-slate-700'
                        }`}>
                            {previewType === 'a4' ? (
                                // A4 — scaled iframe, দেখতে A4 paper এর মতো
                                <div style={{ padding: '12px 16px' }}>
                                    {/* paper shadow */}
                                    <div style={{
                                        background: '#fff',
                                        borderRadius: 4,
                                        boxShadow: '0 4px 24px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.08)',
                                        overflow: 'hidden',
                                    }}>
                                        <A4Preview htmlContent={a4HTML} />
                                    </div>
                                </div>
                            ) : (
                                // Thermal — printer থেকে বের হওয়ার মতো দেখায়
                                <ThermalPreview htmlContent={thermalHTML} />
                            )}
                        </div>

                        <p className="text-[10px] text-slate-400 mt-2.5 text-center">
                            template file এ পরিবর্তন করলে reload করলেই এখানে দেখা যাবে •{' '}
                            <button type="button" onClick={openFullPreview} className="underline hover:text-slate-600 transition-colors">
                                full size preview
                            </button>
                        </p>
                    </SectionCard>
                </div>
            </div>
        </div>
    );
};

export default InvoiceSettings;
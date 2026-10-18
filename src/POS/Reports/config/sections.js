// src/POS/Reports/config/sections.js
/**
 * 📑 Section & Period configuration
 */

// ═══════════════════════════════════════════════════════════════════
// 🔹 TOP-LEVEL SECTIONS (Landing navigation)
// ═══════════════════════════════════════════════════════════════════
export const TOP_SECTIONS = [
    {
        key: 'profit',
        label: 'Profit Summary',
        icon: '📊',
        color: '#0ea5e9',
        description: 'Daily / Monthly / Yearly / All-Time লাভের হিসাব',
        apiType: 'profit-summary',
    },
    {
        key: 'product',
        label: 'Product Profit',
        icon: '📦',
        color: '#f59e0b',
        description: 'প্রতিটা পণ্যের cumulative লাভ',
        apiType: 'product-profit',
    },
    {
        key: 'inventory',
        label: 'Inventory Valuation',
        icon: '🏪',
        color: '#8b5cf6',
        description: 'মাসিক / বাৎসরিক স্টক মূল্যায়ন',
        apiType: 'inventory',
    },
    {
        key: 'growth',
        label: 'Business Growth',
        icon: '📈',
        color: '#10b981',
        description: 'ব্যবসার সম্পদ, growth, ROA',
        apiType: 'growth',
    },
    {
        key: 'supplier',
        label: 'Supplier Reports',
        icon: '🚚',
        color: '#f97316',
        description: 'সাপ্লায়ার অনুযায়ী কেনাকাটা ও বাকি রিপোর্ট',
        apiType: 'supplier-profit',
    },
    {
        key: 'brand',
        label: 'Brand Reports',
        icon: '🏷️',
        color: '#a855f7',
        description: 'ব্র্যান্ড অনুযায়ী বিক্রি, লাভ ও লাইভ স্টক ভ্যালু',
        apiType: 'brand-profit',
    },
    {
        key: 'customer',
        label: 'Customer Reports',
        icon: '👥',
        color: '#059669',
        description: 'কাস্টমার অনুযায়ী বিক্রয়, লাভ ও বকেয়া রিপোর্ট',
        apiType: 'customer-profit',
    },
];
// ═══════════════════════════════════════════════════════════════════
// 🔹 PERIOD TABS BY SECTION — কোন section-এ কোন period available
// ═══════════════════════════════════════════════════════════════════
export const PERIOD_TABS_BY_SECTION = {
    profit:    ['daily', 'monthly', 'yearly', 'all_time'],
    product:   [],                                  // period নেই
    inventory: ['monthly', 'yearly'],               // all_time নেই
    growth:    ['monthly', 'yearly', 'all_time'],
    supplier:  [],
    brand:     [],
    customer:  [],
};

/** Section এর default period (section switch-এ auto select হবে) */
export const DEFAULT_PERIOD_BY_SECTION = {
    profit:    'daily',
    product:   null,
    inventory: 'monthly',
    growth:    'monthly',
    supplier:  null,
    brand:     null,
    customer:  null,
};
// ═══════════════════════════════════════════════════════════════════
// 🔹 PERIOD TABS — Profit Summary-এর জন্য
// ═══════════════════════════════════════════════════════════════════
export const PERIOD_TABS = [
    { key: 'daily',    label: 'Daily',    icon: '📅' },
    { key: 'monthly',  label: 'Monthly',  icon: '🗓️' },
    { key: 'yearly',   label: 'Yearly',   icon: '📆' },
    { key: 'all_time', label: 'All-Time', icon: '♾️' },
];

// ═══════════════════════════════════════════════════════════════════
// 🔹 SECTION TABS — Profit Summary-এর ভেতরে section split
// ═══════════════════════════════════════════════════════════════════
export const SECTION_TABS = [
    { key: 'all',       label: 'All',          icon: '🎯' },
    { key: 'profit',    label: 'Profit',       icon: '📊' },
    { key: 'sale',      label: 'Sale',         icon: '🛒' },
    { key: 'purchase',  label: 'Purchase',     icon: '📦' },
    { key: 'cash_due',  label: 'Cash & Due',   icon: '💰' },
    { key: 'investment', label: 'Investment',  icon: '💼' },
    { key: 'notes',     label: 'Notes',        icon: '📝' },
];

// ═══════════════════════════════════════════════════════════════════
// 🔹 FORMAT HELPERS — value display
// ═══════════════════════════════════════════════════════════════════
export const fmtCurrency = (v) => {
    if (v === null || v === undefined || v === '') return '—';
    return `৳ ${parseFloat(v).toLocaleString('en-BD', {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
    })}`;
};

export const fmtNumber = (v) => {
    if (v === null || v === undefined || v === '') return '—';
    return parseFloat(v).toLocaleString('en-BD', { maximumFractionDigits: 2 });
};

export const fmtInt = (v) => {
    if (v === null || v === undefined || v === '') return '—';
    return parseInt(v, 10).toLocaleString('en-BD');
};

export const fmtPercent = (v) => {
    if (v === null || v === undefined || v === '') return '—';
    return `${parseFloat(v).toFixed(2)}%`;
};

export const fmtDateTime = (v) => {
    if (!v) return '—';
    try {
        return new Date(v).toLocaleString('en-BD', {
            dateStyle: 'medium', timeStyle: 'short',
        });
    } catch {
        return v;
    }
};

/** Column type অনুযায়ী format */
export const formatValue = (value, type) => {
    switch (type) {
        case 'currency': return fmtCurrency(value);
        case 'number':   return fmtNumber(value);
        case 'int':      return fmtInt(value);
        case 'percent':  return fmtPercent(value);
        case 'date':     return fmtDateTime(value);
        default:         return value ?? '—';
    }
};
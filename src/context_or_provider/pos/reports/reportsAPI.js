// import api from "../posApi";
//
// export const posReportsAPI = {
//     getSales: (params) => api.get("/api/sale/sales/", { params }),
//     getCustomers: (params) => api.get("/api/sale/customers/", { params }),
//     getSalesReturn: (params) => api.get("/api/sale/sale-returns/", { params }),
//     getPurchases: (params) => api.get("/api/purchase/purchases/", { params }),
//     getSuppliers: (params) => api.get("/api/purchase/suppliers/", { params }),
//     getPurchaseReturn: (params) => api.get("/api/purchase/purchase-returns/", { params }),
//     getProducts: (params) => api.get("/api/products/product/", { params }),
//     getCategories: (params) => api.get("/api/products/category/", { params }),
//     getSubcategories: (params) => api.get("/api/products/subcategory/", { params }),
//     getBrands: (params) => api.get("/api/products/brand/", { params }),
//     getSpecifications: (params) => api.get("/api/products/specification/", { params }),
//     getDosageForms: (params) => api.get("/api/products/dosage-form/", { params }),
//     getDamageStock: (params) => api.get("/api/products/damage-stock/", { params }),
//     getExpenses: (params) => api.get("/api/cashbox/expenses/", { params }),
//     getIncomes: (params) => api.get("/api/cashbox/income/", { params }),
//     getCashbox: (params) => api.get("/api/cashbox/cashbox/", { params }),
//     getProfitSummary: (params) => api.get("/api/reports/profit/summary/", { params }),
//     getProductProfits: (params) => api.get("/api/reports/profit/product_profits/", { params }),
//     getTopProducts: (params) => api.get("/api/reports/profit/top_products/", { params }),
//     getDateWiseProfit: (date) => api.get("/api/reports/profit/date_wise/", { params: { date } }),
//     recalculateProfit: () => api.post("/api/reports/profit/recalculate/"),
//     updateBusinessNote: (data) => api.post("/api/reports/profit/update_note/", data),
//     getInventoryValuationCurrent: () => api.get("/api/reports/inventory-valuation/current/"),
//     getBusinessGrowthCurrent: () => api.get("/api/reports/business-growth/current/"),
// };



// src/context_or_provider/pos/reports/reportsAPI.js

import api from "../posApi";

export const posReportsAPI = {
    // ═══════════════════════════════════════════════════════════════
    // 🆕 NEW REPORT ENDPOINTS — নতুন Backend Design অনুযায়ী
    // ═══════════════════════════════════════════════════════════════

    // ─── Profit Summary (period-wise) ───────────────────────────────
    // periodType: 'daily' | 'monthly' | 'yearly' | 'all-time'
    getProfitSummaryList: (periodType, params = {}) =>
        api.get(`/api/reports/profit-summary/${periodType}/`, { params }),

    getProfitSummaryDetail: (periodType, periodKey) =>
        api.get(`/api/reports/profit-summary/${periodType}/${periodKey}/`),

    // 🆕 Business Note আপডেট — PATCH দিয়ে নতুন note যোগ হয়
    updateBusinessNote: (periodType, periodKey, note) =>
        api.patch(
            `/api/reports/profit-summary/${periodType}/${periodKey}/`,
            { business_note: note }
        ),

    // চলতি daily/monthly/yearly/all_time-এর snapshot
    getProfitOverview: () =>
        api.get("/api/reports/profit-summary/overview/"),

    // 🆕 PDF Export — response blob (file download)
    downloadPdf: (periodType, params = {}) =>
        api.get("/api/reports/profit-summary/export/pdf/", {
            params: { period_type: periodType, ...params },
            responseType: "blob",   // ← PDF-এর জন্য জরুরি
        }),

    // ─── Product Profit (cumulative, period নেই) ────────────────────
    getProductProfits: (params = {}) =>
        api.get("/api/reports/product-profit/", { params }),

    getProductProfitTop: (params = {}) =>
        api.get("/api/reports/product-profit/top/", { params }),

    getProductProfitDetail: (id) =>
        api.get(`/api/reports/product-profit/${id}/`),

    // ─── Inventory Valuation (monthly/yearly snapshot) ──────────────
    getInventoryMonthly: (params = {}) =>
        api.get("/api/reports/inventory-valuation/monthly/", { params }),

    getInventoryYearly: (params = {}) =>
        api.get("/api/reports/inventory-valuation/yearly/", { params }),

    getInventoryLatest: () =>
        api.get("/api/reports/inventory-valuation/latest/"),

    // ─── Business Growth (monthly/yearly/all-time) ──────────────────
    getGrowthMonthly: (params = {}) =>
        api.get("/api/reports/business-growth/monthly/", { params }),

    getGrowthYearly: (params = {}) =>
        api.get("/api/reports/business-growth/yearly/", { params }),

    getGrowthAllTime: () =>
        api.get("/api/reports/business-growth/all-time/"),

    // ─── Utility ────────────────────────────────────────────────────
    recalculateProfit: () =>
        api.post("/api/reports/profit/recalculate/"),

    // ═══════════════════════════════════════════════════════════════
    // 📦 SUPPORT ENDPOINTS — Filters/Dropdowns-এর জন্য দরকার
    // (customer/supplier/product/category dropdown populate করতে)
    // ═══════════════════════════════════════════════════════════════
    getCustomers: (params = {}) =>
        api.get("/api/sale/customers/", { params }),

    getSuppliers: (params = {}) =>
        api.get("/api/purchase/suppliers/", { params }),

    getProducts: (params = {}) =>
        api.get("/api/products/product/", { params }),

    getCategories: (params = {}) =>
        api.get("/api/products/category/", { params }),

    getSubcategories: (params = {}) =>
        api.get("/api/products/subcategory/", { params }),

    getBrands: (params = {}) =>
        api.get("/api/products/brand/", { params }),

    getSpecifications: (params = {}) =>
        api.get("/api/products/specification/", { params }),

    getDosageForms: (params = {}) =>
        api.get("/api/products/dosage-form/", { params }),
};
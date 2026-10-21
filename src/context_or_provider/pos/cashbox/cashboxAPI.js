import api from "../posApi";

export const posCashboxAPI = {
    // ===== CASHBOX =====
    // Get all transactions (exhaustively from cashbox)
    getAllCashbox: (params) => api.get("/api/cashbox/cashbox/", { params }),

    // ===== INCOME =====
    // Get all income entries
    getAllIncome: (params) => api.get("/api/cashbox/income/", { params }),
    // Create new income
    createIncome: (data) => api.post("/api/cashbox/income/", data),
    // Update income
    updateIncome: (id, data) => api.patch(`/api/cashbox/income/${id}/`, data),
    // Delete income
    deleteIncome: (id) => api.delete(`/api/cashbox/income/${id}/`),

    // ===== EXPENSE =====
    // Get all expense entries
    getAllExpense: (params) => api.get("/api/cashbox/expenses/", { params }),
    // Create new expense
    createExpense: (data) => api.post("/api/cashbox/expenses/", data),
    // Update expense
    updateExpense: (id, data) => api.patch(`/api/cashbox/expenses/${id}/`, data),
    // Delete expense
    deleteExpense: (id) => api.delete(`/api/cashbox/expenses/${id}/`),

    // ===== INCOME CATEGORIES =====
    getAllIncomeCategories: (params) => api.get("/api/cashbox/income-categories/", { params }),
    createIncomeCategory: (data) => api.post("/api/cashbox/income-categories/", data),
    updateIncomeCategory: (id, data) => api.patch(`/api/cashbox/income-categories/${id}/`, data),
    deleteIncomeCategory: (id) => api.delete(`/api/cashbox/income-categories/${id}/`),

    // ===== EXPENSE CATEGORIES =====
    getAllExpenseCategories: (params) => api.get("/api/cashbox/expense-categories/", { params }),
    createExpenseCategory: (data) => api.post("/api/cashbox/expense-categories/", data),
    updateExpenseCategory: (id, data) => api.patch(`/api/cashbox/expense-categories/${id}/`, data),
    deleteExpenseCategory: (id) => api.delete(`/api/cashbox/expense-categories/${id}/`),

    // ===== REPORTS =====
    // Get summary/report
    getReport: (params) => api.get("/api/cashbox/", { params }),
    // Get detailed financial report
    getDetailedReport: (params) => api.get("/api/cashbox/cashbox/report/", { params }),
    // Get dashboard data (opening/closing balance, breakdowns, transactions by date range)
    getDashboard: (params) => api.get("/api/cashbox/cashbox/dashboard/", { params }),

    // ===== DAILY BALANCE =====
    // Get daily balance history (optional filters: ?date, ?ordering=-date)
    getDailyBalance: (params) => api.get("/api/cashbox/daily-balance/", { params }),
    // Trigger full recalculation of all DailyBalance records from CashBox
    recalculateAllDailyBalances: () => api.get("/api/cashbox/daily-balance/recalculate_all/"),


    getBalances: () => api.get("/api/cashbox/cashbox/balances/"),
    // ===== FUND TRANSFERS =====
    getFundTransfers: (params) => api.get("/api/cashbox/fund-transfers/", { params }),
    createFundTransfer: (data) => api.post("/api/cashbox/fund-transfers/", data),

    getCalendarDays: (params) => api.get("/api/cashbox/cashbox/calendar_days/", { params }),
    getBusinessDays: (params) => api.get("/api/cashbox/cashbox/business_days/", { params }),
};

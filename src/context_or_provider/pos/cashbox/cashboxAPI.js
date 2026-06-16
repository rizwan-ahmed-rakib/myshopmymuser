import api from "../posApi";

export const posCashboxAPI = {
    // Get all transactions (exhaustively from cashbox)
    getAllCashbox: (params) => api.get("/api/cashbox/cashbox/", { params }),

    // Get all income entries
    getAllIncome: (params) => api.get("/api/cashbox/income/", { params }),

    // Get all expense entries
    getAllExpense: (params) => api.get("/api/cashbox/expenses/", { params }),

    // Get summary/report
    getReport: (params) => api.get("/api/cashbox/", { params }),

    // Get detailed financial report
    getDetailedReport: (params) => api.get("/api/cashbox/cashbox/report/", { params }),

    // Create new income
    createIncome: (data) => api.post("/api/cashbox/income/", data),

    // Create new expense
    createExpense: (data) => api.post("/api/cashbox/expenses/", data),

    // Update income
    updateIncome: (id, data) => api.patch(`/api/cashbox/income/${id}/`, data),

    // Delete income
    deleteIncome: (id) => api.delete(`/api/cashbox/income/${id}/`),

    // Update expense
    updateExpense: (id, data) => api.patch(`/api/cashbox/expenses/${id}/`, data),

    // Delete expense
    deleteExpense: (id) => api.delete(`/api/cashbox/expenses/${id}/`),
};

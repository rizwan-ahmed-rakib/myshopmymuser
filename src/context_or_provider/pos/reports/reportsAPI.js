import api from "../posApi";

export const posReportsAPI = {
    getSales: (params) => api.get("/api/sale/sales/", { params }),
    getCustomers: (params) => api.get("/api/sale/customers/", { params }),
    getSalesReturn: (params) => api.get("/api/sale/sale-returns/", { params }),
    getPurchases: (params) => api.get("/api/purchase/purchases/", { params }),
    getSuppliers: (params) => api.get("/api/purchase/suppliers/", { params }),
    getPurchaseReturn: (params) => api.get("/api/purchase/purchase-returns/", { params }),
    getProducts: (params) => api.get("/api/products/product/", { params }),
    getCategories: (params) => api.get("/api/products/category/", { params }),
    getSubcategories: (params) => api.get("/api/products/subcategory/", { params }),
    getBrands: (params) => api.get("/api/products/brand/", { params }),
    getDamageStock: (params) => api.get("/api/products/damage-stock/", { params }),
    getExpenses: (params) => api.get("/api/cashbox/expenses/", { params }),
    getIncomes: (params) => api.get("/api/cashbox/income/", { params }),
    getCashbox: (params) => api.get("/api/cashbox/cashbox/", { params }),
};

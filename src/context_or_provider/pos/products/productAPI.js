import api from "../posApi";

export const posProductAPI = {
    // Get all products
    getAll: () => api.get("/api/products/product/"),
    // getAll: () => api.get("/api/products/category/"),


        // 🔍 Search (autocomplete)
    search: (query) =>
        api.get(`/api/products/product/?search=${query}`),

    // Get single employee by ID
    getById: (id) => api.get(`/api/products/product/${id}/`),
    // getById: (id) => api.get(`/api/products/category/${id}/`),

    // Create new employee
    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'user' && typeof data[key] === 'object') {
                Object.keys(data[key]).forEach(userKey => {
                    if (data[key][userKey] !== null && data[key][userKey] !== undefined) {
                        formData.append(`user.${userKey}`, data[key][userKey]);
                    }
                });
            } else if (key === 'image' && data[key]) {
                formData.append(key, data[key]);
            } else {
                if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
                    formData.append(key, data[key]);
                }
            }
        });
        return api.post("/api/products/product/", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    // Update employee
    update: (id, data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'image' && data[key]) {
                formData.append(key, data[key]);
            } else if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
                formData.append(key, data[key]);
            }
        });
        return api.patch(`/api/products/product/${id}/`, formData, {
        // return api.patch(`/api/products/category/${id}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    // Delete employee
    delete: (id) => api.delete(`/api/products/product/${id}/`),
    // delete: (id) => api.delete(`/api/products/category/${id}/`),
};
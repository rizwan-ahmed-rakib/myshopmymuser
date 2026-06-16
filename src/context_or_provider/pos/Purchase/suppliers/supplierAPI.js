import api from "../../posApi";

export const posSupplierAPI = {
    // Get all employees
    getAll: () => api.get("/api/purchase/suppliers/"),

    // Get single employee by ID
    getById: (id) => api.get(`/api/purchase/suppliers/${id}/`),

    // 🔍 Search (autocomplete)
    search: (query) =>
        api.get(`/api/purchase/suppliers?search=${query}`),

    // Create new employee


    // create: (data) => {
    //     const formData = new FormData();
    //     Object.keys(data).forEach(key => {
    //         if (key === 'user' && typeof data[key] === 'object') {
    //             Object.keys(data[key]).forEach(userKey => {
    //                 formData.append(`user.${userKey}`, data[key][userKey]);
    //             });
    //         } else if (key === 'image' && data[key]) {
    //             formData.append(key, data[key]);
    //         } else {
    //             formData.append(key, data[key]);
    //         }
    //     });
    //     return api.post("/api/products/brand/", formData, {
    //         headers: { "Content-Type": "multipart/form-data" }
    //     });
    // },


    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'image' && data[key]) {
                formData.append(key, data[key]);
            } else {
                formData.append(key, data[key]);
            }
        });
        return api.post("/api/purchase/suppliers/", formData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    },


    // Update employee
    update: (id, data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'image' && data[key]) {
                formData.append(key, data[key]);
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        return api.patch(`/api/purchase/suppliers/${id}/`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    },

    // Delete employee
    delete: (id) => api.delete(`/api/purchase/suppliers/${id}/`),
};
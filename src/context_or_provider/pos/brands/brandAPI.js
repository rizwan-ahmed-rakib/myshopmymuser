import api from "../posApi";
export const posBrandAPI = {
    // Get all employees
    getAll: () => api.get("/api/products/brand/"),

    // Get single employee by ID
    getById: (id) => api.get(`/api/products/brand/${id}/`),

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
        return api.post("/api/products/brand/", formData, {
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
        return api.patch(`/api/products/brand/${id}/`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    },

    // Delete employee
    delete: (id) => api.delete(`/api/products/brand/${id}/`),
};
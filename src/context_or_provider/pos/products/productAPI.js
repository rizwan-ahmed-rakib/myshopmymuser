// import api from "../posApi";
//
// export const posProductAPI = {
//     // Get all products
//     getAll: () => api.get("/api/products/product/"),
//     // getAll: () => api.get("/api/products/category/"),
//
//
//         // 🔍 Search (autocomplete)
//     search: (query) =>
//         api.get(`/api/products/product/?search=${query}`),
//
//     // Get single employee by ID
//     getById: (id) => api.get(`/api/products/product/${id}/`),
//     // getById: (id) => api.get(`/api/products/category/${id}/`),
//
//     // Create new employee
//     create: (data) => {
//         const formData = new FormData();
//         Object.keys(data).forEach(key => {
//             if (key === 'user' && typeof data[key] === 'object') {
//                 Object.keys(data[key]).forEach(userKey => {
//                     if (data[key][userKey] !== null && data[key][userKey] !== undefined) {
//                         formData.append(`user.${userKey}`, data[key][userKey]);
//                     }
//                 });
//             } else if (key === 'image' && data[key]) {
//                 formData.append(key, data[key]);
//             } else {
//                 if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
//                     formData.append(key, data[key]);
//                 }
//             }
//         });
//         return api.post("/api/products/product/", formData, {
//             headers: { "Content-Type": "multipart/form-data" }
//         });
//     },
//
//     // Update employee
//     update: (id, data) => {
//         const formData = new FormData();
//         Object.keys(data).forEach(key => {
//             if (key === 'image' && data[key]) {
//                 formData.append(key, data[key]);
//             } else if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
//                 formData.append(key, data[key]);
//             }
//         });
//         return api.patch(`/api/products/product/${id}/`, formData, {
//         // return api.patch(`/api/products/category/${id}/`, formData, {
//             headers: { "Content-Type": "multipart/form-data" }
//         });
//     },
//
//     // Delete employee
//     delete: (id) => api.delete(`/api/products/product/${id}/`),
//     // delete: (id) => api.delete(`/api/products/category/${id}/`),
// };


// context_or_provider/pos/products/productAPI.js
import api from "../posApi";

export const posProductAPI = {
    /**
     * Paginated product list.
     * @param {Object} params - { search, page, page_size, category, brand, ... }
     * @returns {Promise} axios response with .data = { count, next, previous, results }
     */
    getAll: (params = {}) =>
        api.get("/api/products/product/", {
            params: {
                page: 1,
                page_size: 50,
                ...params,
            },
        }),

    /**
     * Search + filter — server-side.
     */
    search: (query = "", params = {}) =>
        api.get("/api/products/product/", {
            params: {
                search: query,
                page: 1,
                page_size: 50,
                ...params,
            },
        }),

    getById: (id) => api.get(`/api/products/product/${id}/`),

    /**
     * 🆕 Bulk fetch by IDs — Single API call, exact products only
     * @param {Array<number>} ids - Product IDs
     * @returns {Promise} axios response with .data = { results: [...] }
     */
    getByIds: (ids = []) => {
        if (!ids.length) return Promise.resolve({data: {results: []}});
        return api.get("/api/products/product/", {
            params: {
                ids: ids.join(","),
                page_size: ids.length,   // exact count
                page: 1,
            },
        });
    },

    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === "user" && typeof data[key] === "object") {
                Object.keys(data[key]).forEach((userKey) => {
                    if (data[key][userKey] !== null && data[key][userKey] !== undefined) {
                        formData.append(`user.${userKey}`, data[key][userKey]);
                    }
                });
            } else if (key === "image" && data[key]) {
                formData.append(key, data[key]);
            } else {
                if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
                    formData.append(key, data[key]);
                }
            }
        });
        return api.post("/api/products/product/", formData, {
            headers: {"Content-Type": "multipart/form-data"},
        });
    },

    update:
        (id, data) => {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                if (key === "image" && data[key]) {
                    formData.append(key, data[key]);
                } else if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
                    formData.append(key, data[key]);
                }
            });
            return api.patch(`/api/products/product/${id}/`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });
        },

    delete:
        (id) => api.delete(`/api/products/product/${id}/`),
};
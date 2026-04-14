// utils/api.js
import axios from "axios";
import BASE_URL_of_POS from "../../../../posConfig";

// Create axios instance with base URL
const api = axios.create({
    baseURL: BASE_URL_of_POS,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor for auth token if needed
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API endpoints
// export const posPurchaseProductAPI = {
//     // Get all employees
//     getAll: () => api.get("/api/purchase/purchases/"),
//     // getAll: () => api.get("/api/products/category/"),
//
//     // Get single employee by ID
//     getById: (id) => api.get(`/api/purchase/purchases/${id}/`),
//     // getById: (id) => api.get(`/api/products/category/${id}/`),
//
//     // Create new employee
//     create: (data) => {
//         const formData = new FormData();
//         Object.keys(data).forEach(key => {
//             if (key === 'user' && typeof data[key] === 'object') {
//                 Object.keys(data[key]).forEach(userKey => {
//                     formData.append(`user.${userKey}`, data[key][userKey]);
//                 });
//             } else if (key === 'image' && data[key]) {
//                 formData.append(key, data[key]);
//             } else {
//                 formData.append(key, data[key]);
//             }
//         });
//         return api.post("/api/purchase/purchases/", formData, {
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
//             } else if (data[key] !== null && data[key] !== undefined) {
//                 formData.append(key, data[key]);
//             }
//         });
//         return api.patch(`/api/purchase/purchases/${id}/`, formData, {
//         // return api.patch(`/api/products/category/${id}/`, formData, {
//             headers: { "Content-Type": "multipart/form-data" }
//         });
//     },
//
//     // Delete employee
//     delete: (id) => api.delete(`/api/purchase/purchases/${id}/`),
//     // delete: (id) => api.delete(`/api/products/category/${id}/`),
// };


// utils/api.js
export const posPurchaseReturnAPI = {

    getAll: () => api.get("/api/purchase/purchase-returns/"),

    getById: (id) => api.get(`/api/purchase/purchase-returns/${id}/`),

    // ✅ FIXED CREATE
    create: (data) => {
        return api.post(
            "/api/purchase/purchase-returns/",
            data,
            { headers: { "Content-Type": "application/json" } }
        );
    },

    // ✅ FIXED UPDATE
    update: (id, data) => {
        return api.patch(
            `/api/purchase/purchase-returns/${id}/`,
            data,
            { headers: { "Content-Type": "application/json" } }
        );
    },

    delete: (id) => api.delete(`/api/purchase/purchase-returns/${id}/`),
};

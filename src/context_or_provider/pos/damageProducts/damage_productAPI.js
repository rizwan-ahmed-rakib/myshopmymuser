// utils/api.js
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";

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
export const posDamageProductAPI = {
    // Get all products
    getAll: () => api.get("/api/products/damage-stock/"),
    // getAll: () => api.get("/api/products/category/"),


        // 🔍 Search (autocomplete)
    search: (query) =>
        api.get(`/api/products/damage-stock/?search=${query}`),

    // Get single employee by ID
    getById: (id) => api.get(`/api/products/damage-stock/${id}/`),
    // getById: (id) => api.get(`/api/products/category/${id}/`),

    // Create new employee
    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'user' && typeof data[key] === 'object') {
                Object.keys(data[key]).forEach(userKey => {
                    formData.append(`user.${userKey}`, data[key][userKey]);
                });
            } else if (key === 'image' && data[key]) {
                formData.append(key, data[key]);
            } else {
                formData.append(key, data[key]);
            }
        });
        return api.post("/api/products/damage-stock/", formData, {
        // return api.post("/api/products/category/", formData, {
        //     headers: { "Content-Type": "multipart/form-data" }
            headers: { "Content-Type": "application/json", }
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
        return api.patch(`/api/products/damage-stock/${id}/`, formData, {
        // return api.patch(`/api/products/category/${id}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    // Delete employee
    delete: (id) => api.delete(`/api/products/damage-stock/${id}/`),
    // delete: (id) => api.delete(`/api/products/category/${id}/`),


    // Get product damage history
    getByProduct: (productId) => api.get(`/api/products/damage-stock/?product=${productId}`),

    // Get damage summary
    // getSummary: (params) => api.get(`${BASE_URL}/summary/`, { params }),

    // Get supplier damages
    getBySupplier: (supplierId) => api.get(`/api/products/damage-stock/?supplier=${supplierId}`),

    // Get customer damages
    getByCustomer: (customerId) => api.get(`/api/products/damage-stock/?customer=${customerId}`),
};


///////////////////////////////////////////////





//////////////////////////////////////

// damage_productAPI.js
// import axios from 'axios';
// import BASE_URL_of_POS from '../../../posConfig';
//
// const BASE_URL = `${BASE_URL_of_POS}/api/products/damage-stock`;
//
// export const posDamageProductAPI = {
//     // Get all damage entries with filters
//     getAll: (params = {}) => axios.get(BASE_URL, { params }),
//
//     // Get single damage entry
//     getById: (id) => axios.get(`${BASE_URL}/${id}/`),
//
//     // Create new damage entry
//     create: (data) => axios.post(BASE_URL, data),
//
//     // Update damage entry
//     update: (id, data) => axios.patch(`${BASE_URL}/${id}/`, data),
//
//     // Delete damage entry
//     delete: (id) => axios.delete(`${BASE_URL}/${id}/`),
//
//     // Get product damage history
//     getByProduct: (productId) => axios.get(`${BASE_URL}/?product=${productId}`),
//
//     // Get damage summary
//     getSummary: (params) => axios.get(`${BASE_URL}/summary/`, { params }),
//
//     // Get supplier damages
//     getBySupplier: (supplierId) => axios.get(`${BASE_URL}/?supplier=${supplierId}`),
//
//     // Get customer damages
//     getByCustomer: (customerId) => axios.get(`${BASE_URL}/?customer=${customerId}`),
// };
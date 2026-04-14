// import axiosInstance from "../../../myshop/api/axiosInstance";
//
// const API_URL = "/api/products/product/";
//
// export const posProductAPI = {
//     getAll: () => {
//         return axiosInstance.get(API_URL);
//     },
//     getById: (id) => {
//         return axiosInstance.get(`${API_URL}${id}/`);
//     },
//     create: (productData) => {
//         return axiosInstance.post(API_URL, productData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         });
//     },
//     update: (id, productData) => {
//         return axiosInstance.patch(`${API_URL}${id}/`, productData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         });
//     },
//     delete: (id) => {
//         return axiosInstance.delete(`${API_URL}${id}/`);
//     },
// };


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
import axios from "axios";
import BASE_URL_of_POS from "../../../../posConfig";

const api = axios.create({
    baseURL: BASE_URL_of_POS,
    headers: {
        "Content-Type": "application/json",
    },
});

export const posDueCollectionAPI = {
    getAll: () => api.get("/api/sale/due-collections/"),
    getById: (id) => api.get(`/api/sale/due-collections/${id}/`),
    create: (data) => api.post("/api/sale/due-collections/", data),
    update: (id, data) => api.patch(`/api/sale/due-collections/${id}/`, data),
    delete: (id) => api.delete(`/api/sale/due-collections/${id}/`),
    search: (query) => api.get(`/api/sale/due-collections/?search=${query}`),
};

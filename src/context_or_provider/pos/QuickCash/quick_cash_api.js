import api from "../posApi";

const API_URL = "/api/pos-settings/quick-cash/";

export const getQuickCash = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

export const createQuickCash = async (formData) => {
    const response = await api.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateQuickCash = async (id, formData) => {
    const response = await api.patch(`${API_URL}${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteQuickCash = async (id) => {
    const response = await api.delete(`${API_URL}${id}/`);
    return response.data;
};

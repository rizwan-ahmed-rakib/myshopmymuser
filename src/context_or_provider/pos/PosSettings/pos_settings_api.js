import api from "../posApi";
const API_URL = "/api/pos-settings/general/";

export const getPosSettings = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

export const updatePosSettings = async (formData) => {
    const response = await api.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

import api from "../posApi";

export const posSubCategoryAPI = {
    // Get all categories
    getAll: () => api.get("/api/products/subcategory/"),

    // Get single category by ID
    getById: (id) => api.get(`/api/products/subcategory/${id}/`),

    // Create new category
    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'image' && data[key]) {
                formData.append(key, data[key]);
            } else {
                if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
                    formData.append(key, data[key]);
                }
            }
        });
        return api.post("/api/products/subcategory/", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    // Update category
    update: (id, data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'image' && data[key]) {
                formData.append(key, data[key]);
            } else if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
                formData.append(key, data[key]);
            }
        });
        return api.patch(`/api/products/subcategory/${id}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    // Delete category
    delete: (id) => api.delete(`/api/products/subcategory/${id}/`),
};

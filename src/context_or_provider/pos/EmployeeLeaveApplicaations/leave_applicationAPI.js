import api from "../posApi";

export const leaveApplicationAPI = {
    // Get all salary advances
    getAll: () => api.get("/api/users/leave-applications/"),

    // Get single salary advance by ID
    getById: (id) => api.get(`/api/users/leave-applications/${id}/`),

    // Create new salary advance
    create: (data) => api.post("/api/users/leave-applications/", data),

    // Update salary advance
    update: (id, data) => api.patch(`/api/users/leave-applications/${id}/`, data),

    // Delete salary advance
    delete: (id) => api.delete(`/api/users/leave-applications/${id}/`),

    // Get salary advances by user
    getByUser: (userId) => api.get(`/api/users/leave-applications/?user=${userId}`),

    // Get approved salary advances
    getApproved: () => api.get("/api/users/leave-applications/?is_approved=true"),

    // Get pending salary advances
    getPending: () => api.get("/api/users/leave-applications/?is_approved=false"),

    // Approve salary advance
    approve: (id, data) => api.patch(`/api/users/leave-applications/${id}/`, {
        is_approved: true,
        approved_date: data?.approved_date || new Date().toISOString().split('T')[0]
    }),
};

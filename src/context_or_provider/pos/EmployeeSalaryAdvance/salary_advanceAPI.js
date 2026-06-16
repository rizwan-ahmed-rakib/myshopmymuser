import api from "../posApi";

export const salaryAdvanceAPI = {
    // Get all salary advances
    getAll: () => api.get("/api/users/salary-advances/"),

    // Get single salary advance by ID
    getById: (id) => api.get(`/api/users/salary-advances/${id}/`),

    // Create new salary advance
    create: (data) => api.post("/api/users/salary-advances/", data),

    // Update salary advance
    update: (id, data) => api.patch(`/api/users/salary-advances/${id}/`, data),

    // Delete salary advance
    delete: (id) => api.delete(`/api/users/salary-advances/${id}/`),

    // Get salary advances by user
    getByUser: (userId) => api.get(`/api/users/salary-advances/?user=${userId}`),

    // Get approved salary advances
    getApproved: () => api.get("/api/users/salary-advances/?is_approved=true"),

    // Get pending salary advances
    getPending: () => api.get("/api/users/salary-advances/?is_approved=false"),

    // Approve salary advance
    approve: (id, data) => api.patch(`/api/users/salary-advances/${id}/`, {
        is_approved: true,
        approved_date: data?.approved_date || new Date().toISOString().split('T')[0]
    }),
};

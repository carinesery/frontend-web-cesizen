import apiClient from './apiClient.js';

export const userService = {
    getAll: async () => {
        const response = await apiClient.get("/admin/users");
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/admin/users/${id}`);
        return response.data;
    },

    create: async (userData) => {
        const response = await apiClient.post("/admin/users", userData);
        return response.data;
    },

    confirmEmail: async(token) => {
        const response = await apiClient.get(`/auth/confirm-email?token=${encodeURIComponent(token)}`);
        return response.data;
    },

    acceptLegal: async (termsConsent, privacyConsent, legalToken) => {
        const response = await apiClient.post(
            "/auth/accept-legal",
            {
                termsConsent,
                privacyConsent,
            },
            {
                headers: {
                    Authorization: `Bearer ${legalToken}`,
                },
            }
        );
        return response.data;
    },

    update: async (id, userData) => {
        const response = await apiClient.patch(`/admin/users/${id}`, userData);
        return response.data;
    },

    setActiveStatus: async (id, isActive) => {
        const response = await apiClient.patch(`/admin/users/${id}/status`, { isActive });
        return response.data;
    },

    delete: async(id) => {
        const response = await apiClient.delete(`/admin/users/${id}`);
        return response.data;
    }
}
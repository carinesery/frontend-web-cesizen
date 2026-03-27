import apiClient from './apiClient.js';

export const emotionService = {

    getAll: async () => {
        const response = await apiClient.get('/emotions');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/emotions/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/emotions', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.patch(`/emotions/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/emotions/${id}`);
        return response.data;
    },

}

export default emotionService;
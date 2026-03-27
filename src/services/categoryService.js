import apiClient from './apiClient.js';

export const categoryService = {
  getAll: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await apiClient.get(`/categories/${slug}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },

  update: async (slug, data) => {
    const response = await apiClient.patch(`/categories/${slug}`, data);
    return response.data;
  },

  delete: async (slug) => {
    const response = await apiClient.delete(`/categories/${slug}`);
    return response.data;
  },
};

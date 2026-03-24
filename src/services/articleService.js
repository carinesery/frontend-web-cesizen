import apiClient from './apiClient.js';

export const articleService = {
  getAll: async () => {
    const response = await apiClient.get('/articles');
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await apiClient.get(`/articles/${slug}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/articles', data);
    return response.data;
  },

  update: async (slug, data) => {
    const response = await apiClient.patch(`/articles/${slug}`, data);
    return response.data;
  },

  delete: async (slug) => {
    const response = await apiClient.delete(`/articles/${slug}`);
    return response.data;
  },
};

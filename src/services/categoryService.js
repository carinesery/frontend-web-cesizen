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

/** 
router.get("/", authMiddleware, roleMiddleware(UserRoleEnum.ADMIN), getAllCategoriesController);
router.get("/:slug", authMiddleware, roleMiddleware(UserRoleEnum.ADMIN), getCategoryController);
router.post("/", authMiddleware, roleMiddleware(UserRoleEnum.ADMIN), upload.single("iconUrl"), validate(createCategoryBodySchema, "body"), createCategoryController);
router.patch("/:slug", authMiddleware, roleMiddleware(UserRoleEnum.ADMIN), upload.single("iconUrl"), validate(updateCategoryBodySchema, "body"), updateCategoryController);
router.delete("/:slug", authMiddleware, roleMiddleware(UserRoleEnum.ADMIN), deleteCategoryController);
export default router;
 */

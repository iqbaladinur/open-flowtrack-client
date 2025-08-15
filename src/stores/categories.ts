import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type { Category } from '@/types/category';

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const api = useApi();

  const fetchCategories = async (force = false) => {
    // If we have data and we're not forcing a refresh, or if we are already loading, do nothing.
    if ((categories.value.length > 0 && !force) || loading.value) {
      return;
    }

    loading.value = true;
    try {
      // Always fetch all categories. Filtering will be done on the client.
      const response = await api.get<Category[]>('/categories');
      if (response.data) {
        categories.value = response.data;
      }
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (categoryData: {
    name: string;
    type: 'income' | 'expense';
    icon: string;
    color: string;
  }) => {
    const response = await api.post<Category>('/categories', categoryData);
    if (response.data) {
      // Force a refresh of the categories list
      await fetchCategories(true);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const createManyCategories = async (categoriesData: Omit<Category, 'id' | 'created_at' | 'user_id' | 'is_default'>[]) => {
    const response = await api.post<{ data: Category[] }>('/categories/bulk', { categories: categoriesData });
    if (response.data) {
      // Force a refresh of the categories list
      await fetchCategories(true);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const updateCategory = async (
    id: string,
    categoryData: Partial<{
      name: string;
      type: 'income' | 'expense';
      icon: string;
      color: string;
    }>
  ) => {
    const response = await api.patch<Category>(`/categories/${id}`, categoryData);
    if (response.data) {
      // Force a refresh of the categories list
      await fetchCategories(true);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const deleteCategory = async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    if (!response.error) {
      // Force a refresh of the categories list
      await fetchCategories(true);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const getCategoriesByType = (type: 'income' | 'expense') => {
    return categories.value.filter((c) => c.type === type);
  };

  const getCategoryById = (id: string) => {
    return categories.value.find((c) => c.id === id);
  };

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    createManyCategories,
    updateCategory,
    deleteCategory,
    getCategoriesByType,
    getCategoryById,
  };
});

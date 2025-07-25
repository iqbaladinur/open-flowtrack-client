import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type { Category } from '@/types';

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const api = useApi();

  const fetchCategories = async (type?: 'income' | 'expense') => {
    loading.value = true;
    try {
      const params = type ? { type } : {};
      const response = await api.get<Category[]>('/categories', { params });
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
      categories.value.push(response.data);
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
      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        categories.value[index] = response.data;
      }
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const deleteCategory = async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    if (!response.error) {
      categories.value = categories.value.filter((c) => c.id !== id);
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
    updateCategory,
    deleteCategory,
    getCategoriesByType,
    getCategoryById,
  };
});
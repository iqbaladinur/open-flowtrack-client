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
    type: 'income' | 'expense' | 'transfer';
    icon: string;
    color: string;
  }) => {
    const response = await api.post<Category>('/categories', categoryData);
    if (response.data) {
      // Force a refresh of the categories list
      await fetchCategories(true);
      return { success: true, data: response.data };
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
      type: 'income' | 'expense' | 'transfer';
      icon: string;
      color: string;
    }>
  ) => {
    const response = await api.patch<Category>(`/categories/${id}`, categoryData);
    if (response.data) {
      // Force a refresh of the categories list
      await fetchCategories(true);
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error };
  };

  const deleteCategory = async (id: string) => {
    // Find the category and its index before deletion
    const index = categories.value.findIndex((c) => c.id === id);
    if (index === -1) {
      return { success: false, error: 'Category not found' };
    }

    // Make a copy of the object
    const deletedCategory = { ...categories.value[index] };

    // Delete from local list first (optimistic update)
    categories.value.splice(index, 1);

    // Try to delete from server
    const response = await api.delete(`/categories/${id}`);

    if (response.error) {
      // Rollback: restore the deleted category at its original position
      categories.value.splice(index, 0, deletedCategory);
      return { success: false, error: response.error };
    }

    // Force a refresh of the categories list
    if (categories.value.length > 0) {
      await fetchCategories(true);
    }
    return { success: true };
  };

  const getCategoriesByType = (type: 'income' | 'expense' | 'transfer') => {
    return categories.value.filter((c) => c.type === type);
  };

  const getCategoryById = (id: string) => {
    return categories.value.find((c) => c.id === id);
  };

  const getCategoryByIdFromServer = async (id: string) => {
    // First check if we have it locally
    const existing = getCategoryById(id);
    if (existing) {
      return existing;
    }

    // If not found locally, fetch from server
    const response = await api.get<Category>(`/categories/${id}`);
    if (response.data) {
      // Optionally add to local cache
      const existingIndex = categories.value.findIndex((c) => c.id === id);
      if (existingIndex === -1) {
        categories.value.push(response.data);
      }
    }
    return response.data;
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
    getCategoryByIdFromServer,
  };
});

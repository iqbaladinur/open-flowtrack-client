import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type { Budget } from '@/types';

export const useBudgetsStore = defineStore('budgets', () => {
  const budgets = ref<Budget[]>([]);
  const loading = ref(false);
  const api = useApi();

  const fetchBudgets = async (year: number) => {
    loading.value = true;
    try {
      const response = await api.get<Budget[]>(`/budgets?year=${year}`);
      if (response.data) {
        budgets.value = response.data;
      }
    } finally {
      loading.value = false;
    }
  };

  const createBudget = async (budgetData: {
    category_id: string;
    limit_amount: number;
    month: number;
    year: number;
  }) => {
    const response = await api.post<Budget>('/budgets', budgetData);
    if (response.data) {
      budgets.value.push(response.data);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const updateBudget = async (
    id: string,
    budgetData: Partial<{
      limit_amount: number;
    }>
  ) => {
    const response = await api.patch<Budget>(`/budgets/${id}`, budgetData);
    if (response.data) {
      const index = budgets.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        budgets.value[index] = { ...budgets.value[index], ...response.data };
      }
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const deleteBudget = async (id: string) => {
    const response = await api.delete(`/budgets/${id}`);
    if (!response.error) {
      budgets.value = budgets.value.filter((b) => b.id !== id);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const getBudgetById = (id: string) => {
    return budgets.value.find((b) => b.id === id);
  };

  return {
    budgets,
    loading,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetById,
  };
});
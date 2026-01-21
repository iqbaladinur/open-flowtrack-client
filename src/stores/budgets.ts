import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type { Budget, CreateBudgetPayload, UpdateBudgetPayload } from '@/types/budget';

export const useBudgetsStore = defineStore('budgets', () => {
  const budgets = ref<Budget[]>([]);
  const loading = ref(false);
  const api = useApi();

  const fetchBudgets = async (startDate?: string, endDate?: string) => {
    loading.value = true;
    let query = '';
    if (startDate) {
      query += `&start_date=${startDate}`; 
    }
    if (endDate) {
      query += `&end_date=${endDate}`; 
    }
    try {
      const response = await api.get<Budget[]>(`/budgets?${query}`);
      if (response.data) {
        budgets.value = response.data;
      }
    } finally {
      loading.value = false;
    }
  };

  const createBudget = async (budgetData: CreateBudgetPayload, isDuplicate: Boolean = false) => {
    const response = await api.post<Budget>('/budgets', budgetData);
    if (response.data) {
      if (!isDuplicate) {
        budgets.value.push(response.data);
      }
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error };
  };
  
  const duplicateBudget = async (budgetData: CreateBudgetPayload) => {
    return await createBudget(budgetData, true);
  };

  const updateBudget = async (id: string, budgetData: UpdateBudgetPayload) => {
    const response = await api.patch<Budget>(`/budgets/${id}`, budgetData);
    if (response.data) {
      const index = budgets.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        budgets.value[index] = { ...budgets.value[index], ...response.data };
      }
      return { success: true, data: response.data };
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

  const getBudgetById = async (id: string) => {
    const existing = budgets.value.find((b) => b.id === id);
    if (existing && existing.total_spent !== undefined) {
      return existing;
    }

    const response = await api.get<Budget>(`/budgets/${id}`);
    return response.data;
  };

  return {
    budgets,
    loading,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetById,
    duplicateBudget,
  };
});

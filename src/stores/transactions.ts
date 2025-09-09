import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type { Transaction, TransactionType } from '@/types/transaction';

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);
  const api = useApi();

  const fetchTransactions = async (
    filters?: {
      start_date?: string;
      end_date?: string;
      wallet_id?: string;
      category_id?: string;
      type?: TransactionType;
    },
    force = false
  ) => {
    const hasFilters = filters && Object.keys(filters).length > 0;
    if (!hasFilters && transactions.value.length > 0 && !force) {
      return;
    }
    if (loading.value) return;

    loading.value = true;
    try {
      const response = await api.get<Transaction[]>('/transactions', {
        params: filters,
      });
      if (response.data) {
        transactions.value = response.data.map(t => ({
          ...t,
          amount: parseFloat(t.amount as any) || 0,
        }));
      }
    } finally {
      loading.value = false;
    }
  };

  const createTransaction = async (transactionData: {
    type: TransactionType;
    amount: number;
    wallet_id: string;
    category_id: string | null;
    destination_wallet_id?: string;
    date: string;
    note?: string;
    is_recurring?: boolean;
    recurring_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  }) => {
    const response = await api.post<Transaction>('/transactions', transactionData);
    if (response.data) {
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const updateTransaction = async (
    id: string,
    transactionData: Partial<{
      type: TransactionType;
      amount: number;
      wallet_id: string;
      category_id: string | null;
      destination_wallet_id?: string;
      date: string;
      note?: string;
      is_recurring?: boolean;
      recurring_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    }>
  ) => {
    const response = await api.patch<Transaction>(`/transactions/${id}`, transactionData);
    if (response.data) {
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const deleteTransaction = async (id: string) => {
    const response = await api.delete(`/transactions/${id}`);
    if (!response.error) {
      await fetchTransactions({}, true); // Force refresh
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const getTransactionById = (id: string) => {
    return transactions.value.find((t) => t.id === id);
  };

  const mapExpenseTransaction = async (content: string) => {
    return await api.post<{amount: number, category_id: string, note: string}[]>(`transactions/bulk-expense`, {
      content: content
    });
  }

  return {
    transactions,
    loading,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    mapExpenseTransaction,
  };
});

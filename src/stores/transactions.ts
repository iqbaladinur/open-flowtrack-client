import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type { Transaction } from '@/types';
import { useWalletsStore } from './wallets';

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);
  const api = useApi();
  const walletsStore = useWalletsStore();

  // Allow direct write access for walletsStore
  const setTransactions = (newTransactions: Transaction[]) => {
    transactions.value = newTransactions;
  };

  const fetchTransactions = async (filters?: {
    start_date?: string;
    end_date?: string;
    wallet_id?: string;
    category_id?: string;
    type?: 'income' | 'expense';
  }) => {
    loading.value = true;
    try {
      const response = await api.get<Transaction[]>('/transactions', {
        params: filters,
      });
      if (response.data) {
        transactions.value = response.data;
      }
    } finally {
      loading.value = false;
    }
  };

  const createTransaction = async (transactionData: {
    type: 'income' | 'expense';
    amount: number;
    wallet_id: string;
    category_id: string;
    date: string;
    note?: string;
    is_recurring?: boolean;
    recurring_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  }) => {
    const response = await api.post<Transaction>('/transactions', transactionData);
    if (response.data) {
      transactions.value.unshift(response.data);
      walletsStore.recalculateWalletBalance(response.data.wallet_id);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const updateTransaction = async (
    id: string,
    transactionData: Partial<{
      type: 'income' | 'expense';
      amount: number;
      wallet_id: string;
      category_id: string;
      date: string;
      note?: string;
      is_recurring?: boolean;
      recurring_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    }>
  ) => {
    const oldTransaction = getTransactionById(id);
    const oldWalletId = oldTransaction?.wallet_id;

    const response = await api.patch<Transaction>(`/transactions/${id}`, transactionData);
    if (response.data) {
      const index = transactions.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        transactions.value[index] = response.data;
      }
      walletsStore.recalculateWalletBalance(response.data.wallet_id);
      if (oldWalletId && oldWalletId !== response.data.wallet_id) {
        walletsStore.recalculateWalletBalance(oldWalletId);
      }
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const deleteTransaction = async (id: string) => {
    const transaction = getTransactionById(id);
    if (!transaction) {
      return { success: false, error: 'Transaction not found' };
    }
    const walletId = transaction.wallet_id;

    const response = await api.delete(`/transactions/${id}`);
    if (!response.error) {
      transactions.value = transactions.value.filter((t) => t.id !== id);
      walletsStore.recalculateWalletBalance(walletId);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const getTransactionById = (id: string) => {
    return transactions.value.find((t) => t.id === id);
  };

  return {
    transactions,
    loading,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    setTransactions,
  };
});

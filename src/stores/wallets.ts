import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type { Wallet, Transaction } from '@/types';
import { useTransactionsStore } from './transactions';

interface WalletWithBalance extends Wallet {
  balance: number;
}

export const useWalletsStore = defineStore('wallets', () => {
  const wallets = ref<WalletWithBalance[]>([]);
  const loading = ref(false);
  const api = useApi();
  const transactionsStore = useTransactionsStore();

  const calculateBalance = (wallet: Wallet, allTransactions: Transaction[]): number => {
    const walletTransactions = allTransactions.filter(t => t.wallet_id === wallet.id);
    return walletTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        return acc + transaction.amount;
      }
      return acc - transaction.amount;
    }, wallet.initial_balance);
  };

  const fetchWallets = async () => {
    loading.value = true;
    try {
      const [walletsResponse, transactionsResponse] = await Promise.all([
        api.get<Wallet[]>('/wallets'),
        api.get<Transaction[]>('/transactions', { params: { end_date: new Date().toISOString().split('T')[0] } })
      ]);

      if (walletsResponse.data && transactionsResponse.data) {
        const walletsData = walletsResponse.data;
        const allTransactions = transactionsResponse.data;

        // Set transactions in the transactions store
        transactionsStore.setTransactions(allTransactions);

        wallets.value = walletsData.map(wallet => ({
          ...wallet,
          balance: calculateBalance(wallet, allTransactions)
        }));
      }
    } finally {
      loading.value = false;
    }
  };

  const createWallet = async (walletData: {
    name: string;
    currency: 'USD' | 'IDR';
    initial_balance: number;
  }) => {
    const response = await api.post<Wallet>('/wallets', walletData);
    if (response.data) {
      wallets.value.push({ ...response.data, balance: response.data.initial_balance });
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const updateWallet = async (
    id: string,
    walletData: Partial<{
      name: string;
      currency: 'USD' | 'IDR';
      initial_balance: number;
    }>
  ) => {
    const response = await api.patch<Wallet>(`/wallets/${id}`, walletData);
    if (response.data) {
      await fetchWallets(); // Refetch everything to ensure consistency
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const deleteWallet = async (id: string) => {
    const response = await api.delete(`/wallets/${id}`);
    if (!response.error) {
      wallets.value = wallets.value.filter((w) => w.id !== id);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const getWalletById = (id: string) => {
    return wallets.value.find((w) => w.id === id);
  };

  const recalculateWalletBalance = async (walletId: string) => {
    const index = wallets.value.findIndex((w) => w.id === walletId);
    if (index === -1) return;

    const wallet = wallets.value[index];
    const today = new Date().toISOString().split('T')[0];
    const response = await api.get<Transaction[]>(`/transactions`, {
      params: { wallet_id: wallet.id, end_date: today },
    });

    if (response.data) {
      const balance = response.data.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
          return acc + transaction.amount;
        }
        return acc - transaction.amount;
      }, wallet.initial_balance);
      wallets.value[index].balance = balance;
    }
  };

  return {
    wallets,
    loading,
    fetchWallets,
    createWallet,
    updateWallet,
    deleteWallet,
    getWalletById,
    recalculateWalletBalance,
  };
});

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type { Wallet } from '@/types';

export const useWalletsStore = defineStore('wallets', () => {
  const wallets = ref<Wallet[]>([]);
  const loading = ref(false);
  const api = useApi();

  const fetchWallets = async (force = false, start_date?: string, end_date?: string) => {
    // If we have data and we're not forcing a refresh, or if we are already loading, do nothing.
    if ((wallets.value.length > 0 && !force) || loading.value) {
      return;
    }

    console.log(end_date);
    
    loading.value = true;
    try {

      const params:any = {};
      
      if (start_date) {
        params['start_date'] = start_date;
      }

      if (end_date) {
        params['end_date'] = end_date;
      }

      const response = await api.get<Wallet[]>('/wallets', {
        params,
      });

      if (response.data) {
        wallets.value = response.data;
      }
    } finally {
      loading.value = false;
    }
  };

  const createWallet = async (walletData: {
    name: string;
    initial_balance: number;
  }) => {
    const response = await api.post<Wallet>('/wallets', walletData);
    if (response.data) {
      await fetchWallets(true); // Force refresh
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const updateWallet = async (
    id: string,
    walletData: Partial<{
      name: string;
      initial_balance: number;
    }>
  ) => {
    const response = await api.patch<Wallet>(`/wallets/${id}`, walletData);
    if (response.data) {
      await fetchWallets(true); // Force refresh
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

  const getWalletByIdFromServer = async (id: string, params?: { start_date?: string, end_date?: string }) => {
    const response = await api.get<Wallet>(`/wallets/${id}`, { params });
    return response?.data;
  }

  return {
    wallets,
    loading,
    fetchWallets,
    createWallet,
    updateWallet,
    deleteWallet,
    getWalletById,
    getWalletByIdFromServer
  };
});

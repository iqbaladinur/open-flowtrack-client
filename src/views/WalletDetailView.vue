<template>
  <AppLayout>
    <div class="pt-0 pb-2 px-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div v-if="wallet" class="flex items-center gap-4 justify-between">
        <router-link to="/wallets" class="btn-icon flex gap-4 items-center">
          <ArrowLeft class="w-5 h-5" />
          <div>
            <h1 class="text-sm font-medium text-gray-800 dark:text-neon">Back</h1>
          </div>
        </router-link>
        <div class="flex items-center space-x-2 justify-center my-2">
          <button
            @click="editWallet()"
            class="p-2 text-gray-600 dark:text-white rounded-full"
          >
            <NotebookPen class="w-4 h-4" />
          </button>
          <button
            @click="deleteWallet()"
            class="p-2 text-gray-600 dark:text-white rounded-full"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="card p-8">
        <LoadingSpinner fullHeight />
      </div>

      <!-- Error State -->
      <div v-else-if="!wallet" class="card p-12 text-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Wallet not found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          The wallet you are looking for does not exist.
        </p>
        <router-link to="/wallets" class="btn-primary">
          Go back to Wallets
        </router-link>
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <!-- Wallet Card -->
        <WalletCard
          :wallet="wallet"
          :enableActions="false"
        />

        <!-- Period Summary -->
        <div class="grid grid-cols-2 gap-4">
          <div class="card p-4 flex items-center flex-col gap-4 justify-center">
            <div class="p-2 bg-success-100 dark:bg-success-900/50 rounded-full">
              <TrendingUp class="w-4 h-4 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 text-center">Income</p>
              <p class="text-xs font-semibold text-success-600 dark:text-success-400">
                {{ configStore.formatCurrency(periodIncome) }}
              </p>
            </div>
          </div>
          <div class="card p-4 flex items-center flex-col gap-4 justify-center">
            <div class="p-2 bg-error-100 dark:bg-error-900/50 rounded-full">
              <TrendingDown class="w-4 h-4 text-error-600 dark:text-error-400" />
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 text-center">Expense</p>
              <p class="text-xs font-semibold text-error-600 dark:text-error-400">
                {{ configStore.formatCurrency(periodExpense) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Filter Toggle Button -->
        <div class="flex justify-end">
          <button @click="showFilters = !showFilters" class="btn btn-primary">
            <Filter class="w-4 h-4 mr-2" />
            <span>{{ showFilters ? 'Hide' : 'Show' }} Filters</span>
          </button>
        </div>

        <!-- Filters Card -->
        <div v-if="showFilters" class="card p-4">
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Quick Select</label>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <button @click="setFilter('all')" :class="['btn-sm', selectedFilter === 'all' ? 'btn-primary' : 'btn-secondary']">All Time</button>
                <button @click="setFilter('today')" :class="['btn-sm', selectedFilter === 'today' ? 'btn-primary' : 'btn-secondary']">Today</button>
                <button @click="setFilter('week')" :class="['btn-sm', selectedFilter === 'week' ? 'btn-primary' : 'btn-secondary']">This Week</button>
                <button @click="setFilter('month')" :class="['btn-sm', selectedFilter === 'month' ? 'btn-primary' : 'btn-secondary']">This Month</button>
                <button @click="setFilter('year')" :class="['btn-sm', selectedFilter === 'year' ? 'btn-primary' : 'btn-secondary']">This Year</button>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Custom Range</label>
              <div class="flex flex-col sm:flex-row items-center gap-2 mt-2">
                <input type="date" v-model="startDate" @change="setCustomFilter" class="input w-full" />
                <span class="text-gray-500 hidden sm:block">-</span>
                <input type="date" v-model="endDate" @change="setCustomFilter" class="input w-full" />
              </div>
            </div>
          </div>
        </div>

        <!-- Transactions List -->
        <div class="card">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="font-semibold text-gray-800 dark:text-white">Transaction History</h3>
          </div>
          <div v-if="transactionsStore.loading" class="p-8">
            <LoadingSpinner />
          </div>
          <div v-else-if="transactions.length === 0" class="p-8 text-center">
            <p class="text-gray-500 dark:text-gray-400">No transactions found for the selected period.</p>
          </div>
          <div v-else>
            <ul>
              <li v-for="transaction in transactions" :key="transaction.id" class="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <TransactionItem :transaction="transaction" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
  <WalletModal
    v-model="showModal"
    :wallet="selectedWallet"
    @success="handleWalletSaved"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWalletsStore } from '@/stores/wallets';
import { useTransactionsStore } from '@/stores/transactions';
import { useConfigStore } from '@/stores/config';
import AppLayout from '@/components/layouts/AppLayout.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import WalletCard from '@/components/WalletCard.vue';
import TransactionItem from '@/components/TransactionItem.vue';
import type { Wallet, Transaction } from '@/types';
import { ArrowLeft, Trash2, TrendingUp, TrendingDown, Filter, NotebookPen } from 'lucide-vue-next';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfDay, endOfDay } from 'date-fns';
import WalletModal from '@/components/WalletModal.vue';

const route = useRoute();
const router = useRouter();
const walletsStore = useWalletsStore();
const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();

const walletId = ref(route.params.id as string);
const wallet = ref<Wallet | null>(null);
const selectedWallet = ref<Wallet | null>(null);
const showModal = ref<boolean>(false);
const loading = ref(true);
const showFilters = ref(false);

const selectedFilter = ref('all');
const startDate = ref('');
const endDate = ref('');

const transactions = computed<Transaction[]>(() => transactionsStore.transactions);

const periodIncome = computed(() => {
  return transactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
});

const periodExpense = computed(() => {
  return transactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
});

const fetchWalletData = async () => {
  loading.value = true;
  try {
    const dateRange:{ start_date?: string, end_date?: string} = {};
    if (startDate.value) {
      dateRange.start_date = startDate.value;
    }
    if (endDate.value) {
      dateRange.end_date = endDate.value;
    }
    const [walletData] = await Promise.all([
      walletsStore.getWalletByIdFromServer(walletId.value, { ...dateRange }),
      transactionsStore.fetchTransactions({
        wallet_id: walletId.value,
        ...dateRange
      }, true) // force refresh transactions
    ]);
    wallet.value = walletData || null;
  } catch (error) {
    console.error("Failed to fetch wallet data:", error);
    wallet.value = null;
  } finally {
    loading.value = false;
  }
};

const setFilter = (filter: 'today' | 'week' | 'month' | 'year' | 'all') => {
  selectedFilter.value = filter;
  const today = new Date();
  today.setHours(7, 0, 0);
  switch (filter) {
    case 'today':
      startDate.value = startOfDay(today).toISOString();
      endDate.value = endOfDay(today).toISOString();
      break;
    case 'week':
      startDate.value = startOfWeek(today).toISOString();
      endDate.value = endOfWeek(today).toISOString();
      break;
    case 'month':
      startDate.value = startOfMonth(today).toISOString();
      endDate.value = endOfMonth(today).toISOString();
      break;
    case 'year':
      startDate.value = startOfYear(today).toISOString();
      endDate.value = endOfYear(today).toISOString();
      break;
    case 'all':
      startDate.value = '';
      endDate.value = '';
  }
};

const setCustomFilter = () => {
  selectedFilter.value = 'custom';
  // The watch effect will trigger the data fetch
}

watch([startDate, endDate], fetchWalletData, { immediate: true });

const handleWalletSaved = async () => {
  showModal.value = false;
  await fetchWalletData();
}

const editWallet = () => {
  selectedWallet.value = wallet.value;
  showModal.value = true;
};

const deleteWallet = async () => {
  if (confirm('Are you sure you want to delete this wallet? This action cannot be undone.')) {
    const result = await walletsStore.deleteWallet(walletId.value);
    if (!result.success && result.error) {
      alert(result.error);
      return;
    }

    router.push('/wallets');
  }
};

onMounted(() => {
  setFilter('all'); // Set initial filter and fetch data
});
</script>
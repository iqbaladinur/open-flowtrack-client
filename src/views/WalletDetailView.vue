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
      <div v-if="loading && !wallet" class="card p-8">
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
        <div class="flex sm:grid sm:grid-cols-4 sm:gap-4 overflow-x-auto space-x-3 sm:space-x-0 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <!-- Income -->
          <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 sm:ml-0">
            <div class="flex flex-col h-full">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-success-100 dark:bg-success-900/50 mb-3">
                <TrendingUp class="w-4 h-4 text-success-600 dark:text-success-400" />
              </div>
              <div class="mt-auto">
                <p class="text-xs text-gray-500 dark:text-gray-400">Income</p>
                <p class="text-xs font-medium text-success-600 dark:text-success-400 font-mono">
                  {{ configStore.formatCurrency(periodIncome) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Expense -->
          <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 -ml-4 sm:ml-0">
            <div class="flex flex-col h-full">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-error-100 dark:bg-error-900/50 mb-3">
                <TrendingDown class="w-4 h-4 text-error-600 dark:text-error-400" />
              </div>
              <div class="mt-auto">
                <p class="text-xs text-gray-500 dark:text-gray-400">Expenses</p>
                <p class="text-xs font-medium text-error-600 dark:text-error-400 font-mono">
                  {{ configStore.formatCurrency(periodExpense) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Net Income -->
          <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 -ml-4 sm:ml-0">
            <div class="flex flex-col h-full">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-warning-100 dark:bg-warning-900/50 mb-3">
                <BarChart3 class="w-4 h-4 text-warning-600 dark:text-warning-400" />
              </div>
              <div class="mt-auto">
                <p class="text-xs text-gray-500 dark:text-gray-400">Net Income</p>
                <p 
                  class="text-xs font-medium font-mono"
                  :class="{
                    'text-success-600 dark:text-success-400': netIncome > 0,
                    'text-gray-800 dark:text-gray-200': netIncome === 0,
                    'text-error-600 dark:text-error-400': netIncome < 0,
                  }"
                >
                  {{ netIncome >= 0 ? '+' : '' }}{{ configStore.formatCurrency(netIncome) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end items-center gap-2">
          <div class="hidden sm:flex items-center gap-2">
            <button @click="openTransactionModal('income')" class="btn btn-success">
              <TrendingUp class="w-4 h-4 mr-2" />
              <span>Income</span>
            </button>
            <button @click="openTransactionModal('expense')" class="btn btn-error">
              <TrendingDown class="w-4 h-4 mr-2" />
              <span>Expense</span>
            </button>
          </div>
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
                <button @click="setFilter('custom')" :class="['btn-sm', selectedFilter === 'custom' ? 'btn-primary' : 'btn-secondary']">Custom Period</button>
              </div>
            </div>
            <div v-show="selectedFilter === 'custom'">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Custom Range</label>
              <div class="flex flex-col sm:flex-row items-center gap-2 mt-2">
                <input type="date" v-model="startDate" @change="setCustomFilter" class="input w-full" placeholder="Start Date" />
                <span class="text-gray-500 hidden sm:block">-</span>
                <input type="date" v-model="endDate" @change="setCustomFilter" class="input w-full" placeholder="End Date" />
              </div>
            </div>
          </div>
        </div>

        <!-- Transactions List -->
        <div class="card">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="font-semibold text-gray-800 dark:text-white">Transaction History</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ dateRangeSubtitle }}</p>
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
  <!-- Floating Action Buttons for Mobile -->
  <div class="sm:hidden fixed bottom-[70px] right-6 z-[20] flex flex-col gap-3">
    <button @click="openTransactionModal('income')" class="btn-success rounded-full p-3 shadow-lg flex items-center justify-center">
      <TrendingUp class="w-5 h-5" />
      <span class="sr-only">Add Income</span>
    </button>
    <button @click="openTransactionModal('expense')" class="btn-error rounded-full p-3 shadow-lg flex items-center justify-center">
      <TrendingDown class="w-5 h-5" />
      <span class="sr-only">Add Expense</span>
    </button>
  </div>
  <WalletModal
    v-model="showModal"
    :wallet="selectedWallet"
    @success="handleWalletSaved"
  />
  <TransactionModal
    v-model="showTransactionModal"
    :type="transactionType"
    :wallet-id="walletId"
    @success="handleTransactionSaved"
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
import WalletCard from '@/components/wallet/WalletCard.vue';
import TransactionItem from '@/components/transaction/TransactionItem.vue';
import type { Wallet } from '@/types/wallet';
import type { Transaction } from '@/types/transaction';
import { ArrowLeft, Trash2, TrendingUp, TrendingDown, Filter, NotebookPen, BarChart3 } from 'lucide-vue-next';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfDay, endOfDay, parseISO } from 'date-fns';
import WalletModal from '@/components/wallet/WalletModal.vue';
import TransactionModal from '@/components/transaction/TransactionModal.vue';

const route = useRoute();
const router = useRouter();
const walletsStore = useWalletsStore();
const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();

const walletId = ref(route.params.id as string);
const wallet = ref<Wallet | null>(null);
const selectedWallet = ref<Wallet | null>(null);
const showModal = ref<boolean>(false);
const showTransactionModal = ref<boolean>(false);
const transactionType = ref<'income' | 'expense'>('expense');
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

const netIncome = computed(() => {
  return periodIncome.value - periodExpense.value
});

const dateRangeSubtitle = computed(() => {
  const start = startDate.value;
  const end = endDate.value;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'dd MMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (start && end) {
    if (start === end) {
      return formatDate(start);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  }
  if (start) {
    return `From ${formatDate(start)}`;
  }
  if (end) {
    return `Until ${formatDate(end)}`;
  }
  return 'All Time';
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
      walletsStore.getWalletByIdFromServer(walletId.value, { end_date: dateRange.end_date || undefined }),
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

const setFilter = (filter: 'today' | 'week' | 'month' | 'year' | 'all' | 'custom') => {
  selectedFilter.value = filter;
  const today = new Date();

  switch (filter) {
    case 'today':
      startDate.value = format(startOfDay(today), 'yyyy-MM-dd');
      endDate.value = format(endOfDay(today), 'yyyy-MM-dd');
      break;
    case 'week':
      startDate.value = format(startOfWeek(today), 'yyyy-MM-dd');
      endDate.value = format(endOfWeek(today), 'yyyy-MM-dd');
      break;
    case 'month':
      startDate.value = format(startOfMonth(today), 'yyyy-MM-dd');
      endDate.value = format(endOfMonth(today), 'yyyy-MM-dd');
      break;
    case 'year':
      startDate.value = format(startOfYear(today), 'yyyy-MM-dd');
      endDate.value = format(endOfYear(today), 'yyyy-MM-dd');
      break;
    case 'custom': {
      const firstDay = configStore.firstDayOfMonth;
      let customStartDate = new Date(today.getFullYear(), today.getMonth(), firstDay);
      if (today.getDate() < firstDay) {
        customStartDate.setMonth(customStartDate.getMonth() - 1);
      }
      const customEndDate = new Date(customStartDate);
      customEndDate.setDate(customStartDate.getDate() + 30);
      startDate.value = format(customStartDate, 'yyyy-MM-dd');
      endDate.value = format(customEndDate, 'yyyy-MM-dd');
      break;
    }
    case 'all':
      startDate.value = '';
      endDate.value = '';
  }
};

const setCustomFilter = () => {
  selectedFilter.value = 'custom';
  // The watch effect will trigger the data fetch
}

watch([startDate, endDate], fetchWalletData, { immediate: false });

const handleWalletSaved = async () => {
  showModal.value = false;
  await fetchWalletData();
}

const handleTransactionSaved = async () => {
  showTransactionModal.value = false;
  await fetchWalletData();
}

const openTransactionModal = (type: 'income' | 'expense') => {
  transactionType.value = type;
  showTransactionModal.value = true;
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
  const defaultFilter = configStore.firstDayOfMonth === 1 ? 'all' : 'custom';
  setFilter(defaultFilter); // Set initial filter and fetch data
});
</script>
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
          <button @click="editWallet()" class="p-2 text-gray-600 dark:text-white rounded-full">
            <NotebookPen class="w-4 h-4" />
          </button>
          <button @click="deleteWallet()" class="p-2 text-gray-600 dark:text-white rounded-full">
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
        <WalletCard :wallet="wallet" :enableActions="false">
          <template #description>
            <p class="text-gray-500 dark:text-gray-400 text-xs mb-2">
              {{ walletEndDate }}
            </p>
          </template>
        </WalletCard>
        <!-- Period Summary -->
        <div>
          <div class="border-gray-200 dark:border-gray-700 mb-2">
            <h3 class="text-gray-800 dark:text-white text-xs">This Period Recap</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ dateRangeSubtitle }}</p>
          </div>
          <div
            class="flex lg:grid lg:grid-cols-5 lg:gap-4 overflow-x-auto space-x-3 lg:space-x-0 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <SummaryCard3
              title="Income"
              :value="periodIncome"
              :icon="TrendingUp"
              icon-bg-class="!bg-success-100 dark:!bg-success-900/50"
              icon-class="text-success-600 dark:text-success-400"
              value-class="text-success-600 dark:text-success-400"
            />
            <SummaryCard3
              title="Expenses"
              :value="periodExpense"
              :icon="TrendingDown"
              icon-bg-class="!bg-error-100 dark:!bg-error-900/50"
              icon-class="text-error-600 dark:text-error-400"
              value-class="text-error-600 dark:text-error-400"
            />
            <SummaryCard3
              title="Transfer Out"
              :value="periodTransferOut"
              :icon="ArrowUpRight"
              icon-bg-class="!bg-blue-100 dark:!bg-blue-900/50"
              icon-class="text-blue-600 dark:text-blue-400"
              value-class="text-blue-600 dark:text-blue-400"
            />
            <SummaryCard3
              title="Transfer In"
              :value="periodTransferIn"
              :icon="ArrowDownRight"
              icon-bg-class="!bg-blue-100 dark:!bg-blue-900/50"
              icon-class="text-blue-600 dark:text-blue-400"
              value-class="text-blue-600 dark:text-blue-400"
            />
            <SummaryCard3
              title="Net Income"
              :value="netIncome"
              :prefix="netIncome >= 0 ? '+' : ''"
              :icon="Scale"
              icon-bg-class="!bg-warning-100 dark:!bg-warning-900/50"
              icon-class="text-warning-600 dark:text-warning-400"
              :value-class="{
                'text-success-600 dark:text-success-400': netIncome > 0,
                'text-gray-800 dark:text-gray-200': netIncome === 0,
                'text-error-600 dark:text-error-400': netIncome < 0,
              }"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end items-center gap-2">
          <div class="hidden sm:flex items-center gap-2">
            <button @click="openTransactionModal('income')" class="btn btn-secondary !text-success-500">
              <TrendingUp class="w-4 h-4 mr-2" />
              <span>Income</span>
            </button>
            <button @click="openTransactionModal('expense')" class="btn btn-secondary !text-error-500">
              <TrendingDown class="w-4 h-4 mr-2" />
              <span>Expense</span>
            </button>
            <button @click="openTransactionModal('transfer')" class="btn btn-secondary !text-blue-500">
              <ArrowRightLeft class="w-4 h-4 mr-2" />
              <span>Transfer</span>
            </button>
          </div>
          <button @click="showCategoryFilterModal = true" class="btn btn-secondary">
            <FilterX class="w-4 h-4 mr-2" />
            <span>Exclude Categories</span>
            <span v-if="excludedCategoryIds.length > 0"
              class="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 text-xs rounded-full">
              {{ excludedCategoryIds.length }}
            </span>
          </button>
          <button @click="showFilters = !showFilters" class="btn btn-primary">
            <Filter class="w-4 h-4 mr-2" />
            <span>{{ showFilters ? 'Hide' : 'Show' }} Filters</span>
          </button>
        </div>

        <!-- Filters Card -->
        <div v-if="showFilters" class="card p-4">
          <div class="space-y-4">
            <div>
              <label class="label mb-2 px-2">Type</label>
              <div class="flex items-center space-x-2 overflow-x-auto py-2 px-2">
                <button @click="filters.type = 'all'" :class="['btn flex-shrink-0', filters.type === 'all' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">All Types</button>
                <button @click="filters.type = 'income'" :class="['btn flex-shrink-0', filters.type === 'income' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">
                  <TrendingUp class="w-4 h-4 mr-1.5" />
                  Income
                </button>
                <button @click="filters.type = 'expense'" :class="['btn flex-shrink-0', filters.type === 'expense' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">
                  <TrendingDown class="w-4 h-4 mr-1.5" />
                  Expense
                </button>
                <button @click="filters.type = 'transfer'" :class="['btn flex-shrink-0', filters.type === 'transfer' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">
                  <ArrowRightLeft class="w-4 h-4 mr-1.5" />
                  Transfer
                </button>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Quick Select</label>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <button @click="setFilter('all')"
                  :class="['btn-sm', selectedFilter === 'all' ? 'btn-primary' : 'btn-secondary']">All Time</button>
                <button @click="setFilter('today')"
                  :class="['btn-sm', selectedFilter === 'today' ? 'btn-primary' : 'btn-secondary']">Today</button>
                <button @click="setFilter('week')"
                  :class="['btn-sm', selectedFilter === 'week' ? 'btn-primary' : 'btn-secondary']">This Week</button>
                <button @click="setFilter('month')"
                  :class="['btn-sm', selectedFilter === 'month' ? 'btn-primary' : 'btn-secondary']">This Month</button>
                <button @click="setFilter('year')"
                  :class="['btn-sm', selectedFilter === 'year' ? 'btn-primary' : 'btn-secondary']">This Year</button>
                <button @click="setFilter('custom')"
                  :class="['btn-sm', selectedFilter === 'custom' ? 'btn-primary' : 'btn-secondary']">Custom
                  Period</button>
              </div>
            </div>
            <div v-show="selectedFilter === 'custom'">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Custom Range</label>
              <div class="flex flex-col sm:flex-row items-center gap-2 mt-2">
                <input type="date" v-model="startDate" @change="setCustomFilter" class="input w-full"
                  placeholder="Start Date" />
                <span class="text-gray-500 hidden sm:block">-</span>
                <input type="date" v-model="endDate" @change="setCustomFilter" class="input w-full"
                  placeholder="End Date" />
              </div>
              <div class="flex justify-evenly lg:justify-end items-center gap-2 mt-4">
                <button @click="goToPreviousPeriod" class="btn btn-primary flex-1 lg:flex-none">Previous Period</button>
                <button @click="goToNextPeriod" class="btn btn-primary flex-1 lg:flex-none">Next Period</button>
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
          <div v-else-if="filteredTransactions.length === 0" class="p-8 text-center">
            <p class="text-gray-500 dark:text-gray-400">No transactions found for the selected period.</p>
          </div>
          <div v-else>
            <ul>
              <li v-for="transaction in filteredTransactions" :key="transaction.id"
                class="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <TransactionItem :transaction="transaction" :showActions="true" @edit="editTransactions" @delete="deleteTransaction" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
  <!-- Floating Action Buttons for Mobile -->
  <QuickAction>
    <button @click="openTransactionModal('income')"
      class="btn-success bg-opacity-70 rounded-xl p-3 shadow-lg flex items-center justify-center">
      <TrendingUp class="w-6 h-6" />
      <span class="sr-only">Add Income</span>
    </button>
    <button @click="openTransactionModal('transfer')"
      class="btn bg-blue-100 dark:bg-blue-900 bg-opacity-70 rounded-xl p-3 shadow-lg flex items-center justify-center">
      <ArrowRightLeft class="w-6 h-6 text-blue-600 dark:text-blue-400" />
      <span class="sr-only">Add Transfer</span>
    </button>
    <button @click="openTransactionModal('expense')"
      class="btn-error bg-opacity-70 rounded-xl p-3 shadow-lg flex items-center justify-center">
      <TrendingDown class="w-6 h-6" />
      <span class="sr-only">Add Expense</span>
    </button>
  </QuickAction>
  <WalletModal v-model="showModal" :wallet="selectedWallet" @success="handleWalletSaved" />
  <TransactionModal
    v-model="showTransactionModal"
    :transaction="selectedTransaction"
    :type="transactionType"
    :wallet-id="walletId"
    @success="handleTransactionSaved"
  />
  <CategoryFilterModal v-model="showCategoryFilterModal" :categories="categories"
    :excluded-categories="excludedCategoryIds" @update:excluded-categories="excludedCategoryIds = $event" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWalletsStore } from '@/stores/wallets';
import { useTransactionsStore } from '@/stores/transactions';
import { useConfigStore } from '@/stores/config';
import { useCategoriesStore } from '@/stores/categories';
import AppLayout from '@/components/layouts/AppLayout.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import WalletCard from '@/components/wallet/WalletCard.vue';
import TransactionItem from '@/components/transaction/TransactionItem.vue';
import type { Wallet } from '@/types/wallet';
import type { Transaction, TransactionType } from '@/types/transaction';
import { ArrowLeft, Trash2, TrendingUp, TrendingDown, Filter, NotebookPen, FilterX, Scale, ArrowUpRight, ArrowDownRight, ArrowRightLeft } from 'lucide-vue-next';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfDay, endOfDay, parseISO } from 'date-fns';
import WalletModal from '@/components/wallet/WalletModal.vue';
import TransactionModal from '@/components/transaction/TransactionModal.vue';
import CategoryFilterModal from '@/components/category/CategoryFilterModal.vue';
import QuickAction from '@/components/shared/QuickAction.vue';
import SummaryCard3 from '@/components/dashboard/SummaryCard3.vue';

const route = useRoute();
const router = useRouter();
const walletsStore = useWalletsStore();
const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();
const categoriesStore = useCategoriesStore();

const walletId = ref(route.params.id as string);
const wallet = ref<Wallet | null>(null);
const selectedWallet = ref<Wallet | null>(null);
const showModal = ref<boolean>(false);
const showTransactionModal = ref<boolean>(false);
const transactionType = ref<TransactionType>('expense');
const loading = ref(true);
const showFilters = ref(false);
const showCategoryFilterModal = ref(false);
const excludedCategoryIds = ref<string[]>([]);
const selectedTransaction = ref<Transaction | null>(null);

const selectedFilter = ref('all');
const startDate = ref('');
const endDate = ref('');
const filters = reactive<{
  type: TransactionType | 'all'
}>({
  type: 'all'
})

const categories = computed(() => categoriesStore.categories);

const filteredTransactions = computed<Transaction[]>(() => {
  const allTransactions = transactionsStore.transactions.filter(t => {
    if (filters.type === 'all') {
      return true;
    }
    return t.type === filters.type;
  });

  if (excludedCategoryIds.value.length === 0) {
    return allTransactions;
  }

  return allTransactions.filter(t => {
    // Keep transactions without a category or if their category is not in the excluded list
    return !t.category_id || !excludedCategoryIds.value.includes(t.category_id);
  });
});

const periodIncome = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
});

const periodExpense = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
});

const periodTransferOut = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'transfer' && t.wallet_id === walletId.value)
    .reduce((sum, t) => sum + t.amount, 0);
});

const periodTransferIn = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'transfer' && t.destination_wallet_id === walletId.value)
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

const walletEndDate = computed(() => {
  if (endDate.value) {
    return 'Until ' + format(parseISO(endDate.value), 'dd MMM yyyy');
  }

  return 'All Time';
})

const fetchWalletData = async () => {
  loading.value = true;
  try {
    const dateRange: { start_date?: string, end_date?: string } = {};
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
      
      // Calculate end date as one day before next month's configured date
      const customEndDate = new Date(customStartDate);
      customEndDate.setMonth(customEndDate.getMonth() + 1);
      customEndDate.setDate(firstDay - 1);
      
      startDate.value = format(customStartDate, 'yyyy-MM-dd');
      endDate.value = format(customEndDate, 'yyyy-MM-dd');
      break;
    }
    case 'all':
      startDate.value = '';
      endDate.value = '';
      break;
  }
};

const setCustomFilter = () => {
  selectedFilter.value = 'custom';
  // The watch effect will trigger the data fetch
}

const navigatePeriod = (direction: 'previous' | 'next') => {
  if (!startDate.value || !endDate.value) return;
  
  const firstDay = configStore.firstDayOfMonth;
  const start = parseISO(startDate.value);
  
  if (direction === 'previous') {
    // Move to previous month's configured date
    const newStart = new Date(start);
    newStart.setMonth(newStart.getMonth() - 1);
    newStart.setDate(firstDay);
    
    // Set end date to day before the configured date
    const newEnd = new Date(newStart);
    newEnd.setMonth(newEnd.getMonth() + 1);
    newEnd.setDate(firstDay - 1);
    
    startDate.value = format(newStart, 'yyyy-MM-dd');
    endDate.value = format(newEnd, 'yyyy-MM-dd');
  } else {
    // Move to next month's configured date
    const newStart = new Date(start);
    newStart.setMonth(newStart.getMonth() + 1);
    newStart.setDate(firstDay);
    
    // Set end date to day before the configured date
    const newEnd = new Date(newStart);
    newEnd.setMonth(newEnd.getMonth() + 1);
    newEnd.setDate(firstDay - 1);
    
    startDate.value = format(newStart, 'yyyy-MM-dd');
    endDate.value = format(newEnd, 'yyyy-MM-dd');
  }
}

const goToPreviousPeriod = () => navigatePeriod('previous');
const goToNextPeriod = () => navigatePeriod('next');

watch([startDate, endDate], fetchWalletData, { immediate: false });

const handleWalletSaved = async () => {
  showModal.value = false;
  await fetchWalletData();
}

const handleTransactionSaved = async () => {
  showTransactionModal.value = false;
  await fetchWalletData();
}

const editTransactions = (trx: Transaction) => {
  selectedTransaction.value = trx;
  transactionType.value = trx.type;
  showTransactionModal.value = true;
}

const deleteTransaction = async (id: string) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    const result = await transactionsStore.deleteTransaction(id);
    if (result.success) {
      await fetchWalletData();
    }
  }
};

const openTransactionModal = (type: TransactionType) => {
  transactionType.value = type;
  selectedTransaction.value = null;
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
  categoriesStore.fetchCategories();
  const defaultFilter = configStore.firstDayOfMonth === 1 ? 'all' : 'custom';
  setFilter(defaultFilter); // Set initial filter and fetch data
  if (defaultFilter === 'all') {
    fetchWalletData();
  }
});
</script>
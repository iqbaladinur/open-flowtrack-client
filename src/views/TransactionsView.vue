<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-neon">{{ $t('transactions.title') }}</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            {{ $t('transactions.subtitle') }}
          </p>
        </div>
        <div class="flex items-center gap-4 lg:gap-2 justify-between">
          <div class="flex items-center gap-3 justify-start">
            <button @click="goToPreviousPeriod" class="flex items-center btn-secondary p-2 rounded-full btn-borderless" :disabled="readableDate === 'All'">
              <ChevronLeft class="size-4" />
            </button>
            <span class="text-xs italic text-gray-600 dark:text-gray-300">
              {{ readableDate }}
            </span>
            <button @click="goToNextPeriod" class="flex items-center btn-secondary p-2 rounded-full btn-borderless" :disabled="readableDate === 'All'">
              <ChevronRight class="size-4" />
            </button>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <button @click="showFilters = !showFilters" class="btn-secondary p-2" title="filter" :class="{ 'text-blue-700 dark:text-neon': showFilters }">
              <Filter v-if="showFilters" class="size-4" />
              <FilterX v-if="!showFilters" class="size-4" />
            </button>
            <button @click="showCategoryFilterModal = true" class="btn-secondary gap-2 flex items-center p-2 relative">
              <Tag class="size-4"/>
              <span v-if="excludedCategoryIds.length > 0"
                class="bg-primary-100 text-primary-800 dark:bg-primary-400 dark:text-primary-900 rounded-full text-[10px] absolute -right-2 -top-2 h-4 min-w-4 flex items-center justify-center">
                {{ excludedCategoryIds.length }}
              </span>
            </button>
            <button @click="exportToJson" class="btn btn-secondary gap-2 flex items-center p-2" title="export">
              <Download class="size-4" />
            </button>
            <button @click="shareTransactions" class="btn-secondary lg:hidden p-2" :disabled="loadingShare" title="share">
              <span v-if="loadingShare" class="flex items-center gap-2">
                <LoadingSpinner size="size-4"/>
              </span>
              <span v-else class="flex items-center gap-2">
                <Share2 class="size-4" />
              </span>
            </button>
            <router-link v-if="configStore.isApiKeyAiExist" to="/transactions/bulk-expense" class="btn-error hidden lg:flex p-2" title="bulk expense">
              <ScanTextIcon class="size-4" />
            </router-link>
            <button @click="showAddModal = true" class="btn-primary hidden sm:flex p-2">
              <Plus class="size-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div v-if="showFilters" class="card p-4 space-y-4">
        <!-- Type Filter -->
        <div>
          <label class="label mb-2 px-2">{{ $t('transactions.type') }}</label>
          <div class="flex items-center space-x-2 overflow-x-auto py-2 px-2">
            <button @click="filters.type = ''" :class="['btn flex-shrink-0', filters.type === '' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">{{ $t('transactions.allTypes') }}</button>
            <button @click="filters.type = 'income'" :class="['btn flex-shrink-0', filters.type === 'income' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">
              <TrendingUp class="w-4 h-4 mr-1.5" />
              {{ $t('transactions.income') }}
            </button>
            <button @click="filters.type = 'expense'" :class="['btn flex-shrink-0', filters.type === 'expense' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">
              <TrendingDown class="w-4 h-4 mr-1.5" />
              {{ $t('transactions.expense') }}
            </button>
            <button @click="filters.type = 'transfer'" :class="['btn flex-shrink-0', filters.type === 'transfer' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">
              <ArrowRightLeft class="w-4 h-4 mr-1.5" />
              {{ $t('transactions.transfer') }}
            </button>
          </div>
        </div>

        <!-- Wallet Filter -->
        <div>
          <label class="label mb-2 px-2">{{ $t('transactions.wallet') }}</label>
          <div class="flex items-center space-x-2 overflow-x-auto py-2 px-2">
            <button @click="filters.wallet_id = ''" :class="['btn flex-shrink-0', filters.wallet_id === '' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">{{ $t('transactions.allWallets') }}</button>
            <button
              v-for="wallet in walletsStore.wallets"
              :key="wallet.id"
              @click="filters.wallet_id = wallet.id"
              :class="['btn flex-shrink-0', { 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double': filters.wallet_id === wallet.id, 'btn-secondary': filters.wallet_id !== wallet.id }]"
            >
              <Wallet class="w-4 h-4 mr-1.5" />
              {{ wallet.name }}
            </button>
          </div>
        </div>

        <!-- Date Range Filter -->
        <div>
          <label class="label mb-2 px-2">{{ $t('transactions.dateRange') }}</label>
          <div class="flex items-center space-x-2 overflow-x-auto py-2 px-2">
            <button @click="setDateRange()" :class="['btn flex-shrink-0', !dateRangePreset ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">{{ $t('transactions.all') }}</button>
            <button @click="toggleCustomDateRange" :class="['btn flex-shrink-0', showCustomDateRange ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">{{ $t('transactions.customPeriod') }}</button>
            <button @click="setDateRange('today')" :class="['btn flex-shrink-0', dateRangePreset === 'today' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">{{ $t('transactions.today') }}</button>
            <button @click="setDateRange('weekly')" :class="['btn flex-shrink-0', dateRangePreset === 'weekly' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">{{ $t('transactions.thisWeek') }}</button>
            <button @click="setDateRange('monthly')" :class="['btn flex-shrink-0', dateRangePreset === 'monthly' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">{{ $t('transactions.thisMonth') }}</button>
            <button @click="setDateRange('yearly')" :class="['btn flex-shrink-0', dateRangePreset === 'yearly' ? 'btn-primary outline-2 outline-offset-2 outline-blue-500 outline-double' : 'btn-secondary']">{{ $t('transactions.thisYear') }}</button>
          </div>
          <template v-if="showCustomDateRange">
            <div v-if="showCustomDateRange" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-2">
              <div>
                <label for="start_date" class="label">{{ $t('transactions.startDate') }}</label>
                <input id="start_date" v-model="filters.start_date" type="date" class="input" @change="onCustomDateChange" />
              </div>
              <div>
                <label for="end_date" class="label">{{ $t('transactions.endDate') }}</label>
                <input id="end_date" v-model="filters.end_date" type="date" class="input" @change="onCustomDateChange" />
              </div>
            </div>
            <div class="flex justify-evenly lg:justify-start items-center gap-2 mt-4 p-2">
              <button @click="goToPreviousPeriod" class="btn btn-primary flex-1 lg:flex-none">{{ $t('transactions.previousPeriod') }}</button>
              <button @click="goToNextPeriod" class="btn btn-primary flex-1 lg:flex-none">{{ $t('transactions.nextPeriod') }}</button>
            </div>
          </template>
        </div>

        <div class="mt-10 flex justify-start items-center gap-4 px-2">
          <button @click="resetFilters" class="btn btn-primary flex-1 lg:flex-none">
            <RotateCcw class="w-4 h-4 mr-1.5" />
            {{ $t('transactions.resetFilters') }}
          </button>
        </div>
      </div>

      <!-- Transactions List -->
      <div class="card">
        <div v-if="transactionsStore.loading" class="p-8">
          <LoadingSpinner fullHeight />
        </div>

        <div v-else-if="transactions.length === 0" class="text-center py-12 px-2">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowUpDown class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('transactions.noTransactionsFound') }}</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            {{ $t('transactions.tryAdjustingFilters') }}
          </p>
          <button @click="showAddModal = true" class="btn-primary">
            <Plus class="w-4 h-4 mr-2" />
            {{ $t('transactions.addTransaction') }}
          </button>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <TransactionItem
            v-for="(transaction, i) in transactions"
            :key="transaction.id"
            :transaction="transaction"
            show-type
            show-actions
            :class="{ 'rounded-t-xl': i === 0, 'rounded-b-xl': i === (transactions?.length - 1) }"
            @edit="editTransaction"
            @delete="deleteTransaction"
          />
        </div>
      </div>
    </div>

    <!-- Floating Add Button for Mobile -->
    <QuickAction>
      <router-link v-if="configStore.isApiKeyAiExist" to="/transactions/bulk-expense" class="btn-error text-white rounded-xl p-3 shadow-lg flex items-center justify-center flex-shrink-0">
        <ScanTextIcon class="w-6 h-6" />
        <span class="sr-only">{{ $t('transactions.bulkExpense') }}</span>
      </router-link>
      <button @click="showAddModal = true" class="btn-primary rounded-xl p-3 shadow-lg flex items-center justify-center flex-shrink-0">
        <Plus class="w-6 h-6" />
        <span class="sr-only">{{ $t('transactions.addTransaction') }}</span>
      </button>
    </QuickAction>

    <!-- Add/Edit Transaction Modal -->
    <TransactionModal
      v-model="showAddModal"
      :transaction="selectedTransaction"
      @success="handleTransactionSaved"
    />
    <CategoryFilterModal 
      v-model="showCategoryFilterModal" 
      :categories="categories"
      :excluded-categories="excludedCategoryIds" 
      @update:excluded-categories="excludedCategoryIds = $event" 
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useWalletsStore } from '@/stores/wallets';
import { useTransactionsStore } from '@/stores/transactions';
import { useConfigStore } from '@/stores/config';
import { useCategoriesStore } from '@/stores/categories';
import AppLayout from '@/components/layouts/AppLayout.vue';
import TransactionModal from '@/components/transaction/TransactionModal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import TransactionItem from '@/components/transaction/TransactionItem.vue';
import QuickAction from '@/components/shared/QuickAction.vue';
import CategoryFilterModal from '@/components/category/CategoryFilterModal.vue';
import type { Transaction } from '@/types/transaction';
import {
  Plus,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Filter,
  Wallet,
  RotateCcw,
  Download,
  Share2,
  ScanTextIcon,
  ArrowRightLeft,
  FilterX,
  ChevronLeft,
  ChevronRight,
  Tag
} from 'lucide-vue-next';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, endOfDay, format, parseISO } from 'date-fns';

const { t } = useI18n();
const walletsStore = useWalletsStore();
const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();
const categoriesStore = useCategoriesStore();

const showAddModal = ref(false);
const showFilters = ref(false); // Show by default for better UX
const selectedTransaction = ref<Transaction | null>(null);
const loadingShare = ref<boolean>(false);
const showCategoryFilterModal = ref(false);
const excludedCategoryIds = ref<string[]>([]);

const filters = reactive({
  type: '',
  wallet_id: '',
  start_date: '',
  end_date: '',
});

const dateRangePreset = ref<'today' | 'weekly' | 'monthly' | 'yearly' | 'custom' | null>(null);
const showCustomDateRange = ref(false);

const categories = computed(() => categoriesStore.categories);

const transactions = computed(() => {
  const sortedTransactions = transactionsStore.transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (excludedCategoryIds.value.length === 0) {
    return sortedTransactions;
  }

  return sortedTransactions.filter(t => {
    return !t.category_id || !excludedCategoryIds.value.includes(t.category_id);
  });
});

const readableDate = computed(() => {
  if (!filters.start_date && !filters.end_date) {
    return t('transactions.all')
  }
  return format(endOfDay(filters.start_date), 'dd MMM') + ' - ' + format(endOfDay(filters.end_date), 'dd MMM')
});

const setDateRange = (preset?: 'today' | 'weekly' | 'monthly' | 'yearly') => {
  dateRangePreset.value = preset || null;
  showCustomDateRange.value = false;
  const today = new Date();
  today.setHours(24, 0, 0); //set today always as end date
  let startDate = new Date();
  let endDate = new Date();
  switch (preset) {
    case 'today':
      startDate = today;
      endDate = today;
      break;
    case 'weekly':
      startDate = startOfWeek(today);
      endDate = endOfWeek(today);
      break;
    case 'monthly':
      const startMonth = startOfMonth(today);
      startMonth.setHours(0, 0, 0); 
      startDate = startMonth;
      endDate = endOfMonth(today);
      break;
    case 'yearly':
      startDate = startOfYear(today);
      endDate = endOfYear(today);
      break;
  }

  filters.start_date = dateRangePreset.value ? startDate.toISOString() : '';
  filters.end_date = dateRangePreset.value ? endDate.toISOString() : '';
};

const toggleCustomDateRange = () => {
  showCustomDateRange.value = !showCustomDateRange.value;
  dateRangePreset.value = showCustomDateRange.value ? 'custom' : null;
  
  if (showCustomDateRange.value) {
    const today = new Date();
    const firstDay = configStore.firstDayOfMonth;
    
    let startDate = new Date(today.getFullYear(), today.getMonth(), firstDay);

    // If today's date is before the first day of this calendar month,
    // it means we are still in the previous financial month.
    if (today.getDate() < firstDay) {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setDate(firstDay - 1);

    filters.start_date = format(startDate, 'yyyy-MM-dd');
    filters.end_date = format(endDate, 'yyyy-MM-dd');
  } else {
    filters.start_date = '';
    filters.end_date = '';
  }
};

const onCustomDateChange = () => {
  dateRangePreset.value = 'custom';
};

const exportToJson = () => {
  const data = transactions.value.filter(t => configStore.includeHiddenWalletsInCalculation ? true : !t.wallet?.hidden);
  if (data.length === 0) {
    alert(t('transactions.noTransactionsToExport'));
    return;
  }

  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

  let filename = 'transactions';
  const startDate = filters.start_date ? format(new Date(filters.start_date), 'yyyy-MM-dd') : '';
  const endDate = filters.end_date ? format(new Date(filters.end_date), 'yyyy-MM-dd') : '';

  if (startDate && endDate) {
    filename += `_${startDate}_to_${endDate}`;
  } else if (startDate) {
    filename += `_from_${startDate}`;
  } else if (endDate) {
    filename += `_until_${endDate}`;
  } else {
    filename += '_all';
  }
  filename += '.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', filename);
  linkElement.click();
};

const resetFilters = () => {
  filters.type = '';
  filters.wallet_id = '';
  filters.start_date = '';
  filters.end_date = '';
  dateRangePreset.value = null;
  showCustomDateRange.value = false;
};

const editTransaction = (transaction: Transaction) => {
  selectedTransaction.value = transaction;
  showAddModal.value = true;
};

const handleTransactionSaved = () => {
  showAddModal.value = false;
  // Refresh transactions and wallet balances
  const today = endOfDay(new Date()).toISOString();
  getTransactions(filters);
  walletsStore.fetchWallets(true, undefined, today);
};

watch(showAddModal, (isShowing) => {
  if (!isShowing) {
    selectedTransaction.value = null;
  }
});

const deleteTransaction = async (id: string) => {
  if (confirm(t('transactions.deleteConfirm'))) {
    const result = await transactionsStore.deleteTransaction(id);
    if (result.success) {
      walletsStore.fetchWallets(true);
    }
  }
};

const getTransactions = (filters: any) => {
  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '')
  );
  transactionsStore.fetchTransactions(cleanedFilters, Object.keys(cleanedFilters).length === 0);
}

const navigatePeriod = (direction: 'previous' | 'next') => {
  if (!filters.start_date || !filters.end_date) return;
  dateRangePreset.value = 'custom';
  
  const firstDay = configStore.firstDayOfMonth;
  const start = parseISO(filters.start_date);
  
  if (direction === 'previous') {
    // Move to previous month's configured date
    const newStart = new Date(start);
    newStart.setMonth(newStart.getMonth() - 1);
    newStart.setDate(firstDay);
    
    // Set end date to day before the configured date
    const newEnd = new Date(newStart);
    newEnd.setMonth(newEnd.getMonth() + 1);
    newEnd.setDate(firstDay - 1);
    
    filters.start_date = format(newStart, 'yyyy-MM-dd');
    filters.end_date = format(newEnd, 'yyyy-MM-dd');
  } else {
    // Move to next month's configured date
    const newStart = new Date(start);
    newStart.setMonth(newStart.getMonth() + 1);
    newStart.setDate(firstDay);
    
    // Set end date to day before the configured date
    const newEnd = new Date(newStart);
    newEnd.setMonth(newEnd.getMonth() + 1);
    newEnd.setDate(firstDay - 1);
    
    filters.start_date = format(newStart, 'yyyy-MM-dd');
    filters.end_date = format(newEnd, 'yyyy-MM-dd');
  }
}

const goToPreviousPeriod = () => navigatePeriod('previous');
const goToNextPeriod = () => navigatePeriod('next');

const shareTransactions = async () => {
  loadingShare.value = true;
  try {
    const data = transactions.value.filter(t => configStore.includeHiddenWalletsInCalculation ? true : !t.wallet?.hidden);
    if (data.length === 0) {
      alert(t('transactions.noTransactionsToShare'));
      return;
    }

    const dataStr = JSON.stringify(data, null, 2);

    let filename = 'transactions';
    const startDate = filters.start_date ? format(new Date(filters.start_date), 'yyyy-MM-dd') : '';
    const endDate = filters.end_date ? format(new Date(filters.end_date), 'yyyy-MM-dd') : '';
    let period = '';

    if (startDate && endDate) {
      filename += `_${startDate}_to_${endDate}`;
      period = `${startDate} to ${endDate}`;
    } else if (startDate) {
      filename += `_from_${startDate}`;
      period = `from ${startDate}`;
    } else if (endDate) {
      filename += `_until_${endDate}`;
      period = `until ${endDate}`;
    } else {
      filename += '_all';
      period = 'all';
    }
    
    const jsonFilename = filename + '.json';
    const txtFilename = filename + '.json.txt';

    const file = new File([dataStr], txtFilename, { type: 'text/plain' });

    const formatted = data.map(tx => {
      const type = tx.type.toUpperCase();
      const amount = tx.amount;
      const date = format(tx.date, 'EEE, dd-MM-yyyy');
      const category = tx.category?.name || t('transactions.uncategorized');
      const wallet = tx.wallet?.name || t('transactions.unknownWallet');
      const walletdestination = tx.destinationWallet?.name || t('transactions.unknownWallet');
      const note = tx.note;
      if (tx.type === 'transfer') {
        return `${date}: ${t('transactions.transferOf')} ${amount} ${t('transactions.from')} ${wallet} ${t('transactions.to')} ${walletdestination} (${note || t('transactions.noNote')})`;
      }
      return `${date}: ${type} ${t('transactions.of')} ${amount} ${t('transactions.for')} ${category} (${note || t('transactions.noNote')}) ${t('transactions.onWallet')} ${wallet}`;
    });

    // Concatenate into one big prompt-friendly string
    const llmFriendlyData = `${t('transactions.shareTransactionData')} (${period}): \n\n\`\`\`\n${formatted.join("\n")}\n\`\`\`\n\n`;

    const shareData = {
      title: jsonFilename,
      text: llmFriendlyData,
      files: [file],
    };

    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      throw new Error(t('transactions.sharingNotSupported'));
    }
  } catch (error: any) {
    alert(t('transactions.failedToShare') + ' ' + error?.message);
  } finally {
    loadingShare.value = false;
  }
};

// Watch filters and fetch transactions when they change
watch(
  filters,
  (newFilters) => {
    getTransactions(newFilters);
  },
  { deep: true }
);

onMounted(async () => {
  // getTransactions(filters);
  toggleCustomDateRange();
  const today = endOfDay(new Date());
  await Promise.all([
    walletsStore.fetchWallets(true, undefined, today.toISOString()),
    // The initial fetch will now use the default monthly filter
    // transactionsStore.fetchTransactions(), 
  ]);
  categoriesStore.fetchCategories();
});
</script>

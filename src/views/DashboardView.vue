<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Welcome Section -->
      <div>
        <h1 class="text-xl lg:text-3xl font-bold text-sepia-900 dark:text-neon mb-2">
          {{ $t('dashboard.title') }}, {{ authStore.user?.full_name || $t('common.user') }}!
        </h1>
        <p class="text-sepia-600 dark:text-gray-400 text-sm">
          {{ $t('dashboard.subtitle') }}
        </p>
      </div>

      <div>
        <div class="flex items-center justify-between card p-2 mb-3 rounded-2xl">
          <div class="flex items-center gap-3 justify-start">
            <button @click="prevDate" class="flex items-center btn-secondary p-2 rounded-full btn-borderless">
              <ChevronLeft class="size-4 text-sepia-600 dark:text-gray-300" />
            </button>
            <span class="text-xs italic text-sepia-600 dark:text-gray-300">
              {{ readableDate }}
            </span>
            <button @click="nextDate" class="flex items-center btn-secondary p-2 rounded-full btn-borderless">
              <ChevronRight class="size-4 text-sepia-600 dark:text-gray-300" />
            </button>
          </div>

          <button @click="configStore.toggleShowAmount"
            class="p-2 rounded-full text-sepia-600 dark:text-gray-400 hover:bg-sepia-100 dark:hover:bg-gray-700 hover:text-sepia-700 dark:hover:text-gray-300 transition-colors">
            <Unlock v-if="configStore.showAmount" class="size-4" />
            <lock v-else class="size-4" />
          </button>
        </div>

        <!-- Summary Cards -->
        <div
          class="flex lg:grid lg:grid-cols-5 lg:gap-4 overflow-x-auto space-x-3 lg:space-x-0 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <SummaryCard3 :title="$t('dashboard.totalBalance')" :value="totalBalance" :icon="Wallet"
            icon-bg-class="bg-primary-100/90 dark:bg-primary-700/90" icon-class="text-blue-600 dark:text-blue-400"
            value-class="text-blue-900 dark:text-white" />
          <SummaryCard3 :title="$t('dashboard.income')" :value="summary.total_income" :icon="TrendingUp"
            icon-bg-class="bg-success-100 dark:bg-success-900/50" icon-class="text-success-600 dark:text-success-400"
            value-class="text-success-600 dark:text-success-400" prefix="+" accent="positive" />
          <SummaryCard3 :title="$t('dashboard.expenses')" :value="summary.total_expense" :icon="TrendingDown"
            icon-bg-class="bg-error-100 dark:bg-error-900/50" icon-class="text-error-600 dark:text-error-400"
            value-class="text-error-600 dark:text-error-400" prefix="-" accent="negative" />
          <SummaryCard3 :title="$t('dashboard.transfers')" :value="summary.total_transfer" :icon="ArrowRightLeft"
            icon-bg-class="bg-blue-100 dark:bg-blue-900/50" icon-class="text-blue-600 dark:text-blue-400"
            value-class="text-blue-600 dark:text-blue-400" />
          <SummaryCard3 :title="$t('dashboard.netIncome')" :value="summary.net_income" :icon="Scale"
            icon-bg-class="bg-warning-100 dark:bg-warning-900/50" icon-class="text-warning-600 dark:text-warning-400"
            :value-class="{
              'text-success-600 dark:text-success-400': summary.net_income > 0,
              'text-gray-800 dark:text-gray-200': summary.net_income === 0,
              'text-error-600 dark:text-error-400': summary.net_income < 0,
            }" :prefix="summary.net_income >= 0 ? '+' : ''"
            :accent="summary.net_income >= 0 ? 'positive' : 'negative'" />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-4 gap-2 lg:flex lg:flex-wrap">
        <!-- Add Income -->
        <button @click="toggleAddTransaction('income')" :title="$t('dashboard.addIncome')"
          :aria-label="$t('dashboard.addIncome')"
          class="flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 rounded-xl lg:rounded-lg p-3 lg:px-3 lg:py-2 bg-success-50 dark:bg-success-900/20 lg:bg-gradient-to-br lg:from-success-100 lg:to-success-200 dark:lg:from-success-900/40 dark:lg:to-success-800/30 shadow-sm transition-all active:scale-95 lg:active:scale-100 hover:shadow-md lg:hover:from-success-200 lg:hover:to-success-300 dark:lg:hover:from-success-900/50 dark:lg:hover:to-success-800/40">
          <div
            class="flex size-8 lg:size-5 flex-shrink-0 items-center justify-center rounded-lg lg:rounded-md backdrop-blur-sm shadow bg-gradient-to-br from-success-400/80 to-success-600/90 dark:from-success-500/70 dark:to-success-700/80">
            <Plus class="size-4 lg:size-3.5 text-white" strokeWidth="2.5" />
          </div>
          <span class="text-[10px] lg:text-xs font-semibold text-success-700 dark:text-success-400 lg:dark:text-success-300 whitespace-nowrap">
            {{ $t('dashboard.income') }}
          </span>
        </button>

        <!-- Add Expense -->
        <button @click="toggleAddTransaction('expense')" :title="$t('dashboard.addExpense')"
          :aria-label="$t('dashboard.addExpense')"
          class="flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 rounded-xl lg:rounded-lg p-3 lg:px-3 lg:py-2 bg-error-50 dark:bg-error-900/20 lg:bg-gradient-to-br lg:from-error-100 lg:to-error-200 dark:lg:from-error-900/40 dark:lg:to-error-800/30 shadow-sm transition-all active:scale-95 lg:active:scale-100 hover:shadow-md lg:hover:from-error-200 lg:hover:to-error-300 dark:lg:hover:from-error-900/50 dark:lg:hover:to-error-800/40">
          <div
            class="flex size-8 lg:size-5 flex-shrink-0 items-center justify-center rounded-lg lg:rounded-md backdrop-blur-sm shadow bg-gradient-to-br from-error-400/80 to-error-600/90 dark:from-error-500/70 dark:to-error-700/80">
            <Minus class="size-4 lg:size-3.5 text-white" strokeWidth="2.5" />
          </div>
          <span class="text-[10px] lg:text-xs font-semibold text-error-700 dark:text-error-400 lg:dark:text-error-300 whitespace-nowrap">
            {{ $t('dashboard.expenses') }}
          </span>
        </button>

        <!-- Add Transfer -->
        <button @click="toggleAddTransaction('transfer')" :title="$t('dashboard.addTransfer')"
          :aria-label="$t('dashboard.addTransfer')"
          class="flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 rounded-xl lg:rounded-lg p-3 lg:px-3 lg:py-2 bg-blue-50 dark:bg-blue-900/20 lg:bg-gradient-to-br lg:from-blue-100 lg:to-blue-200 dark:lg:from-blue-900/40 dark:lg:to-blue-800/30 shadow-sm transition-all active:scale-95 lg:active:scale-100 hover:shadow-md lg:hover:from-blue-200 lg:hover:to-blue-300 dark:lg:hover:from-blue-900/50 dark:lg:hover:to-blue-800/40">
          <div
            class="flex size-8 lg:size-5 flex-shrink-0 items-center justify-center rounded-lg lg:rounded-md backdrop-blur-sm shadow bg-gradient-to-br from-blue-400/80 to-blue-600/90 dark:from-blue-500/70 dark:to-blue-700/80">
            <ArrowRightLeft class="size-4 lg:size-3.5 text-white" />
          </div>
          <span class="text-[10px] lg:text-xs font-semibold text-blue-700 dark:text-blue-400 lg:dark:text-blue-300 whitespace-nowrap">
            {{ $t('dashboard.transfers') }}
          </span>
        </button>

        <!-- Manage Wallets -->
        <router-link to="/wallets" :title="$t('dashboard.manageWallets')" :aria-label="$t('dashboard.manageWallets')"
          class="flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2 rounded-xl lg:rounded-lg p-3 lg:px-3 lg:py-2 bg-purple-50 dark:bg-purple-900/20 lg:bg-gradient-to-br lg:from-purple-100 lg:to-purple-200 dark:lg:from-purple-900/40 dark:lg:to-purple-800/30 shadow-sm transition-all active:scale-95 lg:active:scale-100 hover:shadow-md lg:hover:from-purple-200 lg:hover:to-purple-300 dark:lg:hover:from-purple-900/50 dark:lg:hover:to-purple-800/40">
          <div
            class="flex size-8 lg:size-5 flex-shrink-0 items-center justify-center rounded-lg lg:rounded-md backdrop-blur-sm shadow bg-gradient-to-br from-purple-400/80 to-purple-600/90 dark:from-purple-500/70 dark:to-purple-700/80">
            <Wallet class="size-4 lg:size-3.5 text-white" />
          </div>
          <span class="text-[10px] lg:text-xs font-semibold text-purple-700 dark:text-purple-400 lg:dark:text-purple-300 whitespace-nowrap">
            {{ $t('nav.wallets') }}
          </span>
        </router-link>
      </div>

      <!-- AI Suggestions -->
      <div v-if="configStore.isApiKeyAiExist" class="card p-4">
        <div class="flex items-center mb-4">
          <div
            class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-sepia-100 dark:bg-indigo-900/50 mr-3">
            <BrainCircuit class="w-4 h-4 text-sepia-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-sepia-900 dark:text-neon">{{ $t('dashboard.aiSuggestions') }}</h2>
            <p v-if="configStore.isApiKeyAiExist" class="text-xs text-sepia-500 dark:text-gray-400 italic">({{
              periodicAnalytics.start }} - {{ periodicAnalytics.end }})</p>
          </div>
        </div>
        <div v-if="analyticsLoading && analyticsSugestion.length === 0" class="flex justify-center items-center py-8">
          <LoadingSpinner class="w-8 h-8" />
        </div>
        <div v-else-if="analyticsSugestion.length > 0" class="flex gap-2 flex-wrap">
          <p v-for="(suggestion, index) in analyticsSugestion" :key="index"
            class="text-sm text-sepia-700 dark:text-gray-300 bg-sepia-100/50 dark:bg-gray-700/10 px-3 py-2 rounded-lg w-full lg:whitespace-nowrap lg:w-auto">
            {{ suggestion }}
          </p>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-sepia-500 dark:text-gray-400">
            {{ configStore.isApiKeyAiExist ? $t('dashboard.noSuggestionsAvailable') : $t('dashboard.addApiKeyForAi') }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveBudgetSection />
        <!-- Recent Transactions -->
        <div>
          <div class="card p-4">
            <div class="flex items-center lg:items-start justify-between mb-4">
              <h2 class="text-lg font-semibold text-sepia-900 dark:text-neon">{{ $t('dashboard.recentTransactions') }}
              </h2>
              <router-link to="/transactions"
                class="text-sm text-sepia-600 dark:text-primary-400 hover:text-sepia-700 dark:hover:text-primary-300 font-medium">
                <LucideArrowUpRightFromSquare class="w-4 h-4" />
              </router-link>
            </div>

            <div v-if="recentTransactions.length === 0" class="text-center py-8">
              <div
                class="w-16 h-16 bg-sepia-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUpDown class="w-8 h-8 text-sepia-400 dark:text-gray-400" />
              </div>
              <p class="text-sepia-500 dark:text-gray-400 mb-4">{{ $t('dashboard.noTransactionsYet') }}</p>
              <button @click="showAddTransactionModal = true" class="btn-primary">
                {{ $t('dashboard.addFirstTransaction') }}
              </button>
            </div>

            <div v-else class="space-y-3">
              <TransactionItem v-for="transaction in recentTransactions" :key="transaction.id"
                :transaction="transaction" class="rounded-xl -mx-3" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Transaction Modals -->
    <TransactionModal v-model="showAddTransactionModal" :type="transactionType" @success="handleTransactionAdded" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useWalletsStore } from '@/stores/wallets';
import { useTransactionsStore } from '@/stores/transactions';
import { useConfigStore } from '@/stores/config';
import { useAnalyticsStore } from '@/stores/analytics';
import AppLayout from '@/components/layouts/AppLayout.vue';
import TransactionModal from '@/components/transaction/TransactionModal.vue';
// import QuickActionButton from '@/components/shared/QuickActionButton.vue';
// import SummaryCard from '@/components/dashboard/SummaryCard.vue';
// import SummaryCard2 from '@/components/dashboard/SummaryCard2.vue';
import SummaryCard3 from '@/components/dashboard/SummaryCard3.vue';
import ActiveBudgetSection from '@/components/dashboard/ActiveBudgetSection.vue';
import TransactionItem from '@/components/transaction/TransactionItem.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  BrainCircuit,
  Scale,
  LucideArrowUpRightFromSquare,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  TrendingUpDown
} from 'lucide-vue-next';
import { endOfDay, format, parseISO, subDays } from 'date-fns';
import { reactive } from 'vue';
import { useReportsStore } from '@/stores/reports';
import type { TransactionType } from '@/types/transaction';

const authStore = useAuthStore();
const walletsStore = useWalletsStore();
const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();
const analyticsStore = useAnalyticsStore();
const reportsStore = useReportsStore();
const { analyticsSugestion, loading: analyticsLoading } = storeToRefs(analyticsStore);

const showAddTransactionModal = ref(false);
const transactionType = ref<TransactionType>('income');

const endDateSummary = ref(endOfDay(new Date()));

const readableDate = computed(() => {
  return format(endOfDay(endDateSummary.value), 'E, dd MMM yyy')
});

const totalBalance = computed(() => {
  return walletsStore.wallets
    .filter(w => configStore.includeHiddenWalletsInCalculation ? true : !w.hidden)
    .reduce((sum, wallet) => sum + (wallet.current_balance || 0), 0);
});

const periodicAnalytics = reactive({
  start: '',
  end: ''
});

const summary = ref({
  total_income: 0,
  total_expense: 0,
  total_transfer: 0,
  net_income: 0,
});

const recentTransactions = computed(() => {
  return transactionsStore.transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
});

const handleTransactionAdded = () => {
  showAddTransactionModal.value = false;
  const today = endOfDay(new Date());
  const someDaysBefore = subDays(today, 4);
  const todayIso = today.toISOString();
  const someDaysBeforeIso = someDaysBefore.toISOString();

  transactionsStore.fetchTransactions({
    start_date: someDaysBeforeIso,
    end_date: todayIso
  }, true);
  walletsStore.fetchWallets(true, undefined, todayIso);
  setSummary({ endDate: todayIso, includeHidden: configStore.includeHiddenWalletsInCalculation });
};

const toggleAddTransaction = (type: TransactionType) => {
  showAddTransactionModal.value = true;
  transactionType.value = type;
}

function getAIAnalytics() {
  if (!configStore.isApiKeyAiExist) {
    return;
  }
  const today = new Date();
  const firstDay = configStore.firstDayOfMonth;

  let startDate = new Date(today.getFullYear(), today.getMonth(), firstDay);

  if (today.getDate() < firstDay) {
    startDate.setMonth(startDate.getMonth() - 1);
  }

  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);
  endDate.setDate(firstDay - 1);

  periodicAnalytics.start = format(startDate, 'dd-MMM-yyyy');
  periodicAnalytics.end = format(endDate, 'dd-MMM-yyyy');

  analyticsStore.fetchAnalyticsSugestion({
    start_date: format(startDate, 'yyyy-MM-dd'),
    end_date: format(endDate, 'yyyy-MM-dd')
  });
}

async function setSummary(filter: {
  startDate?: string;
  endDate?: string;
  includeHidden?: boolean;
}) {
  const { data } = await reportsStore.getSummary(filter);
  if (data) {
    summary.value = {
      total_income: data.totalIncome || 0,
      total_expense: data.totalExpense || 0,
      total_transfer: data.totalTransfer || 0,
      net_income: data.net || 0,
    };
  }
}

const nextDate = () => {
  const firstDay = configStore.firstDayOfMonth;
  const endDateNow = endOfDay(endDateSummary.value);
  const start = parseISO(endDateNow.toISOString());

  const newStart = new Date(start);
  // Set to day 1 first to avoid month overflow issues
  newStart.setDate(1);
  // Move to next month
  newStart.setMonth(newStart.getMonth() + 1);
  // Set the correct end date
  if (firstDay === 1) {
    // Get last day of this month by going to next month day 0
    newStart.setMonth(newStart.getMonth() + 1);
    newStart.setDate(0);
  } else {
    newStart.setDate(firstDay - 1);
  }

  endDateSummary.value = newStart;
  const todayIso = endDateSummary.value.toISOString();
  walletsStore.fetchWallets(true, undefined, todayIso);
  setSummary({ endDate: todayIso, includeHidden: configStore.includeHiddenWalletsInCalculation });
}

const prevDate = () => {
  const firstDay = configStore.firstDayOfMonth;
  const endDateNow = endOfDay(endDateSummary.value);
  const today = endOfDay(new Date());

  // Calculate current period's start date
  let currentPeriodStart = new Date(today.getFullYear(), today.getMonth(), firstDay - 1);
  if (today.getDate() < firstDay) {
    currentPeriodStart.setMonth(currentPeriodStart.getMonth() - 1);
  }

  // Check if current endDateSummary is at today (meaning user hasn't navigated yet)
  const isAtToday =
    endDateNow.getFullYear() === today.getFullYear() &&
    endDateNow.getMonth() === today.getMonth() &&
    endDateNow.getDate() === today.getDate();

  let newEnd;

  if (isAtToday) {
    // First click: go to the first day of current period
    newEnd = new Date(currentPeriodStart);
  } else {
    // Subsequent clicks: navigate to previous month period end
    const start = parseISO(endDateNow.toISOString());
    newEnd = new Date(start);
    // Set to day 1 first to avoid month overflow issues
    newEnd.setDate(1);
    // Move to previous month
    newEnd.setMonth(newEnd.getMonth() - 1);
    // Set the correct end date
    if (firstDay === 1) {
      // Get last day of this month by going to next month day 0
      newEnd.setMonth(newEnd.getMonth() + 1);
      newEnd.setDate(0);
    } else {
      newEnd.setDate(firstDay - 1);
    }
  }

  endDateSummary.value = newEnd;
  const todayIso = endDateSummary.value.toISOString();
  walletsStore.fetchWallets(true, undefined, todayIso);
  setSummary({ endDate: todayIso, includeHidden: configStore.includeHiddenWalletsInCalculation });
}

onMounted(async () => {
  await configStore.fetchConfig();
  const today = endDateSummary.value;
  const someDaysBefore = subDays(today, 4);
  const todayIso = today.toISOString();
  const someDaysBeforeIso = someDaysBefore.toISOString();
  walletsStore.fetchWallets(true, undefined, todayIso);
  transactionsStore.fetchTransactions({ start_date: someDaysBeforeIso, end_date: todayIso });
  setSummary({ endDate: todayIso, includeHidden: configStore.includeHiddenWalletsInCalculation });
  getAIAnalytics();
});
</script>

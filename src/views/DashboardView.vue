<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Welcome Section -->
      <div>
        <h1 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-neon mb-2">
          Welcome back, {{ authStore.user?.full_name || 'User' }}!
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Here's your financial overview
        </p>
      </div>

      <div>
        <div class="flex items-center justify-between card p-2 mb-3">  
          <div class="flex items-center gap-3 justify-start">
            <button @click="prevDate" class="flex items-center btn-secondary p-2 rounded-full btn-borderless">
              <ChevronLeft class="size-4" />
            </button>
            <span class="text-xs italic text-gray-600 dark:text-gray-300">
              {{ readableDate }}
            </span>
            <button @click="nextDate" class="flex items-center btn-secondary p-2 rounded-full btn-borderless">
              <ChevronRight class="size-4" />
            </button>
          </div>

          <button @click="configStore.toggleShowAmount" class="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Unlock v-if="configStore.showAmount" class="size-4" />
            <lock v-else class="size-4" />
          </button>
        </div>

        <!-- Summary Cards -->
        <div class="flex lg:grid lg:grid-cols-5 lg:gap-4 overflow-x-auto space-x-3 lg:space-x-0 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <SummaryCard3
            title="Total Balance"
            :value="totalBalance"
            :icon="Wallet"
            icon-bg-class="bg-primary-100/90 dark:bg-primary-700/90"
            icon-class="text-blue-600 dark:text-blue-400"
            value-class="text-blue-900 dark:text-white"
          />
          <SummaryCard3
            title="Income"
            :value="summary.total_income"
            :icon="TrendingUp"
            icon-bg-class="bg-success-100 dark:bg-success-900/50"
            icon-class="text-success-600 dark:text-success-400"
            value-class="text-success-600 dark:text-success-400"
            prefix="+"
            accent="positive"
          />
          <SummaryCard3
            title="Expenses"
            :value="summary.total_expense"
            :icon="TrendingDown"
            icon-bg-class="bg-error-100 dark:bg-error-900/50"
            icon-class="text-error-600 dark:text-error-400"
            value-class="text-error-600 dark:text-error-400"
            prefix="-"
            accent="negative"
          />
          <SummaryCard3
            title="Transfers"
            :value="summary.total_transfer"
            :icon="ArrowRightLeft"
            icon-bg-class="bg-blue-100 dark:bg-blue-900/50"
            icon-class="text-blue-600 dark:text-blue-400"
            value-class="text-blue-600 dark:text-blue-400"
          />
          <SummaryCard3
            title="Net Income"
            :value="summary.net_income"
            :icon="Scale"
            icon-bg-class="bg-warning-100 dark:bg-warning-900/50"
            icon-class="text-warning-600 dark:text-warning-400"
            :value-class="{
              'text-success-600 dark:text-success-400': summary.net_income > 0,
              'text-gray-800 dark:text-gray-200': summary.net_income === 0,
              'text-error-600 dark:text-error-400': summary.net_income < 0,
            }"
            :prefix="summary.net_income >= 0 ? '+' : ''"
            :accent="summary.net_income >= 0 ? 'positive' : 'negative'"
          />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-neon mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            @click="toggleAddTransaction('income')"
            icon-bg-class="bg-success-100 dark:bg-success-900"
            class="text-center border-r border-b lg:border-none border-white/60 dark:border-gray-600/40"
          >
            <template #icon>
              <Plus class="w-5 h-5 text-success-600 dark:text-success-400" />
            </template>
            Add Income
          </QuickActionButton>

          <QuickActionButton
            @click="toggleAddTransaction('expense')"
            icon-bg-class="bg-error-100 dark:bg-error-900"
            class="text-center border-l border-b lg:border-none border-white/60 dark:border-gray-600/40"
          >
            <template #icon>
              <Minus class="w-5 h-5 text-error-600 dark:text-error-400" />
            </template>
            Add Expense
          </QuickActionButton>

          <QuickActionButton
            @click="toggleAddTransaction('transfer')"
            icon-bg-class="bg-blue-100 dark:bg-blue-900"
            class="text-center border-r border-t lg:border-none border-white/60 dark:border-gray-600/40"
          >
            <template #icon>
              <ArrowRightLeft class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </template>
            Add Transfer
          </QuickActionButton>

          <QuickActionButton
            to="/wallets"
            icon-bg-class="bg-primary-100 dark:bg-primary-900"
            class="text-center border-l border-t lg:border-none border-white/60 dark:border-gray-600/40"
          >
            <template #icon>
              <Wallet class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </template>
            Manage Wallets
          </QuickActionButton>
        </div>
      </div>

      <!-- AI Suggestions -->
      <div class="card p-4">
        <div class="flex items-center mb-4">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 mr-3">
            <BrainCircuit class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-neon">What happened this period?</h2>
            <p v-if="configStore.isApiKeyAiExist" class="text-xs text-gray-500 dark:text-gray-400 italic">({{ periodicAnalytics.start }} - {{ periodicAnalytics.end }})</p>
          </div>
        </div>
        <div v-if="analyticsLoading" class="flex justify-center items-center py-8">
          <LoadingSpinner class="w-8 h-8" />
        </div>
        <div v-else-if="analyticsSugestion.length > 0" class="flex gap-2 flex-wrap">
          <p v-for="(suggestion, index) in analyticsSugestion" :key="index" class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/10 px-3 py-2 rounded-lg w-full lg:whitespace-nowrap lg:w-auto">
            {{ suggestion }}
          </p>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">
            {{ configStore.isApiKeyAiExist ? 'No suggestions available at the moment.' : 'Add gemini apikey on settings to enable this feature.' }}
          </p>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="card p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-neon">Recent Transactions</h2>
          <router-link
            to="/transactions"
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            <LucideArrowUpRightFromSquare class="w-4 h-4"/>
          </router-link>
        </div>

        <div v-if="recentTransactions.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowUpDown class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-gray-500 dark:text-gray-400 mb-4">No transactions yet</p>
          <button @click="showAddTransactionModal = true" class="btn-primary">
            Add your first transaction
          </button>
        </div>

        <div v-else class="space-y-3">
          <TransactionItem
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            :transaction="transaction"
            class="rounded-xl -mx-3"
          />
        </div>
      </div>
    </div>

    <!-- Add Transaction Modals -->
    <TransactionModal
      v-model="showAddTransactionModal"
      :type="transactionType"
      @success="handleTransactionAdded"
    />
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
import QuickActionButton from '@/components/shared/QuickActionButton.vue';
// import SummaryCard from '@/components/dashboard/SummaryCard.vue';
// import SummaryCard2 from '@/components/dashboard/SummaryCard2.vue';
import SummaryCard3 from '@/components/dashboard/SummaryCard3.vue';
import TransactionItem from '@/components/transaction/TransactionItem.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  ArrowUpDown,
  BrainCircuit,
  Scale,
  LucideArrowUpRightFromSquare,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock
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
  return format(endOfDay(endDateSummary.value), 'E, dd MMM')
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
  newStart.setMonth(newStart.getMonth() + 1);
  newStart.setDate(firstDay - 1);

  endDateSummary.value = newStart;
  const todayIso = endDateSummary.value.toISOString();
  walletsStore.fetchWallets(true, undefined, todayIso);
  setSummary({ endDate: todayIso, includeHidden: configStore.includeHiddenWalletsInCalculation });
}

const prevDate = () => {
  const firstDay = configStore.firstDayOfMonth;
  const endDateNow = endOfDay(endDateSummary.value);
  const start = parseISO(endDateNow.toISOString());

  const newStart = new Date(start);
  newStart.setMonth(newStart.getMonth() - 1);
  newStart.setDate(firstDay - 1);
  endDateSummary.value = newStart;
  const todayIso = endDateSummary.value.toISOString();
  walletsStore.fetchWallets(true, undefined, todayIso);
  setSummary({ endDate: todayIso, includeHidden: configStore.includeHiddenWalletsInCalculation });
}

onMounted(async () => {
  configStore.fetchConfig();
  const today = endDateSummary.value;
  const someDaysBefore = subDays(today, 4);
  const todayIso = today.toISOString();
  const someDaysBeforeIso = someDaysBefore.toISOString();
  walletsStore.fetchWallets(true, undefined, todayIso);
  transactionsStore.fetchTransactions({ start_date: someDaysBeforeIso,  end_date: todayIso });
  setSummary({ endDate: todayIso, includeHidden: configStore.includeHiddenWalletsInCalculation });
  getAIAnalytics();
});
</script>

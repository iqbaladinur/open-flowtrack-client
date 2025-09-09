<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-neon mb-2">
          Welcome back, {{ authStore.user?.full_name || 'User' }}!
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Here's your financial overview until today
        </p>
      </div>

      <!-- Summary Cards -->
      <div class="flex sm:grid sm:grid-cols-4 sm:gap-4 overflow-x-auto space-x-3 sm:space-x-0 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <!-- Total Balance -->
        <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1">
          <div class="flex flex-col h-full">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 mb-3">
              <Wallet class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="mt-auto">
              <p class="text-xs text-gray-500 dark:text-gray-400">Total Balance</p>
              <p class="text-xs font-medium text-blue-900 dark:text-white font-mono">
                {{ configStore.formatCurrency(totalBalance) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Monthly Income -->
        <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 -ml-4 sm:ml-0">
          <div class="flex flex-col h-full">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-success-100 dark:bg-success-900/50 mb-3">
              <TrendingUp class="w-4 h-4 text-success-600 dark:text-success-400" />
            </div>
            <div class="mt-auto">
              <p class="text-xs text-gray-500 dark:text-gray-400">Income</p>
              <p class="text-xs font-medium text-success-600 dark:text-success-400 font-mono">
                +{{ configStore.formatCurrency(alltimeIncomev2) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Monthly Expenses -->
        <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 -ml-4 sm:ml-0">
          <div class="flex flex-col h-full">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-error-100 dark:bg-error-900/50 mb-3">
              <TrendingDown class="w-4 h-4 text-error-600 dark:text-error-400" />
            </div>
            <div class="mt-auto">
              <p class="text-xs text-gray-500 dark:text-gray-400">Expenses</p>
              <p class="text-xs font-medium text-error-600 dark:text-error-400 font-mono">
                -{{ configStore.formatCurrency(alltimeExpensev2) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Net Income -->
        <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 -ml-4 sm:ml-0">
          <div class="flex flex-col h-full">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-warning-100 dark:bg-warning-900/50 mb-3">
              <Scale class="w-4 h-4 text-warning-600 dark:text-warning-400" />
            </div>
            <div class="mt-auto">
              <p class="text-xs text-gray-500 dark:text-gray-400">Net Income</p>
              <p 
                class="text-xs font-medium font-mono"
                :class="{
                  'text-success-600 dark:text-success-400': netIncomev2 > 0,
                  'text-gray-800 dark:text-gray-200': netIncomev2 === 0,
                  'text-error-600 dark:text-error-400': netIncomev2 < 0,
                }"
              >
                {{ netIncomev2 >= 0 ? '+' : '' }}{{ configStore.formatCurrency(netIncomev2) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-neon mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            @click="toggleAddTransaction('income')"
            icon-bg-class="bg-success-100 dark:bg-success-900"
            class="text-center"
          >
            <template #icon>
              <Plus class="w-5 h-5 text-success-600 dark:text-success-400" />
            </template>
            Add Income
          </QuickActionButton>

          <QuickActionButton
            @click="toggleAddTransaction('expense')"
            icon-bg-class="bg-error-100 dark:bg-error-900"
            class="text-center"
          >
            <template #icon>
              <Minus class="w-5 h-5 text-error-600 dark:text-error-400" />
            </template>
            Add Expense
          </QuickActionButton>

          <QuickActionButton
            to="/wallets"
            icon-bg-class="bg-primary-100 dark:bg-primary-900"
            class="text-center"
          >
            <template #icon>
              <Wallet class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </template>
            Manage Wallets
          </QuickActionButton>

          <QuickActionButton
            to="/budgets"
            icon-bg-class="bg-warning-100 dark:bg-warning-900"
            class="text-center"
          >
            <template #icon>
              <Target class="w-5 h-5 text-warning-600 dark:text-warning-400" />
            </template>
            Set Budgets
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
import TransactionItem from '@/components/transaction/TransactionItem.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Target,
  ArrowUpDown,
  BrainCircuit,
  Scale,
  LucideArrowUpRightFromSquare
} from 'lucide-vue-next';
import { endOfDay, format, subDays } from 'date-fns';
import { reactive } from 'vue';
import { useReportsStore } from '@/stores/reports';

const authStore = useAuthStore();
const walletsStore = useWalletsStore();
const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();
const analyticsStore = useAnalyticsStore();
const reportsStore = useReportsStore();
const { analyticsSugestion, loading: analyticsLoading } = storeToRefs(analyticsStore);

const showAddTransactionModal = ref(false);
const transactionType = ref<'income' | 'expense'>('income');

const totalBalance = computed(() => {
  return walletsStore.wallets
    .filter(w => configStore.includeHiddenWalletsInCalculation ? true : !w.hidden)
    .reduce((sum, wallet) => sum + (wallet.current_balance || 0), 0);
});

const periodicAnalytics = reactive({
  start: '',
  end: ''
});

const alltimeIncomev2 = ref(0);
const alltimeExpensev2 = ref(0);
const netIncomev2 = ref(0);

const recentTransactions = computed(() => {
  return transactionsStore.transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
});

const handleTransactionAdded = () => {
  showAddTransactionModal.value = false;
  // Force refresh data
  const today = endOfDay(new Date());
  const someDaysBefore = subDays(today, 4);
  const todayIso = today.toISOString();
  const someDaysBeforeIso = someDaysBefore.toISOString();

  transactionsStore.fetchTransactions({
    start_date: someDaysBeforeIso,
    end_date: todayIso
  }, true);
  walletsStore.fetchWallets(true, undefined, todayIso);
};

const toggleAddTransaction = (type: 'income' | 'expense') => {
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

  // If today's date is before the first day of this calendar month,
  // it means we are still in the previous financial month.
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
  alltimeIncomev2.value = data?.totalIncome || 0;
  alltimeExpensev2.value = data?.totalExpense || 0;
  netIncomev2.value = data?.net || 0;
}

onMounted(async () => {
  configStore.fetchConfig();
  const today = endOfDay(new Date());
  const someDaysBefore = subDays(today, 4);
  const todayIso = today.toISOString();
  const someDaysBeforeIso = someDaysBefore.toISOString();
  walletsStore.fetchWallets(true, undefined, todayIso);
  transactionsStore.fetchTransactions({ start_date: someDaysBeforeIso,  end_date: todayIso });
  setSummary({ endDate: todayIso, includeHidden: configStore.includeHiddenWalletsInCalculation });
  getAIAnalytics();
});
</script>

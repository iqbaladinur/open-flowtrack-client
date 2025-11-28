<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Welcome Section -->
      <div>
        <h1 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-neon mb-2">
          {{ $t('dashboard.title') }}, {{ authStore.user?.full_name || $t('common.user') }}!
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          {{ $t('dashboard.subtitle') }}
        </p>
      </div>

      <div>
        <div class="flex items-center justify-between card p-2 mb-3 rounded-2xl">
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

          <button @click="configStore.toggleShowAmount"
            class="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
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
      <div class="flex gap-2 lg:flex-wrap">
        <!-- Add Income -->
        <button @click="toggleAddTransaction('income')" :title="$t('dashboard.addIncome')"
          :aria-label="$t('dashboard.addIncome')"
          class="group relative flex flex-1 lg:flex-initial aspect-square lg:aspect-auto items-center justify-center lg:justify-start gap-2 rounded-xl lg:rounded-lg bg-white dark:bg-gray-900/40 lg:bg-gradient-to-br lg:from-success-100 lg:to-success-200 dark:lg:from-success-900/40 dark:lg:to-success-800/30 p-4 lg:px-3 lg:py-2 shadow-sm transition-all hover:shadow-md lg:hover:from-success-200 lg:hover:to-success-300 dark:lg:hover:from-success-900/50 dark:lg:hover:to-success-800/40">
          <div
            class="relative flex size-12 lg:h-5 lg:w-5 flex-shrink-0 items-center justify-center rounded-xl lg:rounded-md bg-success-500 dark:bg-success-600">
            <Plus class="absolute size-5 lg:h-3.5 lg:w-3.5 text-white" strokeWidth="2.5" />
          </div>
          <span class="hidden lg:inline text-xs font-semibold text-success-700 dark:text-success-300 whitespace-nowrap">
            {{ $t('dashboard.addIncome') }}
          </span>
          <!-- Mobile Label Tooltip -->
          <span
            class="lg:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-success-700 dark:text-success-400 whitespace-nowrap opacity-0 group-active:opacity-100 transition-opacity pointer-events-none">
            {{ $t('dashboard.addIncome') }}
          </span>
        </button>

        <!-- Add Expense -->
        <button @click="toggleAddTransaction('expense')" :title="$t('dashboard.addExpense')"
          :aria-label="$t('dashboard.addExpense')"
          class="group relative flex flex-1 lg:flex-initial aspect-square lg:aspect-auto items-center justify-center lg:justify-start gap-2 rounded-xl lg:rounded-lg bg-white dark:bg-gray-900/40 lg:bg-gradient-to-br lg:from-error-100 lg:to-error-200 dark:lg:from-error-900/40 dark:lg:to-error-800/30 p-4 lg:px-3 lg:py-2 shadow-sm transition-all hover:shadow-md lg:hover:from-error-200 lg:hover:to-error-300 dark:lg:hover:from-error-900/50 dark:lg:hover:to-error-800/40">
          <div
            class="relative flex size-12 lg:h-5 lg:w-5 flex-shrink-0 items-center justify-center rounded-xl lg:rounded-md bg-error-500 dark:bg-error-600">
            <Minus class="absolute size-5 lg:h-3.5 lg:w-3.5 text-white" strokeWidth="2.5" />
          </div>
          <span class="hidden lg:inline text-xs font-semibold text-error-700 dark:text-error-300 whitespace-nowrap">
            {{ $t('dashboard.addExpense') }}
          </span>
          <!-- Mobile Label Tooltip -->
          <span
            class="lg:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-error-700 dark:text-error-400 whitespace-nowrap opacity-0 group-active:opacity-100 transition-opacity pointer-events-none">
            {{ $t('dashboard.addExpense') }}
          </span>
        </button>

        <!-- Add Transfer -->
        <button @click="toggleAddTransaction('transfer')" :title="$t('dashboard.addTransfer')"
          :aria-label="$t('dashboard.addTransfer')"
          class="group relative flex flex-1 lg:flex-initial aspect-square lg:aspect-auto items-center justify-center lg:justify-start gap-2 rounded-xl lg:rounded-lg bg-white dark:bg-gray-900/40 lg:bg-gradient-to-br lg:from-blue-100 lg:to-blue-200 dark:lg:from-blue-900/40 dark:lg:to-blue-800/30 p-4 lg:px-3 lg:py-2 shadow-sm transition-all hover:shadow-md lg:hover:from-blue-200 lg:hover:to-blue-300 dark:lg:hover:from-blue-900/50 dark:lg:hover:to-blue-800/40">
          <div
            class="relative flex size-12 lg:h-5 lg:w-5 flex-shrink-0 items-center justify-center rounded-xl lg:rounded-md bg-blue-500 dark:bg-blue-600">
            <ArrowRightLeft class="absolute size-5 lg:h-3.5 lg:w-3.5 text-white" />
          </div>
          <span class="hidden lg:inline text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap">
            {{ $t('dashboard.addTransfer') }}
          </span>
          <!-- Mobile Label Tooltip -->
          <span
            class="lg:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-blue-700 dark:text-blue-400 whitespace-nowrap opacity-0 group-active:opacity-100 transition-opacity pointer-events-none">
            {{ $t('dashboard.addTransfer') }}
          </span>
        </button>

        <!-- Manage Wallets -->
        <router-link to="/wallets" :title="$t('dashboard.manageWallets')" :aria-label="$t('dashboard.manageWallets')"
          class="group relative flex flex-1 lg:flex-initial aspect-square lg:aspect-auto items-center justify-center lg:justify-start gap-2 rounded-xl lg:rounded-lg bg-white dark:bg-gray-900/40 lg:bg-gradient-to-br lg:from-purple-100 lg:to-purple-200 dark:lg:from-purple-900/40 dark:lg:to-purple-800/30 p-4 lg:px-3 lg:py-2 shadow-sm transition-all hover:shadow-md lg:hover:from-purple-200 lg:hover:to-purple-300 dark:lg:hover:from-purple-900/50 dark:lg:hover:to-purple-800/40">
          <div
            class="relative flex size-12 lg:h-5 lg:w-5 flex-shrink-0 items-center justify-center rounded-xl lg:rounded-md bg-purple-500 dark:bg-purple-600">
            <Wallet class="absolute size-5 lg:h-3.5 lg:w-3.5 text-white" />
          </div>
          <span class="hidden lg:inline text-xs font-semibold text-purple-700 dark:text-purple-300 whitespace-nowrap">
            {{ $t('dashboard.manageWallets') }}
          </span>
          <!-- Mobile Label Tooltip -->
          <span
            class="lg:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-purple-700 dark:text-purple-400 whitespace-nowrap opacity-0 group-active:opacity-100 transition-opacity pointer-events-none">
            {{ $t('dashboard.manageWallets') }}
          </span>
        </router-link>
      </div>

      <!-- AI Suggestions -->
      <div v-if="configStore.isApiKeyAiExist" class="card p-4">
        <div class="flex items-center mb-4">
          <div
            class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 mr-3">
            <BrainCircuit class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-neon">{{ $t('dashboard.aiSuggestions') }}</h2>
            <p v-if="configStore.isApiKeyAiExist" class="text-xs text-gray-500 dark:text-gray-400 italic">({{
              periodicAnalytics.start }} - {{ periodicAnalytics.end }})</p>
          </div>
        </div>
        <div v-if="analyticsLoading" class="flex justify-center items-center py-8">
          <LoadingSpinner class="w-8 h-8" />
        </div>
        <div v-else-if="analyticsSugestion.length > 0" class="flex gap-2 flex-wrap">
          <p v-for="(suggestion, index) in analyticsSugestion" :key="index"
            class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/10 px-3 py-2 rounded-lg w-full lg:whitespace-nowrap lg:w-auto">
            {{ suggestion }}
          </p>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">
            {{ configStore.isApiKeyAiExist ? $t('dashboard.noSuggestionsAvailable') : $t('dashboard.addApiKeyForAi') }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card p-4 flex flex-col">
          <div class="flex lg:items-start justify-between mb-4 lg:flex-row flex-col-reverse">
            <!-- here -->
            <div class="flex items-center gap-3 mt-4 lg:mt-0 lg:justify-start">
              <button @click="navigateBudgetDate('previous')"
                class="flex items-center btn-secondary p-2 rounded-full btn-borderless">
                <ChevronLeft class="size-4" />
              </button>
              <span class="text-xs italic text-gray-600 dark:text-gray-300 mx-auto">
                {{ activeBudgetPeriod }}
              </span>
              <button @click="navigateBudgetDate('next')"
                class="flex items-center btn-secondary p-2 rounded-full btn-borderless">
                <ChevronRight class="size-4" />
              </button>
            </div>

            <div class="flex gap-2 justify-between items-center lg:justify-end lg:items-start">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-neon">{{ $t('dashboard.activeBudget') }}</h2>
              <router-link to="/budgets"
                class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                <LucideArrowUpRightFromSquare class="size-4" />
              </router-link>
            </div>
          </div>

          <div v-if="budgets.length === 0 && !budgetsStore.loading" class="text-center py-8 m-auto">
            <div
              class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target class="size-8 text-gray-400" />
            </div>
            <p class="text-gray-500 dark:text-gray-400 mb-4">{{ $t('dashboard.noBudgetActive') }}</p>
          </div>

          <div v-if="budgetsStore.loading && budgets.length === 0" class="flex justify-center items-center py-8 my-auto">
            <LoadingSpinner class="w-8 h-8" />
          </div>

          <div v-else-if="budgets.length > 0" class="space-y-10">
            <div class="card p-4">
              <div class="mb-3">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ $t('dashboard.overallActiveBudget')
                  }}</h3>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{{ $t('dashboard.combinedUsage') }}</p>
              </div>

              <!-- Metrics Grid -->
              <div class="mb-4">
                <!-- Mobile: Vertical Stack -->
                <div class="flex flex-col space-y-2.5 md:hidden">
                  <!-- Total Spent -->
                  <div class="flex items-baseline justify-between gap-3">
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 flex-shrink-0">{{ $t('dashboard.spent') }}
                    </p>
                    <p class="text-sm font-semibold font-mono text-right break-all" :class="{
                      'text-blue-600 dark:text-blue-400': budgetSummary.usage_percent <= 50,
                      'text-success-600 dark:text-success-400': budgetSummary.usage_percent > 50 && budgetSummary.usage_percent <= 75,
                      'text-warning-600 dark:text-warning-400': budgetSummary.usage_percent > 75 && budgetSummary.usage_percent <= 90,
                      'text-error-600 dark:text-error-400': budgetSummary.usage_percent > 90 && budgetSummary.usage_percent <= 100,
                      'text-red-700 dark:text-red-500': budgetSummary.usage_percent > 100
                    }">
                      {{ configStore.formatCurrency(budgetSummary.total_usage) }}
                    </p>
                  </div>

                  <!-- Remaining -->
                  <div class="flex items-baseline justify-between gap-3">
                    <p class="text-[10px] flex-shrink-0 text-gray-500 dark:text-gray-400">
                      {{ budgetSummary.usage_percent > 100 ? $t('dashboard.over') : $t('dashboard.left') }}
                    </p>
                    <p class="text-sm font-semibold font-mono text-right break-all" :class="{
                      'text-success-600 dark:text-success-400': budgetSummary.usage_percent <= 100,
                      'text-error-500': budgetSummary.usage_percent > 100
                    }">
                      {{ configStore.formatCurrency(budgetSummary.remaining) }}
                    </p>
                  </div>

                  <!-- Budget Limit -->
                  <div class="flex items-baseline justify-between gap-3">
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 flex-shrink-0">{{ $t('dashboard.limit') }}
                    </p>
                    <p class="text-sm font-semibold font-mono text-gray-900 dark:text-white text-right break-all">
                      {{ configStore.formatCurrency(budgetSummary.total_limit) }}
                    </p>
                  </div>
                </div>

                <!-- Desktop: 3 Columns -->
                <div class="hidden md:grid md:grid-cols-3 gap-3">
                  <!-- Total Limit -->
                  <div class="text-center">
                    <p class="text-[9px] text-gray-500 dark:text-gray-400 mb-1">{{ $t('dashboard.limit') }}</p>
                    <p class="text-xs font-semibold font-mono text-gray-900 dark:text-white">
                      {{ configStore.formatCurrency(budgetSummary.total_limit) }}
                    </p>
                  </div>

                  <!-- Total Spent -->
                  <div class="text-center">
                    <p class="text-[9px] text-gray-500 dark:text-gray-400 mb-1">{{ $t('dashboard.spent') }}</p>
                    <p class="text-xs font-semibold font-mono" :class="{
                      'text-blue-600 dark:text-blue-400': budgetSummary.usage_percent <= 50,
                      'text-success-600 dark:text-success-400': budgetSummary.usage_percent > 50 && budgetSummary.usage_percent <= 75,
                      'text-warning-600 dark:text-warning-400': budgetSummary.usage_percent > 75 && budgetSummary.usage_percent <= 90,
                      'text-error-600 dark:text-error-400': budgetSummary.usage_percent > 90 && budgetSummary.usage_percent <= 100,
                      'text-red-700 dark:text-red-500': budgetSummary.usage_percent > 100
                    }">
                      {{ configStore.formatCurrency(budgetSummary.total_usage) }}
                    </p>
                  </div>

                  <!-- Remaining -->
                  <div class="text-center">
                    <p class="text-[9px] text-gray-500 dark:text-gray-400 mb-1">
                      {{ budgetSummary.usage_percent > 100 ? $t('dashboard.over') : $t('dashboard.left') }}
                    </p>
                    <p class="text-xs font-semibold font-mono" :class="{
                      'text-success-600 dark:text-success-400': budgetSummary.usage_percent <= 100,
                      'text-error-500': budgetSummary.usage_percent > 100
                    }">
                      {{ configStore.formatCurrency(budgetSummary.remaining) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="space-y-1.5">
                <div class="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                  <div class="h-1 rounded-full transition-all duration-500" :class="{
                    'bg-blue-500': budgetSummary.usage_percent <= 50,
                    'bg-success-500': budgetSummary.usage_percent > 50 && budgetSummary.usage_percent <= 75,
                    'bg-warning-500': budgetSummary.usage_percent > 75 && budgetSummary.usage_percent <= 90,
                    'bg-error-500': budgetSummary.usage_percent > 90 && budgetSummary.usage_percent <= 100,
                    'bg-red-700': budgetSummary.usage_percent > 100
                  }"
                    :style="{ width: `${budgetSummary.usage_percent > 100 ? 100 : budgetSummary.usage_percent}%` }" />
                </div>
                <div class="text-right">
                  <span class="text-[10px] font-medium" :class="{
                    'text-blue-600 dark:text-blue-400': budgetSummary.usage_percent <= 50,
                    'text-success-600 dark:text-success-400': budgetSummary.usage_percent > 50 && budgetSummary.usage_percent <= 75,
                    'text-warning-600 dark:text-warning-400': budgetSummary.usage_percent > 75 && budgetSummary.usage_percent <= 90,
                    'text-error-600 dark:text-error-400': budgetSummary.usage_percent > 90 && budgetSummary.usage_percent <= 100,
                    'text-red-700 dark:text-red-500': budgetSummary.usage_percent > 100
                  }">
                    {{ budgetSummary.usage_percent.toFixed(1) }}% {{ $t('dashboard.used') }}
                  </span>
                </div>
              </div>
            </div>
            <div class="card">
              <BudgetCard v-for="budget in budgets" :key="`budgetlist_` + budget.id" class="mb-1 last:mb-0" :budget="budget"
                :simple-view="true" />
            </div>
          </div>
        </div>
        <!-- Recent Transactions -->
        <div>
          <div class="card p-4">
            <div class="flex items-center lg:items-start justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-neon">{{ $t('dashboard.recentTransactions') }}
              </h2>
              <router-link to="/transactions"
                class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                <LucideArrowUpRightFromSquare class="w-4 h-4" />
              </router-link>
            </div>

            <div v-if="recentTransactions.length === 0" class="text-center py-8">
              <div
                class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUpDown class="w-8 h-8 text-gray-400" />
              </div>
              <p class="text-gray-500 dark:text-gray-400 mb-4">{{ $t('dashboard.noTransactionsYet') }}</p>
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
import TransactionItem from '@/components/transaction/TransactionItem.vue';
import BudgetCard from '@/components/budget/BudgetCard.vue';
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
  Target,
  TrendingUpDown
} from 'lucide-vue-next';
import { endOfDay, format, parseISO, subDays } from 'date-fns';
import { reactive } from 'vue';
import { useReportsStore } from '@/stores/reports';
import type { TransactionType } from '@/types/transaction';
import { useBudgetsStore } from '@/stores/budgets';

const authStore = useAuthStore();
const walletsStore = useWalletsStore();
const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();
const analyticsStore = useAnalyticsStore();
const reportsStore = useReportsStore();
const budgetsStore = useBudgetsStore();
const { analyticsSugestion, loading: analyticsLoading } = storeToRefs(analyticsStore);

const showAddTransactionModal = ref(false);
const transactionType = ref<TransactionType>('income');

const endDateSummary = ref(endOfDay(new Date()));
const activeBudgetDate = reactive({
  start: '',
  end: ''
});

const readableDate = computed(() => {
  return format(endOfDay(endDateSummary.value), 'E, dd MMM yyy')
});

const activeBudgetPeriod = computed(() => {
  if (activeBudgetDate.start && activeBudgetDate.end) {
    return `${format(endOfDay(activeBudgetDate.start), 'E, dd MMM')} - ${format(endOfDay(activeBudgetDate.end), 'E, dd MMM')}`
  }

  return 'No Date'
})

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
  // Match the number of active budgets, with a minimum of 5
  const transactionCount = Math.max(budgets.value.length, 5);
  return transactionsStore.transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, transactionCount);
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

const navigateBudgetDate = (flow: 'next' | 'previous') => {
  const firstDay = configStore.firstDayOfMonth;
  const start = parseISO(activeBudgetDate.start);

  if (flow === 'next') {
    // active budget date
    const newStartBudget = new Date(start);
    newStartBudget.setMonth(newStartBudget.getMonth() + 1);
    newStartBudget.setDate(firstDay);
    // Set end date to day before the configured date
    const newEndBudget = new Date(newStartBudget);
    newEndBudget.setMonth(newEndBudget.getMonth() + 1);
    newEndBudget.setDate(firstDay - 1);
    activeBudgetDate.start = format(newStartBudget, 'yyyy-MM-dd');
    activeBudgetDate.end = format(newEndBudget, 'yyyy-MM-dd');
  } else {
    // active budget
    const newStartBudget = new Date(start);
    newStartBudget.setMonth(newStartBudget.getMonth() - 1);
    newStartBudget.setDate(firstDay);
    // Set end date to day before the configured date
    const newEndBudget = new Date(newStartBudget);
    newEndBudget.setMonth(newEndBudget.getMonth() + 1);
    newEndBudget.setDate(firstDay - 1);
    activeBudgetDate.start = format(newStartBudget, 'yyyy-MM-dd');
    activeBudgetDate.end = format(newEndBudget, 'yyyy-MM-dd');
  }

  fetchBudgets(activeBudgetDate.start, activeBudgetDate.end);
}

const budgets = computed(() => {
  return budgetsStore.budgets
    .slice()
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
});

const budgetSummary = computed(() => {
  const total_limit = budgets.value.reduce((sum, budget) => sum + (Number(budget.limit_amount || 0)), 0);
  const total_usage = budgets.value.reduce((sum, budget) => sum + (budget.total_spent || 0), 0);
  const usage_percent = total_limit > 0 ? (total_usage / total_limit) * 100 : 0;
  const remaining = Math.abs(total_limit - total_usage);
  return {
    total_limit,
    total_usage,
    usage_percent,
    remaining,
  };
});

const fetchBudgets = (startDate?: string, endDate?: string) => {
  budgetsStore.fetchBudgets(startDate, endDate);
};

function setInitialBudgetActiveDate() {
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

  activeBudgetDate.start = format(startDate, 'yyyy-MM-dd');
  activeBudgetDate.end = format(endDate, 'yyyy-MM-dd');

  fetchBudgets(activeBudgetDate.start, activeBudgetDate.end);
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
  setInitialBudgetActiveDate();
});
</script>

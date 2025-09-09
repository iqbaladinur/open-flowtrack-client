<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div>
        <h1 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-neon">Reports</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Analyze your financial trends over time
        </p>
      </div>

      <!-- View Switcher -->
      <div class="card p-4">
        <label class="label mb-2">Filter</label>
        <div class="flex items-center justify-stretch lg:justify-start gap-1 flex-wrap">
          <button @click="currentView = 'monthly'"
            :class="['btn flex-1 lg:flex-none', currentView === 'monthly' ? 'btn-primary' : 'btn-secondary']">
            <Calendar class="w-4 h-4 mr-2" /> Monthly
          </button>
          <button @click="currentView = 'yearly'"
            :class="['btn flex-1 lg:flex-none', currentView === 'yearly' ? 'btn-primary' : 'btn-secondary']">
            <CalendarClock class="w-4 h-4 mr-2" /> Yearly
          </button>
          <button @click="selectCustomView"
            :class="['btn flex-1 lg:flex-none', currentView === 'custom' ? 'btn-primary' : 'btn-secondary']">
            <SlidersHorizontal class="w-4 h-4 mr-2" /> Custom
          </button>
        </div>

        <div class="mt-4">
          <!-- Monthly Selector -->
          <div v-if="currentView === 'monthly'" class="grid grid-cols-2 gap-4">
            <div>
              <label for="monthly-month" class="label">Month</label>
              <select id="monthly-month" v-model="selectedDate.monthly.month" class="input">
                <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
              </select>
            </div>
            <div>
              <label for="monthly-year" class="label">Year</label>
              <select id="monthly-year" v-model="selectedDate.monthly.year" class="input">
                <option v-for="year in yearList" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
          </div>
          <!-- Yearly Selector -->
          <div v-if="currentView === 'yearly'">
            <label for="yearly-year" class="label">Select Year</label>
            <select id="yearly-year" v-model="selectedDate.yearly.year" class="input">
              <option v-for="year in yearList" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <!-- Custom Range Selector -->
          <div v-if="currentView === 'custom'" class="space-y-4">
            <div class="grid grid-cols-2 gap-1">
              <div>
                <label for="custom-start" class="label">Start Date</label>
                <input id="custom-start" v-model="selectedDate.custom.start" type="date" class="input" />
              </div>
              <div>
                <label for="custom-end" class="label">End Date</label>
                <input id="custom-end" v-model="selectedDate.custom.end" type="date" class="input" />
              </div>
            </div>
            <div class="flex justify-evenly lg:justify-start items-center gap-1 mt-4">
              <button @click="goToPreviousPeriod" class="btn btn-primary flex-1 lg:flex-none">Previous Period</button>
              <button @click="goToNextPeriod" class="btn btn-primary flex-1 lg:flex-none">Next Period</button>
            </div>
            <div>
              <label class="label">Group By</label>
              <div class="flex items-center space-x-1 flex-wrap">
                <button @click="customAggregationLevel = 'daily'"
                  :class="['btn btn-sm', customAggregationLevel === 'daily' ? 'btn-primary' : 'btn-secondary']">Daily</button>
                <button @click="customAggregationLevel = 'weekly'"
                  :class="['btn btn-sm', customAggregationLevel === 'weekly' ? 'btn-primary' : 'btn-secondary']">Weekly</button>
                <button @click="customAggregationLevel = 'monthly'"
                  :class="['btn btn-sm', customAggregationLevel === 'monthly' ? 'btn-primary' : 'btn-secondary']">Monthly</button>
                <button @click="customAggregationLevel = 'yearly'"
                  :class="['btn btn-sm', customAggregationLevel === 'yearly' ? 'btn-primary' : 'btn-secondary']">Yearly</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Content -->
      <div v-if="loading" class="card p-6 flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
      <div v-else-if="transactions.length === 0" class="card text-center py-12">
        <BarChart3 class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500 dark:text-gray-400 px-2">No transaction data available for the selected period.</p>
      </div>
      <div v-else class="space-y-6">
        <!-- Summary Cards -->
        <div
          class="flex sm:grid sm:grid-cols-5 sm:gap-4 overflow-x-auto space-x-3 sm:space-x-0 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <!-- Income -->
          <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 sm:ml-0">
            <div class="flex flex-col h-full">
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-success-100 dark:bg-success-900/50 mb-3">
                <TrendingUp class="w-4 h-4 text-success-600 dark:text-success-400" />
              </div>
              <div class="mt-auto">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Income</p>
                <p class="text-xs font-medium text-success-600 dark:text-success-400 font-mono">
                  {{ configStore.formatCurrency(summary.totalIncome) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Expense -->
          <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 -ml-4 sm:ml-0">
            <div class="flex flex-col h-full">
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-error-100 dark:bg-error-900/50 mb-3">
                <TrendingDown class="w-4 h-4 text-error-600 dark:text-error-400" />
              </div>
              <div class="mt-auto">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Expenses</p>
                <p class="text-xs font-medium text-error-600 dark:text-error-400 font-mono">
                  {{ configStore.formatCurrency(summary.totalExpense) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Transfer -->
          <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 -ml-4 sm:ml-0">
            <div class="flex flex-col h-full">
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 mb-3">
                <ArrowRightLeft class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="mt-auto">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Transfer</p>
                <p class="text-xs font-medium text-blue-600 dark:text-blue-400 font-mono">
                  {{ configStore.formatCurrency(summary.totalTransfer) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Net Income -->
          <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 -ml-4 sm:ml-0">
            <div class="flex flex-col h-full">
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-warning-100 dark:bg-warning-900/50 mb-3">
                <Scale class="w-4 h-4 text-warning-600 dark:text-warning-400" />
              </div>
              <div class="mt-auto">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Net Income</p>
                <p class="text-xs font-medium font-mono" :class="{
                  'text-success-600 dark:text-success-400': summary.net > 0,
                  'text-gray-800 dark:text-gray-200': summary.net === 0,
                  'text-error-600 dark:text-error-400': summary.net < 0,
                }">
                  {{ summary.net >= 0 ? '+' : '' }}{{ configStore.formatCurrency(summary.net) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Expense Ratio -->
          <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 -ml-4 sm:ml-0">
            <div class="flex flex-col h-full">
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 mb-3">
                <PieChartIcon class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="mt-auto">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Expense Ratio</p>
                <p class="text-xs font-medium font-mono" :class="{
                  'text-gray-800 dark:text-gray-200': summary.expenseRatio < 70,
                  'text-orange-600 dark:text-orange-400': summary.expenseRatio >= 70 && summary.expenseRatio <= 80,
                  'text-error-600 dark:text-error-500': summary.expenseRatio > 80,
                }">
                  {{ configStore.formatProsentase(summary.expenseRatio) }}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Expense Ratio Description -->
        <div class="card p-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <h3 class="font-bold text-gray-800 dark:text-gray-200">Understanding Your Expense Ratio</h3>
          <div v-if="summary.totalIncome > 0">
            <div v-if="summary.expenseRatio < 70">
              <p><span class="font-semibold text-success-600 dark:text-success-400">Healthy Zone:</span> Your expense ratio is great! This suggests you have a strong handle on your finances, with income significantly higher than expenses. Keep it up!</p>
            </div>
            <div v-else-if="summary.expenseRatio >= 70 && summary.expenseRatio <= 80">
              <p><span class="font-semibold text-orange-600 dark:text-orange-400">Caution Zone:</span> You're spending a significant portion of your income. It's a good time to review your budget and see if there are opportunities to save more.</p>
            </div>
            <div v-else-if="summary.expenseRatio > 80">
              <p><span class="font-semibold text-error-600 dark:text-error-500">Danger Zone:</span> Your expenses are very close to your income. This is a high-risk situation. We strongly recommend creating a budget and cutting back on non-essential spending.</p>
            </div>
          </div>
          <div v-else>
            <p>Your expense ratio couldn't be calculated because there was no income in this period. The ratio shows what percentage of your income is spent.</p>
          </div>
        </div>

        <!-- Time Series Chart -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ reportTitle }} ({{ configStore.currency }})
          </h2>
          <div class="h-96">
            <TimeSeriesChart v-if="!loading" :chart-data="chartData" />
          </div>
        </div>

        <!-- Breakdown Reports -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start">
          <!-- Category Report -->
          <div class="card p-6 lg:min-h-[500px] flex flex-col gap-4">
            <div class="flex justify-between items-start mb-4 flex-col md:flex-row gap-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Breakdown by Category</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">({{ configStore.currency }})</p>
              </div>
              <div class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-full lg:w-auto">
                <button @click="categoryReportType = 'expense'"
                  :class="['btn btn-sm flex-1 lg:flex-auto', categoryReportType === 'expense' ? 'bg-white dark:bg-gray-600 shadow' : '']">Spending</button>
                <button @click="categoryReportType = 'income'"
                  :class="['btn btn-sm flex-1 lg:flex-auto', categoryReportType === 'income' ? 'bg-white dark:bg-gray-600 shadow' : '']">Income</button>
              </div>
            </div>
            <div v-if="categoryChartData.labels.length === 0"
              class="text-center py-8 flex-1 flex items-center justify-center flex-col">
              <PieChart class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 dark:text-gray-400">No {{ categoryReportType }} data</p>
            </div>
            <div v-else class="flex-1">
              <CategoryPieChart :chart-data="categoryChartData" />
            </div>
          </div>

          <!-- Wallet Report -->
          <div class="card p-6 lg:min-h-[500px]">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Flow by Wallet ({{ configStore.currency }})
            </h2>
            <div v-if="walletReportData.length === 0" class="text-center py-8">
              <Wallet class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 dark:text-gray-400 px-2">No wallet data available</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="item in walletReportData" :key="item.name"
                class="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</h3>
                  <span :class="item.net >= 0 ? 'text-success-600' : 'text-error-600'" class="flex items-center gap-2">
                    <component :is="(item.net >= 0) ? TrendingUp : TrendingDown" class="w-4 h-4" />
                    <span class="font-medium text-sm font-mono">
                      {{ configStore.formatCurrency(item.net) }}
                    </span>
                  </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
                  <span class="text-success-500 flex justify-between"><span>Income</span><span>+{{ configStore.formatCurrency(item.income) }}</span></span>
                  <span class="text-error-500 flex justify-between"><span>Expense</span><span>-{{ configStore.formatCurrency(item.expense) }}</span></span>
                  <span class="text-blue-500 flex justify-between"><span>Transfer In</span><span>+{{ configStore.formatCurrency(item.transferIn) }}</span></span>
                  <span class="text-orange-500 flex justify-between"><span>Transfer Out</span><span>-{{ configStore.formatCurrency(item.transferOut) }}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import { useConfigStore } from '@/stores/config';
import AppLayout from '@/components/layouts/AppLayout.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import TimeSeriesChart from '@/components/reports/TimeSeriesChart.vue';
import CategoryPieChart from '@/components/reports/CategoryPieChart.vue';
import { Calendar, CalendarClock, BarChart3, SlidersHorizontal, PieChart, Wallet, TrendingUp, TrendingDown, Scale, PieChartIcon, ArrowRightLeft } from 'lucide-vue-next';
import type { Transaction } from '@/types/transaction';
import { format, parseISO } from 'date-fns';

type ReportView = 'monthly' | 'yearly' | 'custom';
type AggregationLevel = 'daily' | 'weekly' | 'monthly' | 'yearly';

const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();

const currentView = ref<ReportView>('monthly');
const customAggregationLevel = ref<AggregationLevel>('monthly');
const categoryReportType = ref<'income' | 'expense'>('expense');
const loading = ref(false);
const transactions = ref<Transaction[]>([]);

const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

const selectedDate = reactive({
  monthly: { month: now.getMonth() + 1, year: now.getFullYear() },
  yearly: { year: now.getFullYear() },
  custom: {
    start: startOfMonth.toISOString().split('T')[0],
    end: now.toISOString().split('T')[0]
  },
});

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const yearList = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear + 5; i >= currentYear - 50; i--) {
    years.push(i);
  }
  return years;
});

const reportTitle = computed(() => {
  switch (currentView.value) {
    case 'monthly': return `Monthly Report for ${months[selectedDate.monthly.month - 1]} ${selectedDate.monthly.year}`;
    case 'yearly': return `Yearly Report for ${selectedDate.yearly.year}`;
    case 'custom': return `Custom Report (${selectedDate.custom.start} to ${selectedDate.custom.end})`;
    default: return 'Report';
  }
});

const getStartOfWeek = (d: Date) => {
  const date = new Date(d.getTime());
  const day = date.getUTCDay();
  const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
  const newDate = new Date(date.setUTCDate(diff));
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
}

const chartData = computed(() => {
  const data = transactions.value;
  let aggregation: AggregationLevel;
  let startDate: Date, endDate: Date;

  // Determine aggregation level and date range from the view settings
  switch (currentView.value) {
    case 'monthly':
      aggregation = 'daily';
      startDate = new Date(Date.UTC(selectedDate.monthly.year, selectedDate.monthly.month - 1, 1));
      endDate = new Date(Date.UTC(selectedDate.monthly.year, selectedDate.monthly.month, 0));
      break;
    case 'yearly':
      aggregation = 'monthly';
      startDate = new Date(Date.UTC(selectedDate.yearly.year, 0, 1));
      endDate = new Date(Date.UTC(selectedDate.yearly.year, 11, 31));
      break;
    case 'custom':
      aggregation = customAggregationLevel.value;
      // Ensure custom dates are parsed as UTC by appending Z
      startDate = new Date(selectedDate.custom.start + 'T00:00:00Z');
      endDate = new Date(selectedDate.custom.end + 'T00:00:00Z');
      break;
  }

  const totals = new Map<string, { income: number; expense: number }>();
  const labels: string[] = [];

  // Pre-populate labels and totals map for the entire range to ensure all periods are shown
  if (startDate && endDate && startDate <= endDate) {
    let currentDate = new Date(startDate.getTime());

    while (currentDate <= endDate) {
      let key = '';
      if (aggregation === 'daily') {
        key = currentDate.toISOString().split('T')[0];
        labels.push(key);
        totals.set(key, { income: 0, expense: 0 });
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      } else if (aggregation === 'weekly') {
        const weekStart = getStartOfWeek(new Date(currentDate));
        key = weekStart.toISOString().split('T')[0];
        if (!labels.includes(key)) {
          labels.push(key);
          totals.set(key, { income: 0, expense: 0 });
        }
        currentDate.setUTCDate(currentDate.getUTCDate() + 7);
      } else if (aggregation === 'monthly') {
        key = `${currentDate.getUTCFullYear()}-${String(currentDate.getUTCMonth() + 1).padStart(2, '0')}`;
        labels.push(key);
        totals.set(key, { income: 0, expense: 0 });
        currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
      } else if (aggregation === 'yearly') {
        key = String(currentDate.getUTCFullYear());
        if (!labels.includes(key)) {
          labels.push(key);
          totals.set(key, { income: 0, expense: 0 });
        }
        currentDate.setUTCFullYear(currentDate.getUTCFullYear() + 1);
      }
    }
  }

  // Group transactions into the pre-populated periods
  data.forEach(transaction => {
    // IMPORTANT: Use the 'date' property from the transaction.
    // Parse it as UTC. The 'Z' at the end of the string ensures this.
    const transactionDate = new Date(transaction.date);

    let key = '';
    if (aggregation === 'daily') {
      key = transactionDate.toISOString().split('T')[0];
    } else if (aggregation === 'weekly') {
      key = getStartOfWeek(transactionDate).toISOString().split('T')[0];
    } else if (aggregation === 'monthly') {
      key = `${transactionDate.getUTCFullYear()}-${String(transactionDate.getUTCMonth() + 1).padStart(2, '0')}`;
    } else if (aggregation === 'yearly') {
      key = String(transactionDate.getUTCFullYear());
    }

    if (totals.has(key)) {
      const currentTotals = totals.get(key)!;
      if (transaction.type === 'income') {
        currentTotals.income += transaction.amount;
      } else {
        currentTotals.expense += transaction.amount;
      }
    }
  });

  const incomeData = labels.map(label => totals.get(label)?.income || 0);
  const expenseData = labels.map(label => totals.get(label)?.expense || 0);

  return {
    labels,
    datasets: [
      { label: 'Income', backgroundColor: '#10b981', data: incomeData },
      { label: 'Expense', backgroundColor: '#ef4444', data: expenseData },
    ],
  };
});

const summary = computed(() => {
  return transactions.value.reduce((acc, t) => {
    if (t.type === 'income') acc.totalIncome += t.amount;
    else if(t.type === 'expense') acc.totalExpense += t.amount;
    else acc.totalTransfer += t.amount;
    acc.net = acc.totalIncome - acc.totalExpense;
    acc.expenseRatio = acc.totalExpense / acc.totalIncome * 100;
    return acc;
  }, { totalIncome: 0, totalExpense: 0, net: 0, expenseRatio: 0, totalTransfer: 0 });
});

const categoryChartData = computed(() => {
  const categoryTotals = new Map<string, { name: string, color: string, total: number }>();

  transactions.value
    .filter(t => t.type === categoryReportType.value)
    .forEach(t => {
      if (t.category) {
        // @ts-ignore
        const current = categoryTotals.get(t.category.id) || { name: t.category.name, color: t.category.color, total: 0 };
        current.total += t.amount;
        // @ts-ignore
        categoryTotals.set(t.category.id, current);
      }
    });

  const sortedCategories = Array.from(categoryTotals.values()).sort((a, b) => b.total - a.total);
  const totalAmount = sortedCategories.reduce((sum, cat) => sum + cat.total, 0);

  return {
    labels: sortedCategories.map(c => {
      const percentage = totalAmount > 0 ? ((c.total / totalAmount) * 100).toFixed(1) : '0.0';
      return [`${c.name} (${percentage}%)`, `${configStore.formatCurrency(c.total)}`];
    }),
    datasets: [{
      data: sortedCategories.map(c => c.total),
      backgroundColor: sortedCategories.map(c => `${c.color}4d`), // Append alpha value
      borderColor: sortedCategories.map(c => `${c.color}`), // Append alpha value
    }],
  };
});

const walletReportData = computed(() => {
  const walletTotals = new Map<string, { name: string, income: number, expense: number, transferIn: number, transferOut: number }>();

  transactions.value.forEach(t => {
    // Initialize wallet if not present
    const ensureWallet = (wallet: { id: string, name: string }) => {
      if (!walletTotals.has(wallet.id)) {
        walletTotals.set(wallet.id, { name: wallet.name, income: 0, expense: 0, transferIn: 0, transferOut: 0 });
      }
      return walletTotals.get(wallet.id)!;
    };

    if (t.type === 'income' && t.wallet) {
      ensureWallet(t.wallet).income += t.amount;
    } else if (t.type === 'expense' && t.wallet) {
      ensureWallet(t.wallet).expense += t.amount;
    } else if (t.type === 'transfer' && t.wallet && t.destinationWallet) {
      ensureWallet(t.wallet).transferOut += t.amount;
      ensureWallet(t.destinationWallet).transferIn += t.amount;
    }
  });

  return Array.from(walletTotals.values()).map(w => ({
    ...w,
    net: (w.income + w.transferIn) - (w.expense + w.transferOut),
  })).sort((a, b) => b.net - a.net);
});

const fetchReportData = async () => {
  loading.value = true;
  let startDate: Date, endDate: Date;

  switch (currentView.value) {
    case 'monthly':
      startDate = new Date(Date.UTC(selectedDate.monthly.year, selectedDate.monthly.month - 1, 1));
      endDate = new Date(Date.UTC(selectedDate.monthly.year, selectedDate.monthly.month, 0));
      break;
    case 'yearly':
      startDate = new Date(Date.UTC(selectedDate.yearly.year, 0, 1));
      endDate = new Date(Date.UTC(selectedDate.yearly.year, 11, 31));
      break;
    case 'custom':
      if (!selectedDate.custom.start || !selectedDate.custom.end) {
        loading.value = false;
        transactions.value = [];
        return;
      }
      startDate = new Date(selectedDate.custom.start + 'T00:00:00Z');
      endDate = new Date(selectedDate.custom.end + 'T00:00:00Z');
      break;
  }

  const filters = {
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
  };

  await transactionsStore.fetchTransactions(filters, true);
  transactions.value = transactionsStore.transactions
    .filter(t => configStore.includeHiddenWalletsInCalculation ? true : !t.wallet?.hidden);

  loading.value = false;
};

const selectCustomView = () => {
  const today = new Date();
  const firstDay = configStore.firstDayOfMonth;

  let startDate = new Date(today.getFullYear(), today.getMonth(), firstDay);

  if (today.getDate() < firstDay) {
    startDate.setMonth(startDate.getMonth() - 1);
  }

  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);
  endDate.setDate(firstDay - 1);

  selectedDate.custom.start = format(startDate, 'yyyy-MM-dd');
  selectedDate.custom.end = format(endDate, 'yyyy-MM-dd');

  customAggregationLevel.value = 'daily';
  currentView.value = 'custom';
};

const navigatePeriod = (direction: 'previous' | 'next') => {
  if (!selectedDate.custom.start || !selectedDate.custom.end) return;

  const firstDay = configStore.firstDayOfMonth;
  const start = parseISO(selectedDate.custom.start);

  if (direction === 'previous') {
    // Move to previous month's configured date
    const newStart = new Date(start);
    newStart.setMonth(newStart.getMonth() - 1);
    newStart.setDate(firstDay);

    // Set end date to day before the configured date
    const newEnd = new Date(newStart);
    newEnd.setMonth(newEnd.getMonth() + 1);
    newEnd.setDate(firstDay - 1);

    selectedDate.custom.start = format(newStart, 'yyyy-MM-dd');
    selectedDate.custom.end = format(newEnd, 'yyyy-MM-dd');
  } else {
    // Move to next month's configured date
    const newStart = new Date(start);
    newStart.setMonth(newStart.getMonth() + 1);
    newStart.setDate(firstDay);

    // Set end date to day before the configured date
    const newEnd = new Date(newStart);
    newEnd.setMonth(newEnd.getMonth() + 1);
    newEnd.setDate(firstDay - 1);

    selectedDate.custom.start = format(newStart, 'yyyy-MM-dd');
    selectedDate.custom.end = format(newEnd, 'yyyy-MM-dd');
  }
}

const goToPreviousPeriod = () => navigatePeriod('previous');
const goToNextPeriod = () => navigatePeriod('next');

watch([currentView, selectedDate, customAggregationLevel], fetchReportData, { immediate: true, deep: true });

</script>

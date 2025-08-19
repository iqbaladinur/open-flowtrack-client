<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-neon">Reports</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Analyze your financial trends over time
        </p>
      </div>

      <!-- View Switcher -->
      <div class="card p-2">
        <div class="flex items-center justify-center sm:justify-start space-x-1 flex-wrap">
          <button @click="currentView = 'monthly'" :class="['btn', currentView === 'monthly' ? 'btn-primary' : 'btn-secondary']">
            <Calendar class="w-4 h-4 mr-2" /> Monthly
          </button>
          <button @click="currentView = 'yearly'" :class="['btn', currentView === 'yearly' ? 'btn-primary' : 'btn-secondary']">
            <CalendarClock class="w-4 h-4 mr-2" /> Yearly
          </button>
          <button @click="selectCustomView" :class="['btn', currentView === 'custom' ? 'btn-primary' : 'btn-secondary']">
            <SlidersHorizontal class="w-4 h-4 mr-2" /> Custom
          </button>
        </div>
      </div>

      <!-- Period Selector -->
      <div class="card p-4 space-y-4">
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
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="custom-start" class="label">Start Date</label>
              <input id="custom-start" v-model="selectedDate.custom.start" type="date" class="input" />
            </div>
            <div>
              <label for="custom-end" class="label">End Date</label>
              <input id="custom-end" v-model="selectedDate.custom.end" type="date" class="input" />
            </div>
          </div>
          <div>
            <label class="label">Group By</label>
            <div class="flex items-center space-x-1 flex-wrap">
              <button @click="customAggregationLevel = 'daily'" :class="['btn btn-sm', customAggregationLevel === 'daily' ? 'btn-primary' : 'btn-secondary']">Daily</button>
              <button @click="customAggregationLevel = 'weekly'" :class="['btn btn-sm', customAggregationLevel === 'weekly' ? 'btn-primary' : 'btn-secondary']">Weekly</button>
              <button @click="customAggregationLevel = 'monthly'" :class="['btn btn-sm', customAggregationLevel === 'monthly' ? 'btn-primary' : 'btn-secondary']">Monthly</button>
              <button @click="customAggregationLevel = 'yearly'" :class="['btn btn-sm', customAggregationLevel === 'yearly' ? 'btn-primary' : 'btn-secondary']">Yearly</button>
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
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="card p-6">
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Income</p>
            <p class="text-sm font-medium text-success-600 font-mono">{{ configStore.formatCurrency(summary.totalIncome) }}</p>
          </div>
          <div class="card p-6">
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Expense</p>
            <p class="text-sm font-medium text-error-600 font-mono">{{ configStore.formatCurrency(summary.totalExpense) }}</p>
          </div>
          <div class="card p-6">
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Net Income</p>
            <p class="text-sm font-medium font-mono" :class="summary.net >= 0 ? 'text-success-600' : 'text-error-600'">
              {{ configStore.formatCurrency(summary.net) }}
            </p>
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
          <div class="card p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Breakdown by Category</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">({{ configStore.currency }})</p>
              </div>
              <div class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button @click="categoryReportType = 'expense'" :class="['btn btn-sm', categoryReportType === 'expense' ? 'bg-white dark:bg-gray-600 shadow' : '']">Spending</button>
                <button @click="categoryReportType = 'income'" :class="['btn btn-sm', categoryReportType === 'income' ? 'bg-white dark:bg-gray-600 shadow' : '']">Income</button>
              </div>
            </div>
            <div v-if="categoryChartData.labels.length === 0" class="text-center py-8">
              <PieChart class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 dark:text-gray-400">No {{ categoryReportType }} data</p>
            </div>
            <div v-else class="h-80">
              <CategoryPieChart :chart-data="categoryChartData" />
            </div>
          </div>

          <!-- Wallet Report -->
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Flow by Wallet ({{ configStore.currency }})
            </h2>
            <div v-if="walletReportData.length === 0" class="text-center py-8">
              <Wallet class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 dark:text-gray-400 px-2">No wallet data available</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="item in walletReportData"
                :key="item.name"
                class="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</h3>
                  <span :class="item.net >= 0 ? 'text-success-600' : 'text-error-600'" class="flex items-center gap-2">
                    <component :is="(item.net >= 0) ? TrendingUp : TrendingDown" class="w-4 h-4" />
                    <span class="font-medium text-sm font-mono">
                      {{ configStore.formatCurrency(item.net) }}
                    </span>
                  </span>
                </div>
                <div class="flex justify-between text-xs font-mono">
                  <span class="text-success-500">+{{ configStore.formatCurrency(item.income) }}</span>
                  <span class="text-error-500">-{{ configStore.formatCurrency(item.expense) }}</span>
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
import { Calendar, CalendarClock, BarChart3, SlidersHorizontal, PieChart, Wallet, TrendingUp, TrendingDown } from 'lucide-vue-next';
import type { Transaction } from '@/types/transaction';
import { format } from 'date-fns';

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
    else acc.totalExpense += t.amount;
    acc.net = acc.totalIncome - acc.totalExpense;
    return acc;
  }, { totalIncome: 0, totalExpense: 0, net: 0 });
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
      return `${c.name} (${percentage}%)`;
    }),
    datasets: [{
      data: sortedCategories.map(c => c.total),
      backgroundColor: sortedCategories.map(c => `${c.color}CC`), // Append alpha value
    }],
  };
});

const walletReportData = computed(() => {
  const walletTotals = new Map<string, { name: string, income: number, expense: number }>();

  transactions.value.forEach(t => {
    if (t.wallet) {
      const current = walletTotals.get(t.wallet.id) || { name: t.wallet.name, income: 0, expense: 0 };
      if (t.type === 'income') current.income += t.amount;
      else current.expense += t.amount;
      walletTotals.set(t.wallet.id, current);
    }
  });

  return Array.from(walletTotals.values()).map(w => ({
    ...w,
    net: w.income - w.expense,
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
  transactions.value = transactionsStore.transactions;

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
  endDate.setDate(startDate.getDate() + 30);

  selectedDate.custom.start = format(startDate, 'yyyy-MM-dd');
  selectedDate.custom.end = format(endDate, 'yyyy-MM-dd');
  
  customAggregationLevel.value = 'daily';
  currentView.value = 'custom';
};

watch([currentView, selectedDate, customAggregationLevel], fetchReportData, { immediate: true, deep: true });

</script>


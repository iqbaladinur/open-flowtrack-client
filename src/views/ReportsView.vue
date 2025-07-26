<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Analyze your financial data and trends
        </p>
      </div>

      <!-- Filters -->
      <div class="card p-4 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label class="label">Start Date</label>
            <input v-model="dateRange.start" type="date" class="input" />
          </div>
          <div>
            <label class="label">End Date</label>
            <input v-model="dateRange.end" type="date" class="input" />
          </div>
          <div>
            <button @click="fetchReports" class="btn-primary w-full" :disabled="loading">
              <BarChart3 class="w-4 h-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
        <div v-if="availableCurrencies.length > 1" class="pt-2">
           <label class="label mb-2">Currency</label>
          <div class="flex items-center space-x-2">
            <button
              v-for="currency in availableCurrencies"
              :key="currency"
              @click="selectedCurrency = currency"
              :class="['btn', selectedCurrency === currency ? 'btn-primary' : 'btn-secondary']"
            >
              {{ currency }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <LoadingSpinner />
      </div>

      <div v-else-if="!currentSummary" class="text-center py-12 card">
        <BarChart3 class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500 dark:text-gray-400">No data available for the selected period or currency.</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Income</p>
                <p class="text-2xl font-bold text-success-600">
                  {{ formatCurrency(currentSummary.totalIncome, currentSummary.currency) }}
                </p>
              </div>
              <div class="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                <TrendingUp class="w-6 h-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Expenses</p>
                <p class="text-2xl font-bold text-error-600">
                  {{ formatCurrency(currentSummary.totalExpense, currentSummary.currency) }}
                </p>
              </div>
              <div class="w-12 h-12 bg-error-100 dark:bg-error-900 rounded-lg flex items-center justify-center">
                <TrendingDown class="w-6 h-6 text-error-600 dark:text-error-400" />
              </div>
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Income</p>
                <p 
                  class="text-2xl font-bold"
                  :class="currentSummary.net >= 0 ? 'text-success-600' : 'text-error-600'"
                >
                  {{ currentSummary.net >= 0 ? '+' : '' }}{{ formatCurrency(currentSummary.net, currentSummary.currency) }}
                </p>
              </div>
              <div 
                class="w-12 h-12 rounded-lg flex items-center justify-center"
                :class="currentSummary.net >= 0 
                  ? 'bg-success-100 dark:bg-success-900' 
                  : 'bg-error-100 dark:bg-error-900'"
              >
                <BarChart3 
                  class="w-6 h-6"
                  :class="currentSummary.net >= 0 
                    ? 'text-success-600 dark:text-success-400' 
                    : 'text-error-600 dark:text-error-400'"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Reports Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start">
          <!-- Category Report -->
          <div class="card p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ selectedReportType === 'expense' ? 'Spending' : 'Income' }} by Category
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">({{ selectedCurrency }})</p>
              </div>
              <div class="flex items-center space-x-2">
                <button @click="selectedReportType = 'expense'" :class="['btn btn-sm', selectedReportType === 'expense' ? 'btn-primary' : 'btn-secondary']">Spending</button>
                <button @click="selectedReportType = 'income'" :class="['btn btn-sm', selectedReportType === 'income' ? 'btn-primary' : 'btn-secondary']">Income</button>
              </div>
            </div>
            <div v-if="currentCategoryReport.length === 0" class="text-center py-8">
              <PieChart class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 dark:text-gray-400">No {{ selectedReportType }} data available</p>
            </div>
            <div v-else class="relative h-80">
              <CategoryChart :report-data="currentCategoryReport" :currency="selectedCurrency" />
            </div>
          </div>

          <!-- Wallet Report -->
          <div class="card p-6 overflow-hidden">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Balance by Wallet ({{ selectedCurrency }})
            </h2>
            <div v-if="currentWalletReport.length === 0" class="text-center py-8">
              <Wallet class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 dark:text-gray-400">No wallet data available</p>
            </div>
            <div v-else class="flex space-x-4 -mb-4 pb-4 overflow-x-auto lg:flex-col lg:space-x-0 lg:space-y-4 lg:mb-0 lg:pb-0 lg:overflow-visible">
              <div
                v-for="item in currentWalletReport"
                :key="item.name"
                class="p-4 rounded-lg border border-gray-200 dark:border-gray-600 w-full flex-shrink-0"
              >
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-medium text-gray-900 dark:text-white truncate">
                    {{ item.name }}
                  </h3>
                  <span class="font-bold text-gray-800 dark:text-gray-200 ml-2">
                    {{ formatCurrency(item.finalBalance, item.currency) }}
                  </span>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center text-gray-500 dark:text-gray-400">
                      <TrendingUp class="w-4 h-4 mr-1 lg:hidden text-success-500" />
                      <span class="hidden lg:inline">Income:</span>
                    </div>
                    <span class="text-success-600 dark:text-success-400 font-medium">
                      +{{ formatCurrency(item.totalIncome, item.currency) }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                     <div class="flex items-center text-gray-500 dark:text-gray-400">
                      <TrendingDown class="w-4 h-4 mr-1 lg:hidden text-error-500" />
                      <span class="hidden lg:inline">Expenses:</span>
                    </div>
                    <span class="text-error-600 dark:text-error-400 font-medium">
                      -{{ formatCurrency(item.totalExpense, item.currency) }}
                    </span>
                  </div>
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useApi } from '@/composables/useApi';
import AppLayout from '@/components/layouts/AppLayout.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import CategoryChart from '@/components/CategoryChart.vue';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Wallet,
} from 'lucide-vue-next';

// --- Data Structures ---
interface SummaryData {
  currency: string;
  totalIncome: number;
  totalExpense: number;
  net: number;
}

interface CategoryReportItem {
  name: string;
  color: string;
  icon: string;
  total: number;
}

interface CurrencyReport {
  [currency: string]: CategoryReportItem[];
}

interface CategoryReportResponse {
  income?: CurrencyReport;
  expense?: CurrencyReport;
}

interface WalletReportItem {
  name: string;
  currency: string;
  initialBalance: number;
  totalIncome: number;
  totalExpense: number;
  finalBalance: number;
}

const api = useApi();

// --- State ---
const loading = ref(false);
const summary = ref<SummaryData[]>([]);
const categoryReport = ref<CategoryReportResponse | null>(null);
const walletReport = ref<Record<string, WalletReportItem[]>>({});
const selectedCurrency = ref('');
const selectedReportType = ref<'income' | 'expense'>('expense');

const dateRange = reactive({
  start: '',
  end: '',
});

// --- Computed Properties ---
const availableCurrencies = computed(() => summary.value.map(s => s.currency));

const currentSummary = computed(() => {
  return summary.value.find(s => s.currency === selectedCurrency.value) || null;
});

const currentCategoryReport = computed(() => {
  if (!categoryReport.value || !selectedCurrency.value) return [];
  const reportForType = categoryReport.value[selectedReportType.value];
  if (!reportForType) return [];
  return reportForType[selectedCurrency.value] || [];
});

const currentWalletReport = computed(() => {
  return walletReport.value[selectedCurrency.value] || [];
});

// --- Methods ---
const formatCurrency = (amount: number, currency: string) => {
  const options = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'IDR' ? 0 : 2,
    maximumFractionDigits: currency === 'IDR' ? 0 : 2,
  };
  const locale = currency === 'IDR' ? 'id-ID' : 'en-US';
  return new Intl.NumberFormat(locale, options).format(Math.abs(amount));
};

const fetchReports = async () => {
  loading.value = true;
  summary.value = [];
  categoryReport.value = {};
  walletReport.value = {};
  
  const params = {
    ...(dateRange.start && { startDate: dateRange.start }),
    ...(dateRange.end && { endDate: dateRange.end }),
  };

  try {
    const [summaryRes, categoryRes, walletRes] = await Promise.all([
      api.get<SummaryData[]>('/reports/summary', { params }),
      api.get<CategoryReportResponse>('/reports/by-category', { params }),
      api.get<Record<string, WalletReportItem[]>>('/reports/by-wallet', { params }),
    ]);

    if (summaryRes.data) {
      summary.value = summaryRes.data;
      if (summary.value.length > 0 && !availableCurrencies.value.includes(selectedCurrency.value)) {
        selectedCurrency.value = summary.value[0].currency;
      }
    }
    if (categoryRes.data) categoryReport.value = categoryRes.data;
    if (walletRes.data) walletReport.value = walletRes.data;

  } catch (error) {
    console.error("Failed to fetch reports:", error);
  } finally {
    loading.value = false;
  }
};

// --- Lifecycle ---
onMounted(async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  dateRange.start = startOfMonth.toISOString().split('T')[0];
  dateRange.end = endOfMonth.toISOString().split('T')[0];

  await fetchReports();
});
</script>

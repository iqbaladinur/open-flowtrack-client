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

      <!-- Date Range Filter -->
      <div class="card p-4">
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
      </div>

      <!-- Summary Cards -->
      <div v-if="summary" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Income</p>
              <p class="text-2xl font-bold text-success-600">
                ${{ formatCurrency(summary.total_income) }}
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
                ${{ formatCurrency(summary.total_expense) }}
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
                :class="summary.net_income >= 0 ? 'text-success-600' : 'text-error-600'"
              >
                {{ summary.net_income >= 0 ? '+' : '' }}${{ formatCurrency(Math.abs(summary.net_income)) }}
              </p>
            </div>
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :class="summary.net_income >= 0 
                ? 'bg-success-100 dark:bg-success-900' 
                : 'bg-error-100 dark:bg-error-900'"
            >
              <BarChart3 
                class="w-6 h-6"
                :class="summary.net_income >= 0 
                  ? 'text-success-600 dark:text-success-400' 
                  : 'text-error-600 dark:text-error-400'"
              />
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Transactions</p>
              <p class="text-2xl font-bold text-primary-600">
                {{ summary.transaction_count }}
              </p>
            </div>
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <ArrowUpDown class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Reports Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Category Report -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h2>
          
          <div v-if="loading" class="py-8">
            <LoadingSpinner />
          </div>
          
          <div v-else-if="categoryReport.length === 0" class="text-center py-8">
            <PieChart class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="item in categoryReport"
              :key="item.category_id"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: getCategoryColor(item.category_id) }"
                ></div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ item.category_name }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ item.transaction_count }} transactions
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900 dark:text-white">
                  ${{ formatCurrency(item.total_amount) }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ item.percentage.toFixed(1) }}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Wallet Report -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Balance by Wallet
          </h2>
          
          <div v-if="loading" class="py-8">
            <LoadingSpinner />
          </div>
          
          <div v-else-if="walletReport.length === 0" class="text-center py-8">
            <Wallet class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
          
          <div v-else class="space-y-4">
            <div
              v-for="item in walletReport"
              :key="item.wallet_id"
              class="p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-medium text-gray-900 dark:text-white">
                  {{ item.wallet_name }}
                </h3>
                <span 
                  class="font-bold"
                  :class="item.current_balance >= 0 ? 'text-success-600' : 'text-error-600'"
                >
                  ${{ formatCurrency(item.current_balance) }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Income:</span>
                  <span class="text-success-600 dark:text-success-400 font-medium">
                    +${{ formatCurrency(item.total_income) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Expenses:</span>
                  <span class="text-error-600 dark:text-error-400 font-medium">
                    -${{ formatCurrency(item.total_expense) }}
                  </span>
                </div>
              </div>
              
              <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Net Flow:</span>
                  <span 
                    class="font-medium"
                    :class="item.net_flow >= 0 ? 'text-success-600' : 'text-error-600'"
                  >
                    {{ item.net_flow >= 0 ? '+' : '' }}${{ formatCurrency(Math.abs(item.net_flow)) }}
                  </span>
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
import { ref, reactive, onMounted } from 'vue';
import { useApi } from '@/composables/useApi';
import { useCategoriesStore } from '@/stores/categories';
import AppLayout from '@/components/layouts/AppLayout.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import type { SummaryReport, CategoryReport, WalletReport } from '@/types';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  PieChart,
  Wallet,
} from 'lucide-vue-next';

const api = useApi();
const categoriesStore = useCategoriesStore();

const loading = ref(false);
const summary = ref<SummaryReport | null>(null);
const categoryReport = ref<CategoryReport[]>([]);
const walletReport = ref<WalletReport[]>([]);

const dateRange = reactive({
  start: '',
  end: '',
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getCategoryColor = (categoryId: string) => {
  const category = categoriesStore.categories.find(c => c.id === categoryId);
  return category?.color || '#6B7280';
};

const fetchReports = async () => {
  loading.value = true;
  
  const params = {
    ...(dateRange.start && { startDate: dateRange.start }),
    ...(dateRange.end && { endDate: dateRange.end }),
  };

  try {
    const [summaryRes, categoryRes, walletRes] = await Promise.all([
      api.get<SummaryReport>('/reports/summary', { params }),
      api.get<CategoryReport[]>('/reports/by-category', { params }),
      api.get<WalletReport[]>('/reports/by-wallet', { params }),
    ]);

    if (summaryRes.data) summary.value = summaryRes.data;
    if (categoryRes.data) categoryReport.value = categoryRes.data;
    if (walletRes.data) walletReport.value = walletRes.data;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // Set default date range to current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  dateRange.start = startOfMonth.toISOString().split('T')[0];
  dateRange.end = endOfMonth.toISOString().split('T')[0];

  await categoriesStore.fetchCategories();
  await fetchReports();
});
</script>
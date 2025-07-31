<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-neon mb-2">
          Welcome back, {{ authStore.user?.full_name || 'User' }}!
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Here's your financial overview for today
        </p>
      </div>

      <!-- Summary Cards -->
      <div class="flex sm:grid sm:grid-cols-4 sm:gap-4 overflow-x-auto space-x-3 sm:space-x-0 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <!-- Total Balance -->
        <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 shadow-lg">
          <div class="flex flex-col h-full">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 mb-3">
              <Wallet class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div class="mt-auto">
              <p class="text-xs text-gray-500 dark:text-gray-400">Total Balance</p>
              <p class="text-xs font-medium text-gray-900 dark:text-white font-mono">
                {{ configStore.formatCurrency(totalBalance) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Monthly Income -->
        <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 shadow-lg -ml-4 sm:ml-0">
          <div class="flex flex-col h-full">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-success-100 dark:bg-success-900/50 mb-3">
              <TrendingUp class="w-4 h-4 text-success-600 dark:text-success-400" />
            </div>
            <div class="mt-auto">
              <p class="text-xs text-gray-500 dark:text-gray-400">Income</p>
              <p class="text-xs font-medium text-success-600 dark:text-success-400 font-mono">
                +{{ configStore.formatCurrency(monthlyIncome) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Monthly Expenses -->
        <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 shadow-lg -ml-4 sm:ml-0">
          <div class="flex flex-col h-full">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-error-100 dark:bg-error-900/50 mb-3">
              <TrendingDown class="w-4 h-4 text-error-600 dark:text-error-400" />
            </div>
            <div class="mt-auto">
              <p class="text-xs text-gray-500 dark:text-gray-400">Expenses</p>
              <p class="text-xs font-medium text-error-600 dark:text-error-400 font-mono">
                -{{ configStore.formatCurrency(monthlyExpenses) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Net Income -->
        <div class="card p-3 w-56 sm:w-auto flex-shrink-0 sm:flex-shrink-1 shadow-lg -ml-4 sm:ml-0">
          <div class="flex flex-col h-full">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-warning-100 dark:bg-warning-900/50 mb-3">
              <BarChart3 class="w-4 h-4 text-warning-600 dark:text-warning-400" />
            </div>
            <div class="mt-auto">
              <p class="text-xs text-gray-500 dark:text-gray-400">Net Income</p>
              <p 
                class="text-xs font-medium font-mono"
                :class="netIncome >= 0 ? 'text-gray-800 dark:text-gray-200' : 'text-error-600 dark:text-error-400'"
              >
                {{ netIncome >= 0 ? '+' : '' }}{{ configStore.formatCurrency(netIncome) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-6">
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
              <Wallet class="w-5 h-5 text-primary-600 dark:text-primary-400" />
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

      <!-- Recent Transactions -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-neon">Recent Transactions</h2>
          <router-link
            to="/transactions"
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            View all
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
            class="rounded-xl"
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
import { useAuthStore } from '@/stores/auth';
import { useWalletsStore } from '@/stores/wallets';
import { useTransactionsStore } from '@/stores/transactions';
import { useConfigStore } from '@/stores/config';
import AppLayout from '@/components/layouts/AppLayout.vue';
import TransactionModal from '@/components/TransactionModal.vue';
import QuickActionButton from '@/components/QuickActionButton.vue';
import TransactionItem from '@/components/TransactionItem.vue';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Plus,
  Minus,
  Target,
  ArrowUpDown,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const walletsStore = useWalletsStore();
const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();

const showAddTransactionModal = ref(false);
const transactionType = ref<'income' | 'expense'>('income');

const totalBalance = computed(() => {
  return walletsStore.wallets.reduce((sum, wallet) => sum + (wallet.current_balance || 0), 0);
});

const monthlyIncome = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const currentMonth = `${year}-${month}`;
  return transactionsStore.transactions
    .filter(t => t.type === 'income' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + Number(t.amount) || 0, 0);
});

const monthlyExpenses = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const currentMonth = `${year}-${month}`;
  return transactionsStore.transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + Number(t.amount) || 0, 0);
});

const netIncome = computed(() => monthlyIncome.value - monthlyExpenses.value);

const recentTransactions = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const currentMonth = `${year}-${month}`;
  return transactionsStore.transactions
    .filter(t => t.date.startsWith(currentMonth))
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
});

const handleTransactionAdded = () => {
  showAddTransactionModal.value = false;
  // Force refresh data
  const today = new Date().toISOString().split('T')[0];
  transactionsStore.fetchTransactions({
    end_date: today
  }, true);
  walletsStore.fetchWallets(true, undefined, today);
};

const toggleAddTransaction = (type: 'income' | 'expense') => {
  showAddTransactionModal.value = true;
  transactionType.value = type;
}

onMounted(async () => {
  const today = new Date().toISOString().split('T')[0];
  walletsStore.fetchWallets(true, undefined, today);
  transactionsStore.fetchTransactions({ end_date: today });
});
</script>

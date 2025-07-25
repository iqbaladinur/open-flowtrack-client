<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {{ authStore.user?.full_name || 'User' }}!
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Here's your financial overview for today
        </p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Balance"
          :amount="totalBalance"
          icon-bg-class="bg-primary-100 dark:bg-primary-900"
        >
          <template #icon>
            <Wallet class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </template>
        </SummaryCard>

        <SummaryCard
          title="This Month Income"
          :amount="monthlyIncome"
          amount-class="text-success-600"
          icon-bg-class="bg-success-100 dark:bg-success-900"
        >
          <template #amount>+{{ formatCurrency(monthlyIncome) }}</template>
          <template #icon>
            <TrendingUp class="w-6 h-6 text-success-600 dark:text-success-400" />
          </template>
        </SummaryCard>

        <SummaryCard
          title="This Month Expenses"
          :amount="monthlyExpenses"
          amount-class="text-error-600"
          icon-bg-class="bg-error-100 dark:bg-error-900"
        >
          <template #amount>-{{ formatCurrency(monthlyExpenses) }}</template>
          <template #icon>
            <TrendingDown class="w-6 h-6 text-error-600 dark:text-error-400" />
          </template>
        </SummaryCard>

        <SummaryCard
          title="Net Income"
          :amount="netIncome"
          :amount-class="netIncome >= 0 ? 'text-success-600' : 'text-error-600'"
          icon-bg-class="bg-warning-100 dark:bg-warning-900"
        >
          <template #amount>
            {{ netIncome >= 0 ? '+' : '' }}{{ formatCurrency(Math.abs(netIncome)) }}
          </template>
          <template #icon>
            <BarChart3 class="w-6 h-6 text-warning-600 dark:text-warning-400" />
          </template>
        </SummaryCard>
      </div>

      <!-- Quick Actions -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            @click="showAddTransactionModal = true"
            icon-bg-class="bg-success-100 dark:bg-success-900"
          >
            <template #icon>
              <Plus class="w-5 h-5 text-success-600 dark:text-success-400" />
            </template>
            Add Income
          </QuickActionButton>

          <QuickActionButton
            @click="showAddExpenseModal = true"
            icon-bg-class="bg-error-100 dark:bg-error-900"
          >
            <template #icon>
              <Minus class="w-5 h-5 text-error-600 dark:text-error-400" />
            </template>
            Add Expense
          </QuickActionButton>

          <QuickActionButton
            to="/wallets"
            icon-bg-class="bg-primary-100 dark:bg-primary-900"
          >
            <template #icon>
              <Wallet class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </template>
            Manage Wallets
          </QuickActionButton>

          <QuickActionButton
            to="/budgets"
            icon-bg-class="bg-warning-100 dark:bg-warning-900"
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
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
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
    <TransactionModal
      v-model="showAddExpenseModal"
      type="expense"
      @success="handleTransactionAdded"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useWalletsStore } from '@/stores/wallets';
import { useTransactionsStore } from '@/stores/transactions';
import AppLayout from '@/components/layouts/AppLayout.vue';
import TransactionModal from '@/components/TransactionModal.vue';
import SummaryCard from '@/components/SummaryCard.vue';
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

const showAddTransactionModal = ref(false);
const showAddExpenseModal = ref(false);
const transactionType = ref<'income' | 'expense'>('income');

const totalBalance = computed(() => {
  return walletsStore.wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
});

const monthlyIncome = computed(() => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  return transactionsStore.transactions
    .filter(t => t.type === 'income' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);
});

const monthlyExpenses = computed(() => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  return transactionsStore.transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);
});

const netIncome = computed(() => monthlyIncome.value - monthlyExpenses.value);

const recentTransactions = computed(() => {
  return transactionsStore.transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const handleTransactionAdded = () => {
  showAddTransactionModal.value = false;
  showAddExpenseModal.value = false;
  // Refresh data
  transactionsStore.fetchTransactions();
  walletsStore.fetchWallets();
};

onMounted(async () => {
  await walletsStore.fetchWallets();
});
</script>
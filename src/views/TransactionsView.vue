<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Track all your income and expenses
          </p>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          Add Transaction
        </button>
      </div>

      <!-- Filters -->
      <div class="card p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="label">Type</label>
            <select v-model="filters.type" class="input">
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label class="label">Wallet</label>
            <select v-model="filters.wallet_id" class="input">
              <option value="">All Wallets</option>
              <option v-for="wallet in walletsStore.wallets" :key="wallet.id" :value="wallet.id">
                {{ wallet.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="label">Start Date</label>
            <input v-model="filters.start_date" type="date" class="input" />
          </div>
          <div>
            <label class="label">End Date</label>
            <input v-model="filters.end_date" type="date" class="input" />
          </div>
        </div>
      </div>

      <!-- Transactions List -->
      <div class="card">
        <div v-if="transactionsStore.loading" class="p-8">
          <LoadingSpinner fullHeight />
        </div>

        <div v-else-if="transactions.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowUpDown class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions found</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            Get started by adding your first transaction
          </p>
          <button @click="showAddModal = true" class="btn-primary">
            <Plus class="w-4 h-4 mr-2" />
            Add Transaction
          </button>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <TransactionItem
            v-for="transaction in transactions"
            :key="transaction.id"
            :transaction="transaction"
            show-type
            show-actions
            @edit="editTransaction"
            @delete="deleteTransaction"
          />
        </div>
      </div>
    </div>

    <!-- Add/Edit Transaction Modal -->
    <TransactionModal
      v-model="showAddModal"
      :transaction="selectedTransaction"
      @success="handleTransactionSaved"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useWalletsStore } from '@/stores/wallets';
import { useTransactionsStore } from '@/stores/transactions';
import AppLayout from '@/components/layouts/AppLayout.vue';
import TransactionModal from '@/components/TransactionModal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import TransactionItem from '@/components/TransactionItem.vue';
import type { Transaction } from '@/types';
import {
  Plus,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
} from 'lucide-vue-next';

const walletsStore = useWalletsStore();
const transactionsStore = useTransactionsStore();

const showAddModal = ref(false);
const selectedTransaction = ref<Transaction | null>(null);

const filters = reactive({
  type: '',
  wallet_id: '',
  start_date: '',
  end_date: '',
});

const transactions = computed(() => {
  return transactionsStore.transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const editTransaction = (transaction: Transaction) => {
  selectedTransaction.value = transaction;
  showAddModal.value = true;
};

const handleTransactionSaved = () => {
  showAddModal.value = false;
  selectedTransaction.value = null;
  // Refresh transactions and wallet balances
  transactionsStore.fetchTransactions(filters, true);
  walletsStore.fetchWallets(true);
};

const deleteTransaction = async (id: string) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    const result = await transactionsStore.deleteTransaction(id);
    if (result.success) {
      walletsStore.fetchWallets(true);
    }
  }
};

// Watch filters and fetch transactions when they change
watch(
  filters,
  (newFilters) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([, value]) => value !== '')
    );
    transactionsStore.fetchTransactions(cleanedFilters);
  },
  { deep: true }
);

onMounted(async () => {
  await Promise.all([
    walletsStore.fetchWallets(),
    transactionsStore.fetchTransactions(),
  ]);
});
</script>
<template>
  <Modal v-model="isModalOpen" :title="transaction ? 'Edit Transaction' : 'Add Transaction'">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Transaction Type -->
      <div v-if="!type">
        <label class="label">Type</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="form.type = 'income'"
            class="p-3 rounded-lg border-2 transition-all"
            :class="form.type === 'income' 
              ? 'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
          >
            <TrendingUp class="w-5 h-5 mx-auto mb-1" />
            <span class="text-sm font-medium">Income</span>
          </button>
          <button
            type="button"
            @click="form.type = 'expense'"
            class="p-3 rounded-lg border-2 transition-all"
            :class="form.type === 'expense' 
              ? 'border-error-500 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
          >
            <TrendingDown class="w-5 h-5 mx-auto mb-1" />
            <span class="text-sm font-medium">Expense</span>
          </button>
        </div>
      </div>

      <!-- Amount -->
      <div>
        <label for="amount" class="label">Amount</label>
        <input
          id="amount"
          v-model.number="form.amount"
          type="number"
          step="0.01"
          min="0"
          required
          class="input"
          placeholder="0.00"
          :disabled="loading"
        />
      </div>

      <!-- Wallet -->
      <div>
        <label for="wallet" class="label">Wallet</label>
        <select
          id="wallet"
          v-model="form.wallet_id"
          required
          class="input"
          :disabled="loading || walletsStore.loading"
        >
          <option value="">Select a wallet</option>
          <option
            v-for="wallet in walletsStore.wallets"
            :key="wallet.id"
            :value="wallet.id"
          >
            {{ wallet.name }} ({{ wallet.currency === 'USD' ? '$' : 'Rp' }}{{ formatCurrency(wallet.balance) }})
          </option>
        </select>
      </div>

      <!-- Category -->
      <div>
        <label for="category" class="label">Category</label>
        <select
          id="category"
          v-model="form.category_id"
          required
          class="input"
          :disabled="loading || categoriesStore.loading"
        >
          <option value="">Select a category</option>
          <option
            v-for="category in availableCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Date -->
      <div>
        <label for="date" class="label">Date</label>
        <input
          id="date"
          v-model="form.date"
          type="date"
          required
          class="input"
          :disabled="loading"
        />
      </div>

      <!-- Note -->
      <div>
        <label for="note" class="label">Note (Optional)</label>
        <textarea
          id="note"
          v-model="form.note"
          class="input"
          rows="3"
          placeholder="Add a note for this transaction..."
          :disabled="loading"
        ></textarea>
      </div>

      <!-- Recurring Options -->
      <div class="space-y-3">
        <div class="flex items-center">
          <input
            id="recurring"
            v-model="form.is_recurring"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            :disabled="loading"
          />
          <label for="recurring" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Make this a recurring transaction
          </label>
        </div>

        <div v-if="form.is_recurring">
          <label for="pattern" class="label">Recurring Pattern</label>
          <select
            id="pattern"
            v-model="form.recurring_pattern"
            class="input"
            :disabled="loading"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
        <p class="text-sm text-error-700 dark:text-error-300">{{ error }}</p>
      </div>

      <!-- Form Actions -->
      <div class="flex space-x-3 pt-4">
        <button
          type="button"
          @click="isModalOpen = false"
          class="flex-1 btn-secondary"
          :disabled="loading"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="flex-1 btn-primary"
          :disabled="loading || !isFormValid"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>{{ transaction ? 'Update' : 'Add' }} Transaction</span>
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useWalletsStore } from '@/stores/wallets';
import { useCategoriesStore } from '@/stores/categories';
import { useTransactionsStore } from '@/stores/transactions';
import Modal from '@/components/ui/Modal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import type { Transaction } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-vue-next';

interface Props {
  modelValue: boolean;
  transaction?: Transaction | null;
  type?: 'income' | 'expense';
}

const props = withDefaults(defineProps<Props>(), {
  transaction: null,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'success': [];
}>();

const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const walletsStore = useWalletsStore();
const categoriesStore = useCategoriesStore();
const transactionsStore = useTransactionsStore();

const loading = ref(false);
const error = ref('');

const form = reactive({
  type: props.type || 'expense' as 'income' | 'expense',
  amount: 0,
  wallet_id: '',
  category_id: '',
  date: new Date().toISOString().split('T')[0],
  note: '',
  is_recurring: false,
  recurring_pattern: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
});

const availableCategories = computed(() => {
  return categoriesStore.getCategoriesByType(form.type);
});

const isFormValid = computed(() => {
  return form.amount > 0 && 
         form.wallet_id && 
         form.category_id && 
         form.date;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const handleSubmit = async () => {
  if (!isFormValid.value || loading.value) return;

  loading.value = true;
  error.value = '';

  try {
    const transactionData = {
      type: form.type,
      amount: form.amount,
      wallet_id: form.wallet_id,
      category_id: form.category_id,
      date: form.date,
      note: form.note || undefined,
      is_recurring: form.is_recurring,
      recurring_pattern: form.is_recurring ? form.recurring_pattern : undefined,
    };

    let result;
    if (props.transaction) {
      result = await transactionsStore.updateTransaction(props.transaction.id, transactionData);
    } else {
      result = await transactionsStore.createTransaction(transactionData);
    }

    if (result.success) {
      emit('success');
      resetForm();
    } else {
      error.value = result.error || 'Failed to save transaction. Please try again.';
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, {
    type: props.type || 'expense',
    amount: 0,
    wallet_id: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    is_recurring: false,
    recurring_pattern: 'monthly',
  });
};

// Watch for transaction changes to populate form
watch(() => props.transaction, (newTransaction) => {
  if (newTransaction) {
    Object.assign(form, {
      type: newTransaction.type,
      amount: newTransaction.amount,
      wallet_id: newTransaction.wallet_id,
      category_id: newTransaction.category_id,
      date: newTransaction.date.split('T')[0],
      note: newTransaction.note || '',
      is_recurring: newTransaction.is_recurring,
      recurring_pattern: newTransaction.recurring_pattern || 'monthly',
    });
  } else {
    resetForm();
  }
}, { immediate: true });

// Watch form type changes to reset category
watch(() => form.type, () => {
  form.category_id = '';
});

onMounted(async () => {
  await Promise.all([
    walletsStore.fetchWallets(),
    categoriesStore.fetchCategories(),
  ]);
});
</script>

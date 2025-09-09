<template>
  <Modal v-model="isModalOpen" :title="modalTitle">
    <form @submit.prevent="handleSubmit" id="transaction-form" class="space-y-6 pt-4">
      <!-- Amount -->
      <div class="text-center">
        <label for="amount" class="label sr-only">Amount</label>
        <div class="relative inline-block">
          <span
            class="absolute left-0 top-1/2 transform -translate-y-1/2 text-xl text-gray-400 dark:text-gray-500 px-1 rounded-md dark:bg-gray-700/90 bg-gray-200/90"
          >
            {{ configStore.currency }}
          </span>
          <input
            id="amount"
            v-model.number="form.amount"
            type="number"
            step="0.01"
            min="0"
            required
            class="w-full bg-transparent text-right text-4xl font-bold pl-14 pr-4 py-4 focus:ring-0 border-none outline-none"
            placeholder="0.00"
            :disabled="loading"
            autofocus
            autocomplete="off"
          />
        </div>
      </div>

      <!-- Transaction Type -->
      <div v-if="!type">
        <label class="label text-center">Transaction Type</label>
        <div class="grid grid-cols-3 gap-2 max-w-sm mx-auto">
          <button
            type="button"
            @click="toggleFormType('income')"
            class="p-2 rounded-lg border-2 transition-all"
            :class="form.type === 'income' ? 'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
          >
            <TrendingUp class="w-5 h-5 mx-auto" />
            <span class="text-xs font-medium">Income</span>
          </button>
          <button
            type="button"
            @click="toggleFormType('expense')"
            class="p-2 rounded-lg border-2 transition-all"
            :class="form.type === 'expense' ? 'border-error-500 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
          >
            <TrendingDown class="w-5 h-5 mx-auto" />
            <span class="text-xs font-medium">Expense</span>
          </button>
          <button
            type="button"
            @click="toggleFormType('transfer')"
            class="p-2 rounded-lg border-2 transition-all"
            :class="form.type === 'transfer' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
          >
            <ArrowRightLeft class="w-5 h-5 mx-auto" />
            <span class="text-xs font-medium">Transfer</span>
          </button>
        </div>
      </div>

      <div class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
        <!-- Wallet -->
        <div>
          <label for="wallet" class="label">{{ form.type === 'transfer' ? 'Source Wallet' : 'Wallet' }}</label>
          <select id="wallet" v-model="form.wallet_id" required class="input" :disabled="loading || walletsStore.loading" autocomplete="off">
            <option value="">Select a wallet</option>
            <option v-for="wallet in walletsStore.wallets" :key="wallet.id" :value="wallet.id" class="font-mono">
              {{ wallet.name }} {{ wallet.is_main_wallet ? '(Main)' : '' }} ({{ configStore.formatCurrency(wallet.current_balance || 0) }})
            </option>
          </select>
        </div>

        <!-- Destination Wallet (for transfers) -->
        <div v-if="form.type === 'transfer'">
          <label for="destination_wallet" class="label">Destination Wallet</label>
          <select id="destination_wallet" v-model="form.destination_wallet_id" required class="input" :disabled="loading || walletsStore.loading" autocomplete="off">
            <option value="">Select destination wallet</option>
            <option v-for="wallet in availableDestinationWallets" :key="wallet.id" :value="wallet.id" class="font-mono">
              {{ wallet.name }} {{ wallet.is_main_wallet ? '(Main)' : '' }} ({{ configStore.formatCurrency(wallet.current_balance || 0) }})
            </option>
          </select>
        </div>

        <!-- Category -->
        <div v-if="form.type !== 'transfer'">
          <label for="category" class="label">Category</label>
          <div class="flex items-center gap-1">
            <div class="flex-1 relative">
              <div v-if="selectedCategorie" class="absolute h-full w-10 flex items-center justify-center">
                <div class="w-8 h-8 rounded-md flex items-center justify-center" :style="{ backgroundColor: selectedCategorie.color + '20' }">
                  <component :is="getIcon(selectedCategorie.icon)" class="w-5 h-5" :style="{ color: selectedCategorie.color }" ></component>
                </div>
              </div>
              <select
                id="category"
                v-model="form.category_id"
                required
                class="input"
                :class="{ 'pl-10': !!form.category_id }"
                :disabled="loading || categoriesStore.loading"
                autocomplete="off"
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
            <button class="btn btn-primary" type="button" @click="showCatgeoryModal = true">
              <Plus class="w-5 h-5" />
            </button>
          </div>
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
            autocomplete="off"
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
            autocomplete="off"
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
              autocomplete="off"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div
        v-if="error"
        class="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800"
      >
        <p class="text-sm text-error-700 dark:text-error-300">{{ error }}</p>
      </div>
    </form>
    <template #footer>
      <div class="flex space-x-3">
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
          form="transaction-form"
          class="flex-1 btn-primary"
          :disabled="loading || !isFormValid"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>{{ transaction ? 'Update' : 'Add' }} Transaction</span>
        </button>
      </div>
    </template>
  </Modal>
  <CategoryModal
    v-model="showCatgeoryModal"
    @success="handleCreatedCatgory"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useWalletsStore } from '@/stores/wallets';
import { useCategoriesStore } from '@/stores/categories';
import { useTransactionsStore } from '@/stores/transactions';
import { useConfigStore } from '@/stores/config';
import Modal from '@/components/ui/Modal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import CategoryModal from '@/components/category/CategoryModal.vue';
import type { Transaction, TransactionType } from '@/types/transaction';
import { TrendingUp, TrendingDown, Plus, ArrowRightLeft } from 'lucide-vue-next';
import { format } from 'date-fns';
import { Category } from '@/types/category';
import { getIcon } from '@/utils/icons';

interface Props {
  modelValue: boolean;
  transaction?: Transaction | null;
  type?: TransactionType;
  walletId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  transaction: null,
  walletId: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'success': [];
}>();

const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const showCatgeoryModal = ref(false);

const walletsStore = useWalletsStore();
const categoriesStore = useCategoriesStore();
const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();

const modalTitle = computed(() => {
  if (props.transaction) return 'Edit Transaction';
  if (form.type === 'income') return 'Add Income';
  if (form.type === 'expense') return 'Add Expense';
  if (form.type === 'transfer') return 'Add Transfer';
  return 'Add Transaction';
});

const loading = ref(false);
const error = ref('');

const form = reactive({
  type: props.type || ('expense' as TransactionType),
  amount: 0,
  wallet_id: '',
  destination_wallet_id: '',
  category_id: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  note: '',
  is_recurring: false,
  recurring_pattern: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
});

const availableCategories = computed(() => {
  return categoriesStore.categories.filter((c) => c.type === form.type);
});

const availableDestinationWallets = computed(() => {
  return walletsStore.wallets.filter(w => w.id !== form.wallet_id);
});

const selectedCategorie = computed(() => {
  if (form.category_id) {
    return categoriesStore.getCategoryById(form.category_id) || null;
  }
  return null;
});

const isFormValid = computed(() => {
  if (form.type === 'transfer') {
    return form.amount > 0 && form.wallet_id && form.destination_wallet_id && form.wallet_id !== form.destination_wallet_id && form.date;
  }
  return form.amount > 0 && form.wallet_id && form.category_id && form.date;
});

const handleSubmit = async () => {
  if (!isFormValid.value || loading.value) return;

  loading.value = true;
  error.value = '';

  try {
    const transactionData = {
      type: form.type,
      amount: Number(form.amount),
      wallet_id: form.wallet_id,
      category_id: form.type === 'transfer' ? null : form.category_id,
      destination_wallet_id: form.type === 'transfer' ? form.destination_wallet_id : undefined,
      date: new Date(form.date).toISOString(),
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
    destination_wallet_id: '',
    category_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    note: '',
    is_recurring: false,
    recurring_pattern: 'monthly',
  });
};

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) return;

  if (props.transaction) {
    Object.assign(form, {
      type: props.transaction.type,
      amount: props.transaction.amount,
      wallet_id: props.transaction.wallet_id,
      destination_wallet_id: props.transaction.destination_wallet_id || '',
      category_id: props.transaction.category_id,
      date: format(new Date(props.transaction.date), 'yyyy-MM-dd'),
      note: props.transaction.note || '',
      is_recurring: props.transaction.is_recurring,
      recurring_pattern: props.transaction.recurring_pattern || 'monthly',
    });
  } else {
    resetForm();
    if (props.walletId) form.wallet_id = props.walletId;
    if (props.type) form.type = props.type;
  }
});

watch(() => props.type, (newType) => {
  if (newType) form.type = newType;
});

function toggleFormType(type: TransactionType) {
  form.type = type;
  form.category_id = '';
}

function handleCreatedCatgory(category?: Category) {
  showCatgeoryModal.value = false;
  if (category?.id) {
    form.category_id = category.id;
  }
}

onMounted(async () => {
  const today = new Date();
  today.setHours(24, 0, 0);
  const todayIso = today.toISOString();
  await Promise.all([
    walletsStore.fetchWallets(false, undefined, todayIso),
    categoriesStore.fetchCategories(),
  ]);
});
</script>

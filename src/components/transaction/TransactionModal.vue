<template>
  <Modal v-model="isModalOpen" :title="modalTitle">
    <form @submit.prevent="handleSubmit" id="transaction-form" class="space-y-6 pt-4">
      <!-- Amount -->
      <div class="text-center">
        <label for="amount" class="label sr-only">{{ $t('transactionModal.amount') }}</label>
        <CurrencyInput
          v-model="form.amount"
          el-id="amount"
          :required="true"
          :disabled="loading"
          :placeholder="$t('transactionModal.amountPlaceholder')"
        />
      </div>

      <!-- Transaction Type -->
      <div v-if="!type">
        <label class="label text-center">{{ $t('transactionModal.transactionType') }}</label>
        <div class="grid grid-cols-3 gap-2 max-w-sm mx-auto">
          <button
            type="button"
            @click="toggleFormType('income')"
            class="p-2 rounded-lg border-2 transition-all"
            :class="form.type === 'income' ? 'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300' : 'text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
          >
            <TrendingUp class="w-5 h-5 mx-auto" />
            <span class="text-xs font-medium">{{ $t('transactionModal.income') }}</span>
          </button>
          <button
            type="button"
            @click="toggleFormType('expense')"
            class="p-2 rounded-lg border-2 transition-all"
            :class="form.type === 'expense' ? 'border-error-500 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300' : 'text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
          >
            <TrendingDown class="w-5 h-5 mx-auto" />
            <span class="text-xs font-medium">{{ $t('transactionModal.expense') }}</span>
          </button>
          <button
            type="button"
            @click="toggleFormType('transfer')"
            class="p-2 rounded-lg border-2 transition-all"
            :class="form.type === 'transfer' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
          >
            <ArrowRightLeft class="w-5 h-5 mx-auto" />
            <span class="text-xs font-medium">{{ $t('transactionModal.transfer') }}</span>
          </button>
        </div>
      </div>

      <div class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
        <!-- Wallet -->
        <div>
          <label for="wallet" class="label">{{ form.type === 'transfer' ? $t('transactionModal.sourceWallet') : $t('transactionModal.wallet') }}</label>
          <select id="wallet" v-model="form.wallet_id" required class="input" :disabled="loading || walletsStore.loading" autocomplete="off">
            <option value="">{{ $t('transactionModal.selectWallet') }}</option>
            <option v-for="wallet in walletsStore.wallets" :key="wallet.id" :value="wallet.id" class="">
              {{ wallet.name }} {{ wallet.is_main_wallet ? $t('transactionModal.main') : '' }} ({{ configStore.formatCurrency(wallet.current_balance || 0) }})
            </option>
          </select>
        </div>

        <!-- Destination Wallet (for transfers) -->
        <div v-if="form.type === 'transfer'">
          <label for="destination_wallet" class="label">{{ $t('transactionModal.destinationWallet') }}</label>
          <select id="destination_wallet" v-model="form.destination_wallet_id" required class="input" :disabled="loading || walletsStore.loading" autocomplete="off">
            <option value="">{{ $t('transactionModal.selectDestination') }}</option>
            <option v-for="wallet in availableDestinationWallets" :key="wallet.id" :value="wallet.id" class="">
              {{ wallet.name }} {{ wallet.is_main_wallet ? $t('transactionModal.main') : '' }} ({{ configStore.formatCurrency(wallet.current_balance || 0) }})
            </option>
          </select>
        </div>

        <!-- Category -->
        <div v-if="form.type !== 'transfer'">
          <label for="category" class="label">{{ $t('transactionModal.category') }}</label>
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
                <option value="">{{ $t('transactionModal.selectCategory') }}</option>
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
          <label for="date" class="label">{{ $t('transactionModal.date') }}</label>
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
          <label for="note" class="label">{{ $t('transactionModal.noteOptional') }}</label>
          <textarea
            id="note"
            v-model="form.note"
            class="input"
            rows="3"
            :placeholder="$t('transactionModal.notePlaceholder')"
            :disabled="loading"
            autocomplete="off"
          ></textarea>
        </div>

        <!-- Recurring Options -->
        <div v-if="!transaction" class="space-y-3">
          <div class="flex item-start lg:items-center justify-between rounded-lg p-3 border border-sepia-300 dark:border-gray-700 bg-sepia-100 dark:bg-gray-800/50 gap-4">
            <div>
              <label for="recurring" class="font-medium text-sepia-900 dark:text-gray-100">
                {{ $t('transactionModal.makeRecurring') }}
              </label>
            </div>
            <button
              type="button"
              @click="form.is_recurring = !form.is_recurring"
              :class="[
                form.is_recurring ? 'bg-sepia-700 dark:bg-neon' : 'bg-sepia-300 dark:bg-gray-700',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sepia-500 dark:focus:ring-neon focus:ring-offset-2 dark:focus:ring-offset-gray-900'
              ]"
              role="switch"
              :aria-checked="form.is_recurring"
              :disabled="loading"
              id="recurring"
            >
              <span class="sr-only">{{ $t('transactionModal.makeRecurring') }}</span>
              <span
                aria-hidden="true"
                :class="[
                  form.is_recurring ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                ]"
              />
            </button>
          </div>

          <div v-if="form.is_recurring" class="space-y-4">
            <div>
              <label for="pattern" class="label">{{ $t('transactionModal.recurringPattern') }}</label>
              <select
                id="pattern"
                v-model="form.recurring_pattern"
                class="input"
                :disabled="loading"
                autocomplete="off"
              >
                <option value="daily">{{ $t('transactionModal.daily') }}</option>
                <option value="weekly">{{ $t('transactionModal.weekly') }}</option>
                <option value="monthly">{{ $t('transactionModal.monthly') }}</option>
                <option value="yearly">{{ $t('transactionModal.yearly') }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="recurring_count" class="label">{{ $t('transactionModal.recurringCount') }}</label>
                <input
                  id="recurring_count"
                  v-model.number="form.recurring_count"
                  type="number"
                  min="0"
                  class="input"
                  :placeholder="$t('transactionModal.recurringCountPlaceholder')"
                  :disabled="loading"
                  autocomplete="off"
                />
                <p class="text-xs label mt-1">{{ $t('transactionModal.recurringCountHint') }}</p>
              </div>

              <div>
                <label for="recurring_until" class="label">{{ $t('transactionModal.recurringUntil') }}</label>
                <input
                  id="recurring_until"
                  v-model="form.recurring_until"
                  type="date"
                  class="input"
                  :disabled="loading"
                  autocomplete="off"
                />
                <p class="text-xs label mt-1">{{ $t('transactionModal.recurringUntilHint') }}</p>
              </div>
            </div>
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
          {{ $t('transactionModal.cancel') }}
        </button>
        <button
          type="submit"
          form="transaction-form"
          class="flex-1 btn-primary"
          :disabled="loading || !isFormValid"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>{{ transaction ? $t('transactionModal.update') : $t('transactionModal.add') }} {{ $t('transactionModal.transaction') }}</span>
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
import { useI18n } from 'vue-i18n';
import { useWalletsStore } from '@/stores/wallets';
import { useCategoriesStore } from '@/stores/categories';
import { useTransactionsStore } from '@/stores/transactions';
import { useConfigStore } from '@/stores/config';
import Modal from '@/components/ui/Modal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import CategoryModal from '@/components/category/CategoryModal.vue';
import type { Transaction, TransactionType } from '@/types/transaction';
import { TrendingUp, TrendingDown, Plus, ArrowRightLeft } from 'lucide-vue-next';
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { Category } from '@/types/category';
import { getIcon } from '@/utils/icons';
import CurrencyInput from '../ui/CurrencyInput.vue';

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

const { t } = useI18n();
const walletsStore = useWalletsStore();
const categoriesStore = useCategoriesStore();
const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();

const modalTitle = computed(() => {
  if (props.transaction) return t('transactionModal.editTransaction');
  if (form.type === 'income') return t('transactionModal.addIncome');
  if (form.type === 'expense') return t('transactionModal.addExpense');
  if (form.type === 'transfer') return t('transactionModal.addTransfer');
  return t('transactionModal.addTransaction');
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
  recurring_count: undefined as number | undefined,
  recurring_until: '',
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
      recurring_count: form.is_recurring && form.recurring_count ? form.recurring_count : undefined,
      recurring_until: form.is_recurring && form.recurring_until ? new Date(form.recurring_until).toISOString() : undefined,
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
      error.value = result.error || t('transactionModal.saveFailed');
    }
  } catch (err) {
    error.value = t('transactionModal.unexpectedError');
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
    recurring_count: undefined,
    recurring_until: '',
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
      is_recurring: props.transaction.is_recurring || false,
      recurring_pattern: props.transaction.recurring_pattern || 'monthly',
      recurring_count: props.transaction.recurring_count,
      recurring_until: props.transaction.recurring_until ? format(new Date(props.transaction.recurring_until), 'yyyy-MM-dd') : '',
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

// Auto-calculate recurring_until based on recurring_pattern
watch([() => form.recurring_pattern, () => form.date, () => form.is_recurring], () => {
  if (form.is_recurring && !form.recurring_until && !form.recurring_count) {
    const startDate = new Date(form.date);
    let defaultEndDate: Date;

    switch (form.recurring_pattern) {
      case 'daily':
        defaultEndDate = addDays(startDate, 30);
        break;
      case 'weekly':
        defaultEndDate = addWeeks(startDate, 12);
        break;
      case 'monthly':
        defaultEndDate = addMonths(startDate, 12);
        break;
      case 'yearly':
        defaultEndDate = addYears(startDate, 5);
        break;
      default:
        defaultEndDate = addMonths(startDate, 12);
    }

    form.recurring_until = format(defaultEndDate, 'yyyy-MM-dd');
  }
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

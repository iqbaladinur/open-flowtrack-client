<template>
  <Modal v-model="isModalOpen" :title="budget ? 'Edit Budget' : 'Create Budget'">
    <form @submit.prevent="handleSubmit" id="budget-form" class="space-y-4">
      <div>
        <label for="name" class="label">Budget Name</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          required
          class="input"
          placeholder="e.g. Monthly Food Budget"
          :disabled="loading"
        />
      </div>

      <div class="text-center">
        <label for="limit" class="label sr-only">Budget Limit</label>
        <CurrencyInput
          v-model="form.limit_amount"
          el-id="limit"
          :required="true"
          :disabled="loading"
          placeholder="0.00"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Enter the limit for this budget.
        </p>
      </div>

      <div>
        <label for="category" class="label">Categories</label>
        <select
          id="category"
          v-model="form.category_ids"
          required
          multiple
          class="input"
          :disabled="loading || categoriesStore.loading"
        >
          <option
            v-for="category in expenseCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
         <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Select one or more categories for this budget.
        </p>
      </div>

      <!-- Start and End Date -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="start_date" class="label">Start Date</label>
          <input
            type="date"
            id="start_date"
            v-model="form.start_date"
            required
            class="input"
            :disabled="loading"
          />
        </div>
        <div>
          <label for="end_date" class="label">End Date</label>
          <input
            type="date"
            id="end_date"
            v-model="form.end_date"
            required
            class="input"
            :disabled="loading"
          />
        </div>
      </div>

      <!-- Budget Preview -->
      <div v-if="form.name" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg relative">
        <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-2">
          {{ form.name }}
        </h3>
        <div class="flex items-center justify-between">
          <p class="text-gray-600 dark:text-gray-200 text-base">
            Limit: {{ configStore.formatCurrency(form.limit_amount) }}
          </p>
          <div class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-xs font-bold text-gray-600 dark:text-gray-300">
            <CalendarDays class="w-4 h-4" />
            <span>{{ formatDateRange(form.start_date, form.end_date) }}</span>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
        <p class="text-sm text-error-700 dark:text-error-300">{{ error }}</p>
      </div>
    </form>
    <template #footer>
      <div class="flex space-x-3">
        <button
          type="button"
          @click="$emit('update:modelValue', false)"
          class="flex-1 btn-secondary"
          :disabled="loading"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="budget-form"
          class="flex-1 btn-primary"
          :disabled="loading || !isFormValid"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>{{ budget ? 'Update' : 'Create' }} Budget</span>
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useBudgetsStore } from '@/stores/budgets';
import { useCategoriesStore } from '@/stores/categories';
import { useConfigStore } from '@/stores/config';
import Modal from '@/components/ui/Modal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import CurrencyInput from '@/components/ui/CurrencyInput.vue';
import type { Budget, CreateBudgetPayload, UpdateBudgetPayload } from '@/types/budget';
import { CalendarDays } from 'lucide-vue-next';
import { format } from 'date-fns';

interface Props {
  modelValue: boolean;
  budget?: Budget | null;
}

const props = withDefaults(defineProps<Props>(), {
  budget: null,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'success': [];
}>();

const budgetsStore = useBudgetsStore();
const categoriesStore = useCategoriesStore();
const configStore = useConfigStore();

const loading = ref(false);
const error = ref('');

const form = reactive<CreateBudgetPayload>({
  name: '',
  category_ids: [],
  limit_amount: 0,
  start_date: '',
  end_date: '',
});

const expenseCategories = computed(() => {
  return categoriesStore.getCategoriesByType('expense');
});

const isFormValid = computed(() => {
  return form.name &&
         form.category_ids.length > 0 &&
         form.limit_amount > 0 &&
         form.start_date &&
         form.end_date;
});

const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'yyyy-MM-dd');
};

const formatDateForAPI = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString();
};

const handleSubmit = async () => {
  if (!isFormValid.value || loading.value) return;

  loading.value = true;
  error.value = '';

  try {
    const payload = {
      ...form,
      start_date: formatDateForAPI(form.start_date),
      end_date: formatDateForAPI(form.end_date),
    };

    let result;
    if (props.budget) {
      result = await budgetsStore.updateBudget(props.budget.id, payload as UpdateBudgetPayload);
    } else {
      result = await budgetsStore.createBudget(payload);
    }

    if (result.success) {
      emit('success');
      isModalOpen.value = false;
    } else {
      error.value = result.error || 'Failed to save budget. Please try again.';
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  const today = new Date();
  const firstDay = format(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd');
  const lastDay = format(new Date(today.getFullYear(), today.getMonth() + 1, 0), 'yyyy-MM-dd');

  Object.assign(form, {
    name: '',
    category_ids: [],
    limit_amount: 0,
    start_date: firstDay,
    end_date: lastDay,
  });
};

const formatDateRange = (start: string, end: string) => {
  if (!start || !end) return 'Select dates';
  const startDate = format(new Date(start), 'MMM d');
  const endDate = format(new Date(end), 'MMM d, yyyy');
  return `${startDate} - ${endDate}`;
};

// Watch for budget changes to populate form
watch(() => props.budget, (newBudget) => {
  if (newBudget) {
    Object.assign(form, {
      name: newBudget.name,
      category_ids: [...newBudget.category_ids],
      limit_amount: Number(newBudget.limit_amount) || 0,
      start_date: formatDate(newBudget.start_date),
      end_date: formatDate(newBudget.end_date),
    });
  } else {
    resetForm();
  }
}, { immediate: true });

onMounted(async () => {
  await categoriesStore.fetchCategories();
  if (!props.budget) {
    resetForm();
  }
});
</script>

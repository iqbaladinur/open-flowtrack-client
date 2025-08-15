<template>
  <Modal v-model="isModalOpen" :title="budget ? 'Edit Budget' : 'Create Budget'">
    <form @submit.prevent="handleSubmit" id="budget-form" class="space-y-4">
      <!-- Category -->
      <div>
        <label for="category" class="label">Category</label>
        <select
          id="category"
          v-model="form.category_id"
          required
          class="input"
          :disabled="loading || categoriesStore.loading || !!budget"
        >
          <option value="">Select a category</option>
          <option
            v-for="category in expenseCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <p v-if="budget" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Category cannot be changed when editing a budget.
        </p>
      </div>

      <!-- Budget Limit -->
      <div>
        <label for="limit" class="label">Budget Limit</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {{ configStore.currency }}
          </span>
          <input
            id="limit"
            v-model.number="form.limit_amount"
            type="number"
            step="0.01"
            min="0"
            required
            class="input pl-12"
            placeholder="0.00"
            :disabled="loading"
          />
        </div>
      </div>

      <!-- Month and Year -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="month" class="label">Month</label>
          <select
            id="month"
            v-model.number="form.month"
            required
            class="input"
            :disabled="loading || !!budget"
          >
            <option v-for="(month, index) in months" :key="index" :value="index + 1">
              {{ month }}
            </option>
          </select>
        </div>
        <div>
          <label for="year" class="label">Year</label>
          <select
            id="year"
            v-model.number="form.year"
            required
            class="input"
            :disabled="loading || !!budget"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>

      <p v-if="budget" class="text-xs text-gray-500 dark:text-gray-400">
        Month and year cannot be changed when editing a budget.
      </p>

      <!-- Budget Preview -->
      <div v-if="selectedCategory" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="flex items-center space-x-3 mb-2">
          <div
            class="w-6 h-6 rounded-full"
            :style="{ backgroundColor: selectedCategory.color }"
          ></div>
          <h4 class="font-medium text-gray-900 dark:text-white">
            {{ selectedCategory.name }} Budget
          </h4>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 font-mono">
          {{ months[form.month - 1] }} {{ form.year }} • {{ configStore.formatCurrency(form.limit_amount) }} limit
        </p>
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
import type { Budget } from '@/types/budget';

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

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear + i - 2);

const form = reactive({
  category_id: '',
  limit_amount: 0,
  month: new Date().getMonth() + 1,
  year: currentYear,
});

const expenseCategories = computed(() => {
  return categoriesStore.getCategoriesByType('expense');
});

const selectedCategory = computed(() => {
  return categoriesStore.getCategoryById(form.category_id);
});

const isFormValid = computed(() => {
  return form.category_id && 
         form.limit_amount > 0 && 
         form.month >= 1 && form.month <= 12 && 
         form.year;
});

const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const handleSubmit = async () => {
  if (!isFormValid.value || loading.value) return;

  loading.value = true;
  error.value = '';

  try {
    const budgetData = {
      category_id: form.category_id,
      limit_amount: form.limit_amount,
      month: form.month,
      year: form.year,
    };

    let result;
    if (props.budget) {
      // Only allow updating the limit amount
      result = await budgetsStore.updateBudget(props.budget.id, {
        limit_amount: form.limit_amount,
      });
    } else {
      result = await budgetsStore.createBudget(budgetData);
    }

    if (result.success) {
      emit('success');
      resetForm();
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
  Object.assign(form, {
    category_id: '',
    limit_amount: 0,
    month: new Date().getMonth() + 1,
    year: currentYear,
  });
};

// Watch for budget changes to populate form
watch(() => props.budget, (newBudget) => {
  if (newBudget) {
    Object.assign(form, {
      category_id: newBudget.category_id,
      limit_amount: newBudget.limit_amount || 0,
      month: newBudget.month,
      year: newBudget.year,
    });
  } else {
    resetForm();
  }
}, { immediate: true });

onMounted(async () => {
  await categoriesStore.fetchCategories();
});
</script>

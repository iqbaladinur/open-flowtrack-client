<template>
  <Modal v-model="isModalOpen" :title="budget ? $t('budgetModal.editBudget') : $t('budgetModal.createBudget')">
    <form @submit.prevent="handleSubmit" id="budget-form" class="space-y-4">
      <div class="text-center">
        <label for="limit" class="label sr-only">{{ $t('budgetModal.budgetLimit') }}</label>
        <CurrencyInput
          v-model="form.limit_amount"
          el-id="limit"
          :required="true"
          :disabled="loading"
          :placeholder="$t('budgetModal.budgetLimitPlaceholder')"
        />
        <p class="text-xs text-sepia-500 dark:text-gray-400 mt-2">
          {{ $t('budgetModal.budgetLimitHint') }}
        </p>
      </div>

      <div>
        <label for="name" class="label">{{ $t('budgetModal.budgetName') }}</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          required
          class="input"
          :placeholder="$t('budgetModal.budgetNamePlaceholder')"
          :disabled="loading"
        />
      </div>

      <!-- Start and End Date -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="start_date" class="label">{{ $t('budgetModal.startDate') }}</label>
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
          <label for="end_date" class="label">{{ $t('budgetModal.endDate') }}</label>
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

      <div>
        <label class="label">{{ $t('budgetModal.categories') }}</label>
        <div class="max-h-56 overflow-y-auto rounded-lg border border-sepia-300 dark:border-gray-700 p-2">
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="category in expenseCategories"
              :key="category.id"
              @click="toggleCategory(category.id)"
              class="relative card p-3 flex flex-col items-center justify-center text-center h-24 cursor-pointer border-2 transition-all truncate"
              :class="form.category_ids.includes(category.id || 'nodata') ? 'border-sepia-500 bg-sepia-50 dark:bg-primary-900/20' : 'border-transparent hover:bg-sepia-100 dark:hover:bg-gray-700 bg-sepia-50 dark:bg-black/30'"
            >
              <!-- Selected Check Icon -->
              <div v-if="form.category_ids.includes(category.id || 'nodata')" class="absolute top-2 right-2 w-5 h-5 bg-sepia-500 dark:bg-primary-500 rounded-full flex items-center justify-center text-white">
                <Check class="w-3 h-3" />
              </div>

              <!-- Category Icon -->
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                :style="{ backgroundColor: category.color + '20' }"
              >
                <component :is="getIcon(category.icon)" class="w-4 h-4" :style="{ color: category.color }" />
              </div>
              <p class="text-xs text-sepia-800 dark:text-gray-200 leading-tight truncate max-w-[80%]">
                {{ category.name }}
              </p>
            </div>
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
          {{ $t('budgetModal.cancel') }}
        </button>
        <button
          type="submit"
          form="budget-form"
          class="flex-1 btn-primary"
          :disabled="loading || !isFormValid"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>{{ budget ? $t('budgetModal.update') : $t('budgetModal.create') }} {{ $t('budgetModal.budget') }}</span>
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBudgetsStore } from '@/stores/budgets';
import { useCategoriesStore } from '@/stores/categories';
import { useConfigStore } from '@/stores/config';
import Modal from '@/components/ui/Modal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import CurrencyInput from '@/components/ui/CurrencyInput.vue';
import type { Budget, CreateBudgetPayload, UpdateBudgetPayload } from '@/types/budget';
import { Check } from 'lucide-vue-next';
import { getIcon } from '@/utils/icons';
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

const { t } = useI18n();
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

const toggleCategory = (categoryId?: string) => {
  if (!categoryId) {
    return;
  }

  const index = form.category_ids.indexOf(categoryId);
  if (index > -1) {
    form.category_ids.splice(index, 1);
  } else {
    form.category_ids.push(categoryId);
  }
};

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
      error.value = result.error || t('budgetModal.saveFailed');
    }
  } catch (err) {
    error.value = t('budgetModal.unexpectedError');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  const { start, end } = getInitialDate();

  Object.assign(form, {
    name: '',
    category_ids: [],
    limit_amount: 0,
    start_date: start,
    end_date: end,
  });
};

function getInitialDate() {
  const today = new Date();
  const firstDay = configStore.firstDayOfMonth;
  
  let startDate = new Date(today.getFullYear(), today.getMonth(), firstDay);

  // If today's date is before the first day of this calendar month,
  // it means we are still in the previous financial month.
  if (today.getDate() < firstDay) {
    startDate.setMonth(startDate.getMonth() - 1);
  }

  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);
  endDate.setDate(firstDay - 1);
  return {
    start: format(startDate, 'yyyy-MM-dd'),
    end:  format(endDate, 'yyyy-MM-dd'), 
  }
}

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

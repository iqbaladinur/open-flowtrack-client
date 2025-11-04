<template>
  <div
    class="overflow-hidden transition-all duration-300 ease-in-out"
    :class="{
      'max-h-[1000px]': isDetailsVisible,
      'max-h-[300px] sm:max-h-[300px]': !isDetailsVisible,
      'card': !simpleView,
      'border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/30': simpleView
    }"
  >
    <div :class="simpleView ? 'p-3 py-4' : 'p-3'">
      <!-- Header -->
      <div v-if="!simpleView" class="flex items-center justify-between w-full mb-4">
        <div class="flex items-center gap-1.5 card p-2 text-xs font-bold text-gray-600 dark:text-gray-300">
          <CalendarDays class="w-4 h-4" />
          <span>{{ formatDateRange(budget.start_date, budget.end_date) }}</span>
        </div>
        <div class="flex flex-col items-end gap-2 card">
          <div class="flex items-center space-x-1">
            <button @click="$emit('edit', budget)" class="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <NotebookPen class="w-4 h-4" />
            </button>
            <button @click="$emit('delete', budget.id)" class="p-2 rounded-full text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-error-600 dark:hover:text-error-400 transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div class="flex items-start justify-between" :class="{ 'card p-2': !simpleView }">
        <div :class="{ 'flex items-center gap-3 justify-between w-full mb-3': simpleView }">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white" :class="{ 'text-sm font-semibold truncate max-w-[60%]': simpleView }">
            {{ budget.name }}
          </h3>
          <div class="flex items-center flex-wrap gap-1" :class="{ 'mt-2': !simpleView }">
            <div
              v-for="(category) in budgetCategories"
              :key="category.id"
              class="flex items-center rounded-full size-6 justify-center"
              :style="{ backgroundColor: category.color + '20', color: category.color }"
              :title="category.name"
            >
              <component :is="getIcon(category.icon)" class="size-3" />
            </div>
          </div>
        </div>
      </div>

      <!-- Budget Details & Progress -->
      <div class="mt-2">
        <!-- Simple View Layout -->
        <div v-if="simpleView" class="space-y-1.5">
          <!-- Spent & Remaining Row -->
          <div class="flex items-center justify-between gap-2">
            <div class="flex-1">
              <p class="text-[9px] text-gray-500 dark:text-gray-400 mb-0.5">{{ $t('dashboard.spent') }}</p>
              <p class="text-[11px] font-semibold font-mono text-gray-900 dark:text-white">
                {{ configStore.formatCurrency(budget.total_spent || 0) }}
              </p>
            </div>
            <div class="flex-1 text-right">
              <p class="text-[9px] dark:text-gray-400 mb-0.5" :class="isOverspent ? 'text-error-500' : 'text-success-600'">
                {{ isOverspent ? $t('dashboard.over') : $t('dashboard.left') }}
              </p>
              <p
                class="text-[11px] font-semibold font-mono"
                :class="isOverspent ? 'text-error-500' : 'text-success-600 dark:text-success-400'"
              >
                {{ configStore.formatCurrency(remainingAmount) }}
              </p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div
              class="h-1 rounded-full transition-all duration-500"
              :class="progressBarClass"
              :style="{ width: Math.min(getBudgetProgress(budget), 100) + '%' }"
            ></div>
          </div>

          <!-- Limit -->
          <div class="text-right">
            <p class="text-[9px] text-gray-400 dark:text-gray-500">
              {{ $t('dashboard.limit') }}: <span class="font-mono font-medium">{{ configStore.formatCurrency(budget.limit_amount) }}</span>
            </p>
          </div>
        </div>

        <!-- Normal View Layout -->
        <div v-else>
          <div class="text-left mb-3">
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ isOverspent ? $t('dashboard.over') : $t('dashboard.left') }}</p>
            <p
              class="font-mono text-lg font-bold"
              :class="isOverspent ? 'text-error-500' : 'text-success-600 dark:text-success-400'"
            >
              {{ configStore.formatCurrency(remainingAmount) }}
            </p>
          </div>
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>{{ $t('dashboard.spent') }}: {{ configStore.formatCurrency(budget.total_spent || 0) }}</span>
            <span>{{ $t('dashboard.limit') }}: {{ configStore.formatCurrency(budget.limit_amount) }}</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all duration-500"
              :class="progressBarClass"
              :style="{ width: Math.min(getBudgetProgress(budget), 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- View Details Section -->
    <div v-if="!simpleView" class="border-t border-gray-200 dark:border-gray-700">
      <button @click="toggleDetails" class="w-full text-sm py-3 px-5 font-medium text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center gap-2 transition-colors">
        <span>{{ isDetailsVisible ? $t('common.close') : $t('common.view') }} {{ $t('common.details') }}</span>
        <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isDetailsVisible }" />
      </button>

      <div v-if="isDetailsVisible" class="bg-gray-50 dark:bg-gray-900/50">
        <div v-if="isLoadingDetails" class="flex justify-center items-center p-6">
          <LoadingSpinner />
        </div>
        <div v-else-if="detailedTransactions.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
          <TransactionItem
            v-for="transaction in detailedTransactions"
            :key="transaction.id"
            :transaction="transaction"
            class="px-5 py-3"
          />
        </div>
        <div v-else class="text-center text-gray-500 dark:text-gray-400 py-8 px-5">
          <p>{{ $t('budgetCard.noTransactions') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { PropType } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import { useConfigStore } from '@/stores/config';
import { useCategoriesStore } from '@/stores/categories';
import type { Budget } from '@/types/budget';
import type { Transaction } from '@/types/transaction';
import { getIcon } from '@/utils/icons';
import { Trash2, ChevronDown, CalendarDays, NotebookPen } from 'lucide-vue-next';
import TransactionItem from '@/components/transaction/TransactionItem.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import { format } from 'date-fns';

const props = defineProps({
  budget: {
    type: Object as PropType<Budget>,
    required: true,
  },
  simpleView: {
    type: Boolean as PropType<boolean>,
    required: false,
  }
});

defineEmits<{
  (e: 'edit', budget: Budget): void;
  (e: 'delete', id: string): void;
}>();

const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();
const categoriesStore = useCategoriesStore();

const isDetailsVisible = ref(false);
const isLoadingDetails = ref(false);
const detailedTransactions = ref<Transaction[]>([]);

const spentAmount = computed(() => props.budget.total_spent || 0);
const isOverspent = computed(() => spentAmount.value > props.budget.limit_amount);

const remainingAmount = computed(() => {
  const remaining = props.budget.limit_amount - spentAmount.value;
  return Math.abs(remaining);
});

const budgetCategories = computed(() => {
  return props.budget.categories;
});

const progressBarClass = computed(() => {
  const progress = getBudgetProgress(props.budget);
  if (progress > 100) return 'bg-red-700';
  if (progress > 90) return 'bg-error-500';
  if (progress > 75) return 'bg-warning-500';
  if (progress > 50) return 'bg-success-500';
  return 'bg-blue-500';
});

const getBudgetProgress = (budget: Budget) => {
  const limit = budget.limit_amount;
  if (limit === 0) return 100;
  return ((budget.total_spent || 0) / limit) * 100;
};

const formatDateRange = (start: string, end: string) => {
  if (!start || !end) return '';
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return format(startDate, 'MMMM yyyy');
  }
  return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
};

const toggleDetails = async () => {
  isDetailsVisible.value = !isDetailsVisible.value;
  if (isDetailsVisible.value && detailedTransactions.value.length === 0) {
    isLoadingDetails.value = true;
    
    const filters = {
      type: 'expense',
      start_date: props.budget.start_date,
      end_date: props.budget.end_date,
    };

    const category_ids = props.budget.category_ids;
    
    try {
      // Assuming fetchTransactions can handle an array of category_ids
      // @ts-ignore
      const result = await transactionsStore.fetchTransactions(filters, true, true);
      console.log(result);
      detailedTransactions.value = <Transaction[]>result?.filter((a: Transaction) => category_ids.includes(a.category_id || 'noid')) || [];
    } catch (error) {
      console.error("Failed to fetch transactions for budget:", error);
    } finally {
      isLoadingDetails.value = false;
    }
  }
};

onMounted(() => {
  categoriesStore.fetchCategories();
});
</script>

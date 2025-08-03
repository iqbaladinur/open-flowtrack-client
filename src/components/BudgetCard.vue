<template>
  <div class="card overflow-hidden transition-all duration-300 ease-in-out" :class="{ 'max-h-[1000px]': isDetailsVisible, 'max-h-[300px] sm:max-h-[300px]': !isDetailsVisible }">
    <div class="p-5">
      <!-- Header -->
      <div class="flex items-center justify-between w-full mb-4">
        <div class="flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-xs font-bold text-gray-600 dark:text-gray-300">
          <CalendarDays class="w-4 h-4" />
          <span>{{ getMonthName(budget.month) }} {{ budget.year }}</span>
        </div>
        <div class="flex flex-col items-end gap-2">
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
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div
            class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            :style="{ backgroundColor: budget.category.color + '20', color: budget.category.color }"
          >
            <!-- @vue-ignore -->
            <component :is="icons[budget.category.icon] || icons['Tag']" class="w-4 h-4" />
          </div>
          <div>
            <h3 class="font-bold text-sm text-gray-900 dark:text-white">
              {{ budget.category.name }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Budget Details & Progress -->
      <div class="mt-2">
        <div class="text-left mb-3">
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ isOverspent ? 'Overspent by' : 'Remaining' }}</p>
          <p 
            class="text-lg font-bold font-mono"
            :class="isOverspent ? 'text-error-500' : 'text-success-600 dark:text-success-400'"
          >
            {{ configStore.formatCurrency(remainingAmount) }}
          </p>
        </div>
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Spent: {{ configStore.formatCurrency(budget.total_spent) }}</span>
          <span>Limit: {{ configStore.formatCurrency(budget.limit_amount) }}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div
            class="h-1 rounded-full transition-all duration-500"
            :class="progressBarClass"
            :style="{ width: Math.min(getBudgetProgress(budget), 100) + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- View Details Section -->
    <div class="border-t border-gray-200 dark:border-gray-700">
      <button @click="toggleDetails" class="w-full text-sm py-3 px-5 font-medium text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center gap-2 transition-colors">
        <span>{{ isDetailsVisible ? 'Hide' : 'View' }} Details</span>
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
          <p>No transactions found for this budget period.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PropType } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import { useConfigStore } from '@/stores/config';
import type { Budget, Transaction } from '@/types';
import * as icons from 'lucide-vue-next';
import { Trash2, ChevronDown, CalendarDays, NotebookPen } from 'lucide-vue-next';
import TransactionItem from './TransactionItem.vue';
import LoadingSpinner from './ui/LoadingSpinner.vue';
import { startOfMonth, endOfMonth } from 'date-fns';

const props = defineProps({
  budget: {
    type: Object as PropType<Budget>,
    required: true,
  },
});

defineEmits<{
  (e: 'edit', budget: Budget): void;
  (e: 'delete', id: string): void;
}>();

const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();

const isDetailsVisible = ref(false);
const isLoadingDetails = ref(false);
const detailedTransactions = ref<Transaction[]>([]);

const isOverspent = computed(() => props.budget.total_spent > props.budget.limit_amount);

const remainingAmount = computed(() => {
  const remaining = props.budget.limit_amount - props.budget.total_spent;
  return Math.abs(remaining);
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
  if (limit === 0) return 100; // If limit is 0, any spending is 100% over
  return (budget.total_spent / limit) * 100;
};

const getMonthName = (month: number) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1];
};

const toggleDetails = async () => {
  isDetailsVisible.value = !isDetailsVisible.value;
  if (isDetailsVisible.value && detailedTransactions.value.length === 0) {
    isLoadingDetails.value = true;
    
    const year = props.budget.year;
    const month = props.budget.month;
    
    const lastDay = new Date(year, month, 0).getDate();
    
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const filters = {
      type: 'expense',
      category_id: props.budget.category_id,
      start_date: startOfMonth(new Date(startDate)).toISOString(),
      end_date: endOfMonth(new Date(endDate)).toISOString(),
    };
    // @ts-ignore
    await transactionsStore.fetchTransactions(filters, true);
    
    detailedTransactions.value = transactionsStore.transactions.filter(t => 
      t.category_id === props.budget.category_id &&
      t.date >= startDate &&
      t.date <= endDate
    );

    isLoadingDetails.value = false;
  }
};
</script>

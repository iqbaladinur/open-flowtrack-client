<template>
  <div
    class="overflow-hidden transition-all duration-300 ease-in-out"
    :class="{
      'max-h-[1000px]': isDetailsVisible,
      'max-h-[300px] sm:max-h-[300px]': !isDetailsVisible,
      'card': !simpleView,
      'hover:bg-sepia-100 dark:hover:bg-gray-800/30 cursor-pointer first:rounded-t-md last:rounded-b-md hover:first:rounded-t-xl hover:last:rounded-b-xl': simpleView
    }"
    @click="isDetailsSimpleVisible = !isDetailsSimpleVisible"
  >
    <!-- Simple View -->
    <div v-if="simpleView" class="p-3 dark:hover:bg-gray-800/30 transition-colors">
      <div class="flex justify-between items-start mb-2">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <h3 class="font-medium text-sepia-900 dark:text-white text-xs">{{ budget.name }}</h3>
            <div class="flex -space-x-1">
              <div
                v-for="category in budgetCategories"
                :key="category.id"
                class="flex items-center justify-center size-4 rounded-full ring-1 ring-white dark:ring-gray-800 bg-sepia-100 dark:bg-gray-900"
                :style="{ color: category.color }"
                :title="category.name"
              >
                <component :is="getIcon(category.icon)" class="size-2.5" />
              </div>
            </div>
          </div>
        </div>

        <div class="text-right relative">
          <!-- State 1: Progress % -->
          <div
            class="grid transition-all duration-300 ease-in-out"
            :class="!isDetailsSimpleVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="overflow-hidden">
              <p class="text-[9px] tracking-wider text-sepia-500 dark:text-gray-400 mb-0.5">
                <span>{{ formattedProgress }}</span>
              </p>
            </div>
          </div>

          <!-- State 2: Details -->
          <div
            class="grid transition-all duration-300 ease-in-out"
            :class="isDetailsSimpleVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="overflow-hidden">
              <div class="flex flex-col items-end">
                <p class="text-[9px] tracking-wider text-sepia-500 dark:text-gray-400 mb-0.5">
                  {{ isOverspent ? $t('dashboard.over') : $t('dashboard.left') }}
                </p>
                <p class=" text-xs leading-none" :class="amountClass">
                  {{ formattedRemaining }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col">
        <div class="h-[2px] w-full bg-sepia-200 dark:bg-gray-700 rounded-full overflow-hidden" :class="{ '!h-1': isDetailsSimpleVisible }">
          <div
            class="h-full transition-all duration-500 rounded-full"
            :class="progressBarClass"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>

        <div
          class="grid transition-all duration-300 ease-in-out"
          :class="isDetailsSimpleVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
        >
          <div class="overflow-hidden">
            <div class="flex justify-between items-center text-[10px] font-medium text-sepia-500 dark:text-gray-400 mt-1.5">
              <span>{{ formattedProgress }}%</span>
              <span class="">{{ formattedSpent }} <span class="text-sepia-300 dark:text-gray-600">/</span> {{ formattedLimit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Normal View -->
    <div v-else class="p-3">
      <!-- Header -->
      <div class="flex items-center justify-between w-full mb-4">
        <div class="flex items-center gap-1.5 card p-2 text-xs font-bold text-sepia-600 dark:text-gray-300">
          <CalendarDays class="w-4 h-4" />
          <span>{{ formatDateRange(budget.start_date, budget.end_date) }}</span>
        </div>
        <div class="flex flex-col items-end gap-2 card">
          <div class="flex items-center space-x-1">
            <button @click="duplicateForNextMonth" :disabled="duplicating" class="p-2 rounded-full text-sepia-400 dark:text-slate-50 hover:bg-sepia-100 dark:hover:bg-gray-700 hover:text-sepia-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :title="$t('common.duplicate')">
              <Loader2 v-if="duplicating" class="w-4 h-4 animate-spin" />
              <Copy v-else class="w-4 h-4" />
            </button>
            <button @click="emit('edit', budget)" class="p-2 rounded-full text-sepia-400 dark:text-slate-50 hover:bg-sepia-100 dark:hover:bg-gray-700 hover:text-sepia-600 dark:hover:text-gray-300 transition-colors">
              <NotebookPen class="w-4 h-4" />
            </button>
            <button @click="emit('delete', budget.id)" class="p-2 rounded-full text-sepia-400 dark:text-slate-50 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-error-600 dark:hover:text-error-400 transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Title & Categories -->
      <div class="flex items-start justify-between card p-2">
        <div>
          <h3 class="font-bold text-sm text-sepia-900 dark:text-white">
            {{ budget.name }}
          </h3>
          <div class="flex items-center flex-wrap gap-1 mt-2">
            <div
              v-for="category in budgetCategories"
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
        <div class="text-left mb-3">
          <p class="text-xs text-sepia-500 dark:text-gray-400">{{ isOverspent ? $t('dashboard.over') : $t('dashboard.left') }}</p>
          <p class=" text-lg font-bold" :class="amountClass">
            {{ formattedRemaining }}
          </p>
        </div>
        <div class="flex justify-between text-xs text-sepia-500 dark:text-gray-400 mb-1">
          <span>{{ $t('dashboard.spent') }}: {{ formattedSpent }}</span>
          <span>{{ $t('dashboard.limit') }}: {{ formattedLimit }}</span>
        </div>
        <div class="w-full bg-sepia-200 dark:bg-gray-700 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-500"
            :class="progressBarClass"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- View Details Section -->
    <div v-if="!simpleView" class="border-t border-sepia-200 dark:border-gray-700">
      <button @click="toggleDetails" class="w-full text-sm py-3 px-5 font-medium text-sepia-600 dark:text-primary-400 bg-sepia-100 dark:bg-gray-700/50 flex items-center justify-center gap-2 transition-colors">
        <span>{{ isDetailsVisible ? $t('common.close') : $t('common.view') }} {{ $t('common.details') }}</span>
        <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isDetailsVisible }" />
      </button>

      <div v-if="isDetailsVisible" class="bg-sepia-50 dark:bg-gray-900/50">
        <div v-if="isLoadingDetails" class="flex justify-center items-center p-6">
          <LoadingSpinner />
        </div>
        <div v-else-if="detailedTransactions.length > 0" class="divide-y divide-sepia-200 dark:divide-gray-700">
          <TransactionItem
            v-for="transaction in detailedTransactions"
            :key="transaction.id"
            :transaction="transaction"
            class="px-5 py-3"
          />
        </div>
        <div v-else class="text-center text-sepia-500 dark:text-gray-400 py-8 px-5">
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
import { Trash2, ChevronDown, CalendarDays, NotebookPen, Copy, Loader2 } from 'lucide-vue-next';
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
  },
  duplicating: {
    type: Boolean as PropType<boolean>,
    default: false,
  }
});

import type { CreateBudgetPayload } from '@/types/budget';

const emit = defineEmits<{
  (e: 'edit', budget: Budget): void;
  (e: 'delete', id: string): void;
  (e: 'duplicate', budgetId: string, payload: CreateBudgetPayload): void;
}>();

const duplicateForNextMonth = () => {
  const currentStart = new Date(props.budget.start_date);
  const currentEnd = new Date(props.budget.end_date);

  // Calculate next month dates
  const nextStart = new Date(currentStart);
  nextStart.setMonth(nextStart.getMonth() + 1);

  const nextEnd = new Date(currentEnd);
  nextEnd.setMonth(nextEnd.getMonth() + 1);

  // Smart naming: replace existing month suffix or add new one
  const monthYearPattern = / - [A-Z][a-z]{2} \d{4}$/;
  const targetMonthYear = format(nextStart, 'MMM yyyy');

  let newName: string;
  if (monthYearPattern.test(props.budget.name)) {
    newName = props.budget.name.replace(monthYearPattern, ` - ${targetMonthYear}`);
  } else {
    newName = `${props.budget.name} - ${targetMonthYear}`;
  }

  const payload: CreateBudgetPayload = {
    name: newName,
    limit_amount: Number(props.budget.limit_amount),
    start_date: format(nextStart, 'yyyy-MM-dd'),
    end_date: format(nextEnd, 'yyyy-MM-dd'),
    category_ids: props.budget.category_ids,
  };

  emit('duplicate', props.budget.id, payload);
};

const transactionsStore = useTransactionsStore();
const configStore = useConfigStore();
const categoriesStore = useCategoriesStore();

const isDetailsVisible = ref(false);
const isDetailsSimpleVisible = ref(false);
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

const progressPercentage = computed(() => {
  return Math.min(getBudgetProgress(props.budget), 100);
});

const formattedProgress = computed(() => configStore.formatProsentase(progressPercentage.value))
const formattedSpent = computed(() => configStore.formatCurrency(props.budget.total_spent || 0));
const formattedLimit = computed(() => configStore.formatCurrency(props.budget.limit_amount));
const formattedRemaining = computed(() => configStore.formatCurrency(remainingAmount.value));

const amountClass = computed(() => {
  return isOverspent.value ? 'text-error-500' : 'text-success-600 dark:text-success-400';
});

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

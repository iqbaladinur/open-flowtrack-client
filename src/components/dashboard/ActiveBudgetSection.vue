<template>
  <div :class="['flex flex-col', { 'card p-4': !overviewOnly }]">
    <div v-if="!overviewOnly" class="flex lg:items-start justify-between mb-4 lg:flex-row flex-col-reverse">
      <!-- Date Navigation -->
      <div class="flex items-center gap-3 mt-4 lg:mt-0 lg:justify-start">
        <button @click="navigateBudgetDate('previous')"
          class="flex items-center btn-secondary p-2 rounded-full btn-borderless">
          <ChevronLeft class="size-4 text-sepia-600 dark:text-gray-300" />
        </button>
        <span class="text-xs italic text-sepia-600 dark:text-gray-300 mx-auto">
          {{ activeBudgetPeriod }}
        </span>
        <button @click="navigateBudgetDate('next')"
          class="flex items-center btn-secondary p-2 rounded-full btn-borderless">
          <ChevronRight class="size-4 text-sepia-600 dark:text-gray-300" />
        </button>
      </div>

      <div class="flex gap-2 justify-between items-center lg:justify-end lg:items-start">
        <h2 class="text-lg font-semibold text-sepia-900 dark:text-neon">{{ $t('dashboard.activeBudget') }}</h2>
        <router-link to="/budgets"
          class="text-sm text-sepia-600 dark:text-primary-400 hover:text-sepia-700 dark:hover:text-primary-300 font-medium">
          <LucideArrowUpRightFromSquare class="size-4" />
        </router-link>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="budgets.length === 0 && !budgetsStore.loading" :class="['text-center m-auto', overviewOnly ? 'py-4' : 'py-8']">
      <div v-if="!overviewOnly"
        class="w-16 h-16 bg-sepia-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <Target class="size-8 text-sepia-400 dark:text-gray-400" />
      </div>
      <p class="text-sepia-500 dark:text-gray-400" :class="{ 'mb-4': !overviewOnly }">{{ $t('dashboard.noBudgetActive') }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="budgetsStore.loading && budgets.length === 0" :class="['flex justify-center items-center my-auto', overviewOnly ? 'py-4' : 'py-8']">
      <LoadingSpinner class="w-8 h-8" />
    </div>

    <!-- Budget Content -->
    <div v-else-if="budgets.length > 0" :class="{ 'space-y-10': !overviewOnly }">
      <!-- Overall Budget Summary Card -->
      <div :class="{ 'card p-4': !overviewOnly }">
        <div class="mb-3">
          <h3 class="text-sm font-semibold text-sepia-900 dark:text-white">{{ $t('dashboard.overallActiveBudget') }}</h3>
          <p class="text-[10px] text-sepia-500 dark:text-gray-400 mt-0.5">{{ $t('dashboard.combinedUsage') }}</p>
        </div>

        <!-- Metrics Grid -->
        <div class="mb-4">
          <!-- Mobile: Vertical Stack -->
          <div class="flex flex-col space-y-2.5 md:hidden">
            <!-- Total Spent -->
            <div class="flex items-baseline justify-between gap-3">
              <p class="text-[10px] text-sepia-500 dark:text-gray-400 flex-shrink-0">{{ $t('dashboard.spent') }}</p>
              <p class="text-sm font-semibold text-right break-all" :class="spentColorClass">
                {{ configStore.formatCurrency(budgetSummary.total_usage) }}
              </p>
            </div>

            <!-- Remaining -->
            <div class="flex items-baseline justify-between gap-3">
              <p class="text-[10px] flex-shrink-0 text-sepia-500 dark:text-gray-400">
                {{ budgetSummary.usage_percent > 100 ? $t('dashboard.over') : $t('dashboard.left') }}
              </p>
              <p class="text-sm font-semibold text-right break-all" :class="remainingColorClass">
                {{ configStore.formatCurrency(budgetSummary.remaining) }}
              </p>
            </div>

            <!-- Budget Limit -->
            <div class="flex items-baseline justify-between gap-3">
              <p class="text-[10px] text-sepia-500 dark:text-gray-400 flex-shrink-0">{{ $t('dashboard.limit') }}</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white text-right break-all">
                {{ configStore.formatCurrency(budgetSummary.total_limit) }}
              </p>
            </div>
          </div>

          <!-- Desktop: 3 Columns -->
          <div class="hidden md:grid md:grid-cols-3 gap-3">
            <!-- Total Limit -->
            <div class="text-center">
              <p class="text-[9px] text-sepia-500 dark:text-gray-400 mb-1">{{ $t('dashboard.limit') }}</p>
              <p class="text-xs font-semibold text-gray-900 dark:text-white">
                {{ configStore.formatCurrency(budgetSummary.total_limit) }}
              </p>
            </div>

            <!-- Total Spent -->
            <div class="text-center">
              <p class="text-[9px] text-sepia-500 dark:text-gray-400 mb-1">{{ $t('dashboard.spent') }}</p>
              <p class="text-xs font-semibold" :class="spentColorClass">
                {{ configStore.formatCurrency(budgetSummary.total_usage) }}
              </p>
            </div>

            <!-- Remaining -->
            <div class="text-center">
              <p class="text-[9px] text-sepia-500 dark:text-gray-400 mb-1">
                {{ budgetSummary.usage_percent > 100 ? $t('dashboard.over') : $t('dashboard.left') }}
              </p>
              <p class="text-xs font-semibold" :class="remainingColorClass">
                {{ configStore.formatCurrency(budgetSummary.remaining) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="space-y-1.5">
          <div class="w-full bg-sepia-200 rounded-full h-1 dark:bg-gray-700">
            <div class="h-1 rounded-full transition-all duration-500" :class="progressBarColorClass"
              :style="{ width: `${budgetSummary.usage_percent > 100 ? 100 : budgetSummary.usage_percent}%` }" />
          </div>
          <div class="text-right">
            <span class="text-[10px] font-medium" :class="spentColorClass">
              {{ budgetSummary.usage_percent.toFixed(1) }}% {{ $t('dashboard.used') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Budget List -->
      <div v-if="!overviewOnly" class="card">
        <BudgetCard v-for="budget in budgets" :key="`budgetlist_` + budget.id" class="mb-1 last:mb-0" :budget="budget"
          :simple-view="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted, watch } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useBudgetsStore } from '@/stores/budgets';
import BudgetCard from '@/components/budget/BudgetCard.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import {
  ChevronLeft,
  ChevronRight,
  LucideArrowUpRightFromSquare,
  Target
} from 'lucide-vue-next';
import { format, endOfDay, parseISO } from 'date-fns';

interface Props {
  overviewOnly?: boolean;
  startDate?: string;
  endDate?: string;
}

const props = withDefaults(defineProps<Props>(), {
  overviewOnly: false,
  startDate: '',
  endDate: ''
});

const configStore = useConfigStore();
const budgetsStore = useBudgetsStore();

const activeBudgetDate = reactive({
  start: '',
  end: ''
});

const activeBudgetPeriod = computed(() => {
  if (activeBudgetDate.start && activeBudgetDate.end) {
    return `${format(endOfDay(activeBudgetDate.start), 'E, dd MMM')} - ${format(endOfDay(activeBudgetDate.end), 'E, dd MMM')}`;
  }
  return 'No Date';
});

const budgets = computed(() => {
  return budgetsStore.budgets
    .slice()
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
});

const budgetSummary = computed(() => {
  const total_limit = budgets.value.reduce((sum, budget) => sum + (Number(budget.limit_amount || 0)), 0);
  const total_usage = budgets.value.reduce((sum, budget) => sum + (budget.total_spent || 0), 0);
  const usage_percent = total_limit > 0 ? (total_usage / total_limit) * 100 : 0;
  const remaining = Math.abs(total_limit - total_usage);
  return {
    total_limit,
    total_usage,
    usage_percent,
    remaining,
  };
});

const spentColorClass = computed(() => ({
  'text-blue-600 dark:text-blue-400': budgetSummary.value.usage_percent <= 50,
  'text-success-600 dark:text-success-400': budgetSummary.value.usage_percent > 50 && budgetSummary.value.usage_percent <= 75,
  'text-warning-600 dark:text-warning-400': budgetSummary.value.usage_percent > 75 && budgetSummary.value.usage_percent <= 90,
  'text-error-600 dark:text-error-400': budgetSummary.value.usage_percent > 90 && budgetSummary.value.usage_percent <= 100,
  'text-red-700 dark:text-red-500': budgetSummary.value.usage_percent > 100
}));

const remainingColorClass = computed(() => ({
  'text-success-600 dark:text-success-400': budgetSummary.value.usage_percent <= 100,
  'text-error-500': budgetSummary.value.usage_percent > 100
}));

const progressBarColorClass = computed(() => ({
  'bg-blue-500': budgetSummary.value.usage_percent <= 50,
  'bg-success-500': budgetSummary.value.usage_percent > 50 && budgetSummary.value.usage_percent <= 75,
  'bg-warning-500': budgetSummary.value.usage_percent > 75 && budgetSummary.value.usage_percent <= 90,
  'bg-error-500': budgetSummary.value.usage_percent > 90 && budgetSummary.value.usage_percent <= 100,
  'bg-red-700': budgetSummary.value.usage_percent > 100
}));

const navigateBudgetDate = (flow: 'next' | 'previous') => {
  const firstDay = configStore.firstDayOfMonth;
  const start = parseISO(activeBudgetDate.start);

  if (flow === 'next') {
    const newStartBudget = new Date(start);
    newStartBudget.setMonth(newStartBudget.getMonth() + 1);
    newStartBudget.setDate(firstDay);
    const newEndBudget = new Date(newStartBudget);
    newEndBudget.setMonth(newEndBudget.getMonth() + 1);
    newEndBudget.setDate(firstDay - 1);
    activeBudgetDate.start = format(newStartBudget, 'yyyy-MM-dd');
    activeBudgetDate.end = format(newEndBudget, 'yyyy-MM-dd');
  } else {
    const newStartBudget = new Date(start);
    newStartBudget.setMonth(newStartBudget.getMonth() - 1);
    newStartBudget.setDate(firstDay);
    const newEndBudget = new Date(newStartBudget);
    newEndBudget.setMonth(newEndBudget.getMonth() + 1);
    newEndBudget.setDate(firstDay - 1);
    activeBudgetDate.start = format(newStartBudget, 'yyyy-MM-dd');
    activeBudgetDate.end = format(newEndBudget, 'yyyy-MM-dd');
  }

  fetchBudgets(activeBudgetDate.start, activeBudgetDate.end);
};

const fetchBudgets = (startDate?: string, endDate?: string) => {
  budgetsStore.fetchBudgets(startDate, endDate);
};

// Watch for external date changes (when using custom period)
watch([() => props.startDate, () => props.endDate], ([newStart, newEnd]) => {
  if (props.overviewOnly && newStart && newEnd) {
    activeBudgetDate.start = newStart;
    activeBudgetDate.end = newEnd;
    fetchBudgets(newStart, newEnd);
  }
}, { immediate: true });

function setInitialBudgetActiveDate() {
  const today = new Date();
  const firstDay = configStore.firstDayOfMonth;

  let startDate = new Date(today.getFullYear(), today.getMonth(), firstDay);

  if (today.getDate() < firstDay) {
    startDate.setMonth(startDate.getMonth() - 1);
  }

  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);
  endDate.setDate(firstDay - 1);

  activeBudgetDate.start = format(startDate, 'yyyy-MM-dd');
  activeBudgetDate.end = format(endDate, 'yyyy-MM-dd');

  fetchBudgets(activeBudgetDate.start, activeBudgetDate.end);
}

onMounted(() => {
  // Only initialize dates if not using external dates (overviewOnly with custom period)
  if (!props.overviewOnly || (!props.startDate && !props.endDate)) {
    setInitialBudgetActiveDate();
  }
});
</script>

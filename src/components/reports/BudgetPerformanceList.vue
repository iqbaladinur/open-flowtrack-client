<template>
  <div class="space-y-2">
    <div v-if="sortedBudgets.length === 0" class="text-center py-8 text-sepia-500 dark:text-gray-400">
      <Target class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>{{ $t('reports.noBudgetsInPeriod') }}</p>
    </div>
    <div v-else class="card">
      <BudgetCard
        v-for="budget in sortedBudgets"
        :key="budget.id"
        :budget="budget"
        :simple-view="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { Budget } from '@/types/budget';
import BudgetCard from '@/components/budget/BudgetCard.vue';
import { Target } from 'lucide-vue-next';

const props = defineProps({
  budgets: {
    type: Array as PropType<Budget[]>,
    required: true,
  },
  formatCurrency: {
    type: Function as PropType<(value: number) => string>,
    required: true,
  },
  sortBy: {
    type: String as PropType<'name' | 'usage' | 'spent' | 'remaining'>,
    default: 'usage',
  },
});

const getUsagePercentage = (budget: Budget) => {
  const limit = Number(budget.limit_amount) || 0;
  if (limit === 0) return 100;
  return ((Number(budget.total_spent) || 0) / limit) * 100;
};

const getRemainingAmount = (budget: Budget) => {
  const limit = Number(budget.limit_amount) || 0;
  const spent = Number(budget.total_spent) || 0;
  return Math.abs(limit - spent);
};

const sortedBudgets = computed(() => {
  const budgets = [...props.budgets];

  switch (props.sortBy) {
    case 'name':
      return budgets.sort((a, b) => a.name.localeCompare(b.name));
    case 'usage':
      return budgets.sort((a, b) => getUsagePercentage(b) - getUsagePercentage(a));
    case 'spent':
      return budgets.sort((a, b) => (Number(b.total_spent) || 0) - (Number(a.total_spent) || 0));
    case 'remaining':
      return budgets.sort((a, b) => getRemainingAmount(a) - getRemainingAmount(b));
    default:
      return budgets;
  }
});
</script>

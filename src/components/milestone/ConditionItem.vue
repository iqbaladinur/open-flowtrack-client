<template>
  <div
    class="p-3 rounded-lg border transition-all"
    :class="[
      condition.is_met
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
    ]"
  >
    <div class="flex items-start gap-2">
      <!-- Status Icon -->
      <div class="flex-shrink-0 mt-0.5">
        <CheckCircle2
          v-if="condition.is_met"
          class="w-4 h-4 text-green-600 dark:text-green-400"
        />
        <Circle v-else class="w-4 h-4 text-gray-400" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Condition Type Label -->
        <div class="flex items-center gap-1.5 mb-1">
          <component :is="getConditionIcon(condition.type)" class="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          <span class="text-xs font-medium text-gray-900 dark:text-white">
            {{ getConditionLabel(condition.type) }}
          </span>
          <!-- Expand/Collapse Button -->
          <button
            v-if="conditionExplanation"
            @click="showExplanation = !showExplanation"
            class="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            type="button"
          >
            <ChevronDown
              class="w-3 h-3 transition-transform duration-200"
              :class="{ 'rotate-180': showExplanation }"
            />
          </button>
        </div>

        <!-- Explanation (Collapsible) -->
        <div
          v-if="conditionExplanation && showExplanation"
          class="text-[10px] text-gray-500 dark:text-gray-400 mb-2 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          {{ conditionExplanation }}
        </div>

        <!-- Progress Bar (if not boolean) -->
        <div v-if="typeof condition.current_value === 'number'" class="mb-2">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] text-gray-600 dark:text-gray-400">
              {{ formatConditionValue(condition.current_value, condition.type) }}
            </span>
            <span class="text-[10px] font-semibold" :style="{ color: getProgressColor(condition.progress_percentage) }">
              {{ condition.progress_percentage.toFixed(0) }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
            <div
              class="h-1 rounded-full transition-all duration-500"
              :style="{
                width: `${Math.min(condition.progress_percentage, 100)}%`,
                backgroundColor: getProgressColor(condition.progress_percentage),
              }"
            />
          </div>
        </div>

        <!-- Value Display -->
        <div class="flex items-center justify-between text-[10px]">
          <span class="text-gray-500 dark:text-gray-400">Target</span>
          <span class="font-semibold text-gray-900 dark:text-white">
            {{ formatConditionValue(condition.target_value, condition.type) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ConditionWithProgress } from '@/types/milestone';
import {
  getConditionLabel,
  formatConditionValue,
  getProgressColor,
  getOperatorSymbol,
} from '@/utils/milestoneHelpers';
import {
  Wallet,
  ShieldCheck,
  Banknote,
  Calendar,
  TrendingUp,
  Tag,
  CheckCircle2,
  Circle,
  ChevronDown,
} from 'lucide-vue-next';

interface Props {
  condition: ConditionWithProgress;
  showDetails?: boolean;
}

const props = defineProps<Props>();

// State
const showExplanation = ref(false);

// Helper to format custom date
const formatCustomDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
};

// Generate explanation based on condition type and config
const conditionExplanation = computed(() => {
  const config = props.condition.config as any;

  switch (props.condition.type) {
    case 'wallet_balance':
      if (config.wallet_id) {
        return `Wallet balance ${getOperatorSymbol(config.operator)} target`;
      }
      return `Total balance from all wallets ${getOperatorSymbol(config.operator)} target`;

    case 'budget_control':
      const months = config.consecutive_months || 1;
      return `Budget must not overspend for ${months} consecutive month${months > 1 ? 's' : ''}`;

    case 'transaction_amount':
      const txType = config.transaction_type === 'income' ? 'income' : 'expense';
      if (config.category_id) {
        return `Get ${txType} transaction ${getOperatorSymbol(config.operator)} target from specific category`;
      }
      return `Get ${txType} transaction ${getOperatorSymbol(config.operator)} target`;

    case 'period_total':
      const periodType = config.transaction_type === 'income' ? 'income' : 'expense';
      let period = '';
      if (config.period === 'month') {
        period = 'this month';
      } else if (config.period === 'quarter') {
        period = 'this quarter';
      } else if (config.period === 'year') {
        period = 'this year';
      } else if (config.period === 'custom' && config.start_date && config.end_date) {
        period = `custom period (${formatCustomDate(config.start_date)} - ${formatCustomDate(config.end_date)})`;
      } else {
        period = 'custom period';
      }
      return `Total ${periodType} in ${period} ${getOperatorSymbol(config.operator)} target`;

    case 'net_worth':
      return `Total net worth (assets - liabilities) ${getOperatorSymbol(config.operator)} target`;

    case 'category_spending':
      let catPeriod = '';
      if (config.period === 'month') {
        catPeriod = 'this month';
      } else if (config.period === 'quarter') {
        catPeriod = 'this quarter';
      } else if (config.period === 'year') {
        catPeriod = 'this year';
      } else if (config.period === 'custom' && config.start_date && config.end_date) {
        catPeriod = `custom period (${formatCustomDate(config.start_date)} - ${formatCustomDate(config.end_date)})`;
      } else {
        catPeriod = 'custom period';
      }
      return `Spending in specific category for ${catPeriod} ${getOperatorSymbol(config.operator)} limit`;

    default:
      return '';
  }
});

// Icon mapping
const conditionIconMap: Record<string, any> = {
  wallet_balance: Wallet,
  budget_control: ShieldCheck,
  transaction_amount: Banknote,
  period_total: Calendar,
  net_worth: TrendingUp,
  category_spending: Tag,
};

const getConditionIcon = (type: string) => {
  return conditionIconMap[type] || Circle;
};
</script>

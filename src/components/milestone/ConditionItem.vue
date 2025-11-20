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
              {{ configStore.formatProsentase(condition.progress_percentage) }}
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
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ConditionWithProgress } from '@/types/milestone';
import type { Wallet } from '@/types/wallet';
import type { Category } from '@/types/category';
import type { Budget } from '@/types/budget';
import {
  getConditionLabel,
  formatConditionValue,
  getProgressColor,
  getOperatorSymbol,
} from '@/utils/milestoneHelpers';
import {
  Wallet as WalletIcon,
  ShieldCheck,
  Banknote,
  Calendar,
  TrendingUp,
  Tag,
  CheckCircle2,
  Circle,
  ChevronDown,
} from 'lucide-vue-next';
import { useConfigStore } from '@/stores/config';
import { useWalletsStore } from '@/stores/wallets';
import { useCategoriesStore } from '@/stores/categories';
import { useBudgetsStore } from '@/stores/budgets';

interface Props {
  condition: ConditionWithProgress;
  showDetails?: boolean;
}

const props = defineProps<Props>();
const { t } = useI18n();
const configStore = useConfigStore();
const walletsStore = useWalletsStore();
const categoriesStore = useCategoriesStore();
const budgetsStore = useBudgetsStore();

// State
const showExplanation = ref(false);
const walletData = ref<Wallet | null | undefined>(null);
const categoryData = ref<Category | null | undefined>(null);
const budgetData = ref<Budget | null | undefined>(null);

// Helper to format custom date
const formatCustomDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
};

// Fetch related data (wallet/category/budget) from server if not in local cache
const fetchRelatedData = async () => {
  const config = props.condition.config as any;

  // Fetch wallet data if needed
  if (config.wallet_id) {
    try {
      walletData.value = await walletsStore.getWalletByIdFromServer(config.wallet_id);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
      walletData.value = undefined;
    }
  }

  // Fetch category data if needed
  if (config.category_id) {
    try {
      categoryData.value = await categoriesStore.getCategoryByIdFromServer(config.category_id);
    } catch (error) {
      console.error('Failed to fetch category:', error);
      categoryData.value = undefined;
    }
  }

  // Fetch budget data if needed
  if (config.budget_id) {
    try {
      budgetData.value = await budgetsStore.getBudgetById(config.budget_id);
    } catch (error) {
      console.error('Failed to fetch budget:', error);
      budgetData.value = undefined;
    }
  }
};

// Generate explanation based on condition type and config
const conditionExplanation = computed(() => {
  const config = props.condition.config as any;
  const targetValue = props.condition.target_value;
  const formattedTarget = typeof targetValue === 'number' ? configStore.formatCurrency(targetValue) : targetValue;
  const operator = getOperatorSymbol(config.operator);

  switch (props.condition.type) {
    case 'wallet_balance':
      if (config.wallet_id) {
        // Use fetched wallet data, fallback to local, then unknown
        const walletName = walletData.value?.name ||
                          walletsStore.getWalletById(config.wallet_id)?.name ||
                          t('milestones.unknownWallet');
        return t('milestones.conditionExplanations.walletBalanceSpecific', {
          wallet: walletName,
          operator,
          target: formattedTarget
        });
      }
      return t('milestones.conditionExplanations.walletBalanceAll', {
        operator,
        target: formattedTarget
      });

    case 'budget_control':
      const months = config.consecutive_months || 1;
      // Check if there's a specific budget_id
      if (config.budget_id && budgetData.value) {
        // Budget has name and categories
        const budgetName = budgetData.value.name;
        if (budgetName) {
          return t('milestones.conditionExplanations.budgetControlSpecific', {
            months,
            budget: budgetName
          });
        }
      }
      return t('milestones.conditionExplanations.budgetControl', { months });

    case 'transaction_amount':
      const txType = config.transaction_type === 'income' ? t('common.income') : t('common.expense');
      if (config.category_id) {
        // Use fetched category data, fallback to local, then unknown
        const categoryName = categoryData.value?.name ||
                            categoriesStore.getCategoryById(config.category_id)?.name ||
                            t('milestones.unknownCategory');
        return t('milestones.conditionExplanations.transactionAmountCategory', {
          type: txType,
          operator,
          target: formattedTarget,
          category: categoryName
        });
      }
      return t('milestones.conditionExplanations.transactionAmount', {
        type: txType,
        operator,
        target: formattedTarget
      });

    case 'period_total':
      const periodType = config.transaction_type === 'income' ? t('common.income') : t('common.expense');
      let period = '';
      if (config.period === 'month') {
        period = t('milestones.periods.thisMonth');
      } else if (config.period === 'quarter') {
        period = t('milestones.periods.thisQuarter');
      } else if (config.period === 'year') {
        period = t('milestones.periods.thisYear');
      } else if (config.period === 'custom' && config.start_date && config.end_date) {
        period = `${formatCustomDate(config.start_date)} - ${formatCustomDate(config.end_date)}`;
      } else {
        period = t('milestones.periods.custom');
      }
      return t('milestones.conditionExplanations.periodTotal', {
        type: periodType,
        period,
        operator,
        target: formattedTarget
      });

    case 'net_worth':
      return t('milestones.conditionExplanations.netWorth', {
        operator,
        target: formattedTarget
      });

    case 'category_spending':
      // Use fetched category data, fallback to local, then unknown
      const categoryName = categoryData.value?.name ||
                          (config.category_id ? categoriesStore.getCategoryById(config.category_id)?.name : null) ||
                          t('milestones.unknownCategory');

      let catPeriod = '';
      if (config.period === 'month') {
        catPeriod = t('milestones.periods.thisMonth');
      } else if (config.period === 'quarter') {
        catPeriod = t('milestones.periods.thisQuarter');
      } else if (config.period === 'year') {
        catPeriod = t('milestones.periods.thisYear');
      } else if (config.period === 'custom' && config.start_date && config.end_date) {
        catPeriod = `${formatCustomDate(config.start_date)} - ${formatCustomDate(config.end_date)}`;
      } else {
        catPeriod = t('milestones.periods.custom');
      }
      return t('milestones.conditionExplanations.categorySpending', {
        category: categoryName,
        period: catPeriod,
        operator,
        target: formattedTarget
      });

    default:
      return '';
  }
});

// Icon mapping
const conditionIconMap: Record<string, any> = {
  wallet_balance: WalletIcon,
  budget_control: ShieldCheck,
  transaction_amount: Banknote,
  period_total: Calendar,
  net_worth: TrendingUp,
  category_spending: Tag,
};

const getConditionIcon = (type: string) => {
  return conditionIconMap[type] || Circle;
};

// Lifecycle: Fetch related data on mount
onMounted(() => {
  fetchRelatedData();
});

// Watch for condition changes and refetch data
watch(
  () => props.condition,
  () => {
    fetchRelatedData();
  },
  { deep: true }
);
</script>

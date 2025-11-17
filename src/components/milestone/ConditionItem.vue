<template>
  <div
    class="p-4 rounded-lg border transition-all"
    :class="[
      condition.is_met
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    ]"
  >
    <div class="flex items-start gap-3">
      <!-- Status Icon -->
      <div class="flex-shrink-0 mt-1">
        <CheckCircle2
          v-if="condition.is_met"
          class="w-5 h-5 text-green-600 dark:text-green-400"
        />
        <Circle v-else class="w-5 h-5 text-gray-400" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Condition Type Label -->
        <div class="flex items-center gap-2 mb-2">
          <component :is="getConditionIcon(condition.type)" class="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            {{ getConditionLabel(condition.type) }}
          </span>
        </div>

        <!-- Progress Bar (if not boolean) -->
        <div v-if="typeof condition.current_value === 'number'" class="mb-3">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs text-gray-600 dark:text-gray-400">
              {{ formatConditionValue(condition.current_value, condition.type) }}
            </span>
            <span class="text-xs font-semibold" :style="{ color: getProgressColor(condition.progress_percentage) }">
              {{ condition.progress_percentage.toFixed(1) }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div
              class="h-1.5 rounded-full transition-all duration-500"
              :style="{
                width: `${Math.min(condition.progress_percentage, 100)}%`,
                backgroundColor: getProgressColor(condition.progress_percentage),
              }"
            />
          </div>
        </div>

        <!-- Value Display -->
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Target:</span>
          <span class="font-semibold text-gray-900 dark:text-white">
            {{ formatConditionValue(condition.target_value, condition.type) }}
          </span>
        </div>

        <!-- Config Details (optional, collapsed by default) -->
        <div v-if="showDetails" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div class="text-xs space-y-1 text-gray-600 dark:text-gray-400">
            <!-- Wallet Balance Details -->
            <template v-if="condition.type === 'wallet_balance'">
              <div v-if="walletBalanceConfig">
                <span>Wallet: {{ walletBalanceConfig.wallet_id || 'All Wallets' }}</span>
              </div>
            </template>

            <!-- Budget Control Details -->
            <template v-if="condition.type === 'budget_control'">
              <div v-if="budgetControlConfig">
                <span>Condition: {{ budgetControlConfig.condition }}</span>
                <span v-if="budgetControlConfig.consecutive_months">
                  ({{ budgetControlConfig.consecutive_months }} months)
                </span>
              </div>
            </template>

            <!-- Transaction Amount Details -->
            <template v-if="condition.type === 'transaction_amount'">
              <div v-if="transactionAmountConfig">
                <span>Type: {{ transactionAmountConfig.transaction_type }}</span>
              </div>
            </template>

            <!-- Period Total Details -->
            <template v-if="condition.type === 'period_total'">
              <div v-if="periodTotalConfig">
                <span>Period: {{ periodTotalConfig.period }}</span>
                <span> | Type: {{ periodTotalConfig.transaction_type }}</span>
              </div>
            </template>

            <!-- Category Spending Details -->
            <template v-if="condition.type === 'category_spending'">
              <div v-if="categorySpendingConfig">
                <span>Period: {{ categorySpendingConfig.period }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type {
  ConditionWithProgress,
  WalletBalanceConfig,
  BudgetControlConfig,
  TransactionAmountConfig,
  PeriodTotalConfig,
  CategorySpendingConfig,
} from '@/types/milestone';
import {
  getConditionLabel,
  formatConditionValue,
  getProgressColor,
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
} from 'lucide-vue-next';

interface Props {
  condition: ConditionWithProgress;
  showDetails?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false,
});

// Config type guards and computed properties
const walletBalanceConfig = computed(() =>
  props.condition.type === 'wallet_balance' ? props.condition.config as WalletBalanceConfig : null
);

const budgetControlConfig = computed(() =>
  props.condition.type === 'budget_control' ? props.condition.config as BudgetControlConfig : null
);

const transactionAmountConfig = computed(() =>
  props.condition.type === 'transaction_amount' ? props.condition.config as TransactionAmountConfig : null
);

const periodTotalConfig = computed(() =>
  props.condition.type === 'period_total' ? props.condition.config as PeriodTotalConfig : null
);

const categorySpendingConfig = computed(() =>
  props.condition.type === 'category_spending' ? props.condition.config as CategorySpendingConfig : null
);

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

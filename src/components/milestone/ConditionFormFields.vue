<template>
  <div class="space-y-3">
    <!-- Wallet Balance Fields -->
    <template v-if="conditionType === 'wallet_balance'">
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          {{ $t('milestones.conditionFields.wallet') }}
        </label>
        <select
          v-model="localConfig.wallet_id"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option :value="null">{{ $t('milestones.conditionFields.allWallets') }}</option>
          <option v-for="wallet in walletOptions" :key="wallet.id" :value="wallet.id">
            {{ wallet.name }} {{ wallet.hidden ? $t('milestones.conditionFields.hidden') : '' }}
          </option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.operator') }}</label>
          <select
            v-model="localConfig.operator"
            required
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value=">=">&gt;=</option>
            <option value=">">&gt;</option>
            <option value="<=">&lt;=</option>
            <option value="<">&lt;</option>
            <option value="=">=</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.targetAmount') }}</label>
          <input
            v-model.number="localConfig.target_amount"
            type="number"
            min="0"
            required
            placeholder="e.g., 30000000"
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </template>

    <!-- Budget Control Fields -->
    <template v-if="conditionType === 'budget_control'">
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.budget') }}</label>
        <select
          v-model="localConfig.budget_id"
          required
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">{{ $t('milestones.conditionFields.selectBudget') }}</option>
          <option v-for="budget in budgetOptions" :key="budget.id" :value="budget.id">
            {{ budget.name }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.condition') }}</label>
        <select
          v-model="localConfig.condition"
          required
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="no_overspend">{{ $t('milestones.conditionFields.noOverspend') }}</option>
          <option value="under_percentage">{{ $t('milestones.conditionFields.underPercentage') }}</option>
        </select>
      </div>
      <div v-if="localConfig.condition === 'under_percentage'">
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.percentage') }}</label>
        <input
          v-model.number="localConfig.percentage"
          type="number"
          min="1"
          max="100"
          required
          placeholder="e.g., 80"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.consecutiveMonths') }}</label>
        <input
          v-model.number="localConfig.consecutive_months"
          type="number"
          min="1"
          max="12"
          placeholder="e.g., 3"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>
    </template>

    <!-- Transaction Amount Fields -->
    <template v-if="conditionType === 'transaction_amount'">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.transactionType') }}</label>
          <select
            v-model="localConfig.transaction_type"
            required
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="income">{{ $t('milestones.conditionFields.income') }}</option>
            <option value="expense">{{ $t('milestones.conditionFields.expense') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.operator') }}</label>
          <select
            v-model="localConfig.operator"
            required
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value=">=">&gt;=</option>
            <option value=">">&gt;</option>
            <option value="<=">&lt;=</option>
            <option value="<">&lt;</option>
            <option value="=">=</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.amount') }}</label>
        <input
          v-model.number="localConfig.amount"
          type="number"
          min="0"
          required
          placeholder="e.g., 20000000"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.categoryOptional') }}</label>
        <select
          v-model="localConfig.category_id"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">{{ $t('milestones.conditionFields.anyCategory') }}</option>
          <option
            v-for="category in localConfig.transaction_type === 'income' ? incomeCategoryOptions : expenseCategoryOptions"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </template>

    <!-- Period Total Fields -->
    <template v-if="conditionType === 'period_total'">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.transactionType') }}</label>
          <select
            v-model="localConfig.transaction_type"
            required
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="income">{{ $t('milestones.conditionFields.income') }}</option>
            <option value="expense">{{ $t('milestones.conditionFields.expense') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.operator') }}</label>
          <select
            v-model="localConfig.operator"
            required
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value=">=">&gt;=</option>
            <option value=">">&gt;</option>
            <option value="<=">&lt;=</option>
            <option value="<">&lt;</option>
            <option value="=">=</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.amount') }}</label>
        <input
          v-model.number="localConfig.amount"
          type="number"
          min="0"
          required
          placeholder="e.g., 150000000"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.period') }}</label>
        <select
          v-model="localConfig.period"
          required
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="month">{{ $t('milestones.periods.thisMonth') }}</option>
          <option value="quarter">{{ $t('milestones.periods.thisQuarter') }}</option>
          <option value="year">{{ $t('milestones.periods.thisYear') }}</option>
          <option value="custom">{{ $t('milestones.periods.custom') }}</option>
        </select>
      </div>
      <div v-if="localConfig.period === 'custom'" class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.startDate') }}</label>
          <input
            v-model="localConfig.start_date"
            type="date"
            required
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.endDate') }}</label>
          <input
            v-model="localConfig.end_date"
            type="date"
            required
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.categoryOptional') }}</label>
        <select
          v-model="localConfig.category_id"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">{{ $t('milestones.conditionFields.anyCategory') }}</option>
          <option
            v-for="category in localConfig.transaction_type === 'income' ? incomeCategoryOptions : expenseCategoryOptions"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </template>

    <!-- Net Worth Fields -->
    <template v-if="conditionType === 'net_worth'">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.operator') }}</label>
          <select
            v-model="localConfig.operator"
            required
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value=">=">&gt;=</option>
            <option value=">">&gt;</option>
            <option value="<=">&lt;=</option>
            <option value="<">&lt;</option>
            <option value="=">=</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.targetAmount') }}</label>
          <input
            v-model.number="localConfig.target_amount"
            type="number"
            min="0"
            required
            placeholder="e.g., 500000000"
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      <div>
        <label class="flex items-center gap-2">
          <input
            v-model="localConfig.include_hidden_wallets"
            type="checkbox"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
            {{ $t('milestones.conditionFields.includeHiddenWallets') }}
          </span>
        </label>
      </div>
    </template>

    <!-- Category Spending Fields -->
    <template v-if="conditionType === 'category_spending'">
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.category') }}</label>
        <select
          v-model="localConfig.category_id"
          required
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">{{ $t('milestones.conditionFields.selectCategory') }}</option>
          <option v-for="category in expenseCategoryOptions" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.operator') }}</label>
          <select
            v-model="localConfig.operator"
            required
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value=">=">&gt;=</option>
            <option value=">">&gt;</option>
            <option value="<=">&lt;=</option>
            <option value="<">&lt;</option>
            <option value="=">=</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.amount') }}</label>
          <input
            v-model.number="localConfig.amount"
            type="number"
            min="0"
            required
            placeholder="e.g., 3000000"
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('milestones.conditionFields.period') }}</label>
        <select
          v-model="localConfig.period"
          required
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="month">{{ $t('milestones.periods.thisMonth') }}</option>
          <option value="quarter">{{ $t('milestones.periods.thisQuarter') }}</option>
          <option value="year">{{ $t('milestones.periods.thisYear') }}</option>
        </select>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import type { ConditionType, ConditionConfig } from '@/types/milestone';
import { useWalletsStore } from '@/stores/wallets';
import { useBudgetsStore } from '@/stores/budgets';
import { useCategoriesStore } from '@/stores/categories';

interface Props {
  modelValue: Partial<ConditionConfig>;
  conditionType: ConditionType;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: Partial<ConditionConfig>];
}>();

// Stores
const walletsStore = useWalletsStore();
const budgetsStore = useBudgetsStore();
const categoriesStore = useCategoriesStore();

const localConfig = ref<any>({ ...(props.modelValue || {}) });

// Computed lists for dropdowns
const walletOptions = computed(() => {
  return walletsStore.wallets.map(w => ({
    id: w.id,
    name: w.name,
    hidden: w.hidden
  }));
});

const budgetOptions = computed(() => {
  return budgetsStore.budgets.map(b => ({
    id: b.id,
    name: b.name,
    amount: b.limit_amount
  }));
});

const expenseCategoryOptions = computed(() => {
  return categoriesStore.categories
    .filter(c => c.type === 'expense')
    .map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon
    }));
});

const incomeCategoryOptions = computed(() => {
  return categoriesStore.categories
    .filter(c => c.type === 'income')
    .map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon
    }));
});

// Fetch data on mount
onMounted(async () => {
  await walletsStore.fetchWallets();
  await budgetsStore.fetchBudgets();
  await categoriesStore.fetchCategories();
});

// Watch for changes and emit (with check to prevent loop)
watch(
  localConfig,
  (newValue) => {
    // Only emit if values actually changed
    const currentProps = JSON.stringify(props.modelValue);
    const newLocal = JSON.stringify(newValue);
    if (currentProps !== newLocal) {
      emit('update:modelValue', newValue);
    }
  },
  { deep: true }
);

// Watch for external changes (parent updating props)
watch(
  () => props.modelValue,
  (newValue) => {
    // Only update local if different from current
    const newProps = JSON.stringify(newValue);
    const currentLocal = JSON.stringify(localConfig.value);
    if (newProps !== currentLocal && newValue) {
      localConfig.value = { ...newValue };
    }
  },
  { deep: true }
);
</script>

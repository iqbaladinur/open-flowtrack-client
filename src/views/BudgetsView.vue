<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Budgets</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Set spending limits and track your progress
          </p>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          Create Budget
        </button>
      </div>

      <!-- Budget Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                ${{ formatCurrency(totalBudget) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <Target class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent</p>
              <p class="text-2xl font-bold text-error-600">
                ${{ formatCurrency(totalSpent) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-error-100 dark:bg-error-900 rounded-lg flex items-center justify-center">
              <TrendingDown class="w-6 h-6 text-error-600 dark:text-error-400" />
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining</p>
              <p 
                class="text-2xl font-bold"
                :class="remaining >= 0 ? 'text-success-600' : 'text-error-600'"
              >
                ${{ formatCurrency(Math.abs(remaining)) }}
              </p>
            </div>
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :class="remaining >= 0 
                ? 'bg-success-100 dark:bg-success-900' 
                : 'bg-error-100 dark:bg-error-900'"
            >
              <component
                :is="remaining >= 0 ? CheckCircle : AlertCircle"
                class="w-6 h-6"
                :class="remaining >= 0 
                  ? 'text-success-600 dark:text-success-400' 
                  : 'text-error-600 dark:text-error-400'"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Budgets List -->
      <div v-if="budgetsStore.loading" class="card p-8">
        <LoadingSpinner fullHeight />
      </div>

      <div v-else-if="budgets.length === 0" class="card p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No budgets yet</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Create your first budget to start tracking your spending
        </p>
        <button @click="showAddModal = true" class="btn-primary">
          <Target class="w-4 h-4 mr-2" />
          Create Budget
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="budget in budgets"
          :key="budget.id"
          class="card p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :style="{ backgroundColor: budget.category?.color + '20', color: budget.category?.color }"
              >
                <Target class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ budget.category?.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getMonthName(budget.month) }} {{ budget.year }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                @click="editBudget(budget)"
                class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Edit2 class="w-4 h-4" />
              </button>
              <button
                @click="deleteBudget(budget.id)"
                class="p-1 text-gray-400 hover:text-error-600 dark:hover:text-error-400"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress</span>
              <span>{{ Math.round(getBudgetProgress(budget)) }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :class="getBudgetProgress(budget) > 100 
                  ? 'bg-error-500' 
                  : getBudgetProgress(budget) > 80 
                    ? 'bg-warning-500' 
                    : 'bg-success-500'"
                :style="{ width: Math.min(getBudgetProgress(budget), 100) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Budget Details -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-gray-500 dark:text-gray-400">Limit</p>
              <p class="font-semibold text-gray-900 dark:text-white">
                ${{ formatCurrency(budget.limit_amount) }}
              </p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Spent</p>
              <p 
                class="font-semibold"
                :class="budget.spent_amount > budget.limit_amount 
                  ? 'text-error-600 dark:text-error-400' 
                  : 'text-gray-900 dark:text-white'"
              >
                ${{ formatCurrency(budget.spent_amount) }}
              </p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Remaining</p>
              <p 
                class="font-semibold"
                :class="budget.limit_amount - budget.spent_amount >= 0 
                  ? 'text-success-600 dark:text-success-400' 
                  : 'text-error-600 dark:text-error-400'"
              >
                ${{ formatCurrency(Math.abs(budget.limit_amount - budget.spent_amount)) }}
                {{ budget.limit_amount - budget.spent_amount < 0 ? ' over' : ' left' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Budget Modal -->
    <BudgetModal
      v-model="showAddModal"
      :budget="selectedBudget"
      @success="handleBudgetSaved"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBudgetsStore } from '@/stores/budgets';
import { useCategoriesStore } from '@/stores/categories';
import AppLayout from '@/components/layouts/AppLayout.vue';
import BudgetModal from '@/components/BudgetModal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import type { Budget } from '@/types';
import {
  Plus,
  Target,
  Edit2,
  Trash2,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from 'lucide-vue-next';

const budgetsStore = useBudgetsStore();
const categoriesStore = useCategoriesStore();

const showAddModal = ref(false);
const selectedBudget = ref<Budget | null>(null);

const budgets = computed(() => {
  return budgetsStore.budgets
    .slice()
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
});

const totalBudget = computed(() => {
  return budgets.value.reduce((sum, budget) => sum + budget.limit_amount, 0);
});

const totalSpent = computed(() => {
  return budgets.value.reduce((sum, budget) => sum + budget.spent_amount, 0);
});

const remaining = computed(() => totalBudget.value - totalSpent.value);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getBudgetProgress = (budget: Budget) => {
  return (budget.spent_amount / budget.limit_amount) * 100;
};

const getMonthName = (month: number) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
};

const editBudget = (budget: Budget) => {
  selectedBudget.value = budget;
  showAddModal.value = true;
};

const deleteBudget = async (id: string) => {
  if (confirm('Are you sure you want to delete this budget?')) {
    const result = await budgetsStore.deleteBudget(id);
    if (!result.success && result.error) {
      alert(result.error);
    }
  }
};

const handleBudgetSaved = () => {
  showAddModal.value = false;
  selectedBudget.value = null;
};

onMounted(async () => {
  await Promise.all([
    budgetsStore.fetchBudgets(),
    categoriesStore.fetchCategories(),
  ]);
});
</script>
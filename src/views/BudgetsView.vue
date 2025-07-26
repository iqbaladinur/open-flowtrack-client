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
        <BudgetCard
          v-for="budget in budgets"
          :key="budget.id"
          :budget="budget"
          @edit="editBudget"
          @delete="deleteBudget"
        />
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
import { ref, computed, onMounted, watch } from 'vue';
import { useBudgetsStore } from '@/stores/budgets';
import AppLayout from '@/components/layouts/AppLayout.vue';
import BudgetModal from '@/components/BudgetModal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import BudgetCard from '@/components/BudgetCard.vue';
import type { Budget } from '@/types';
import {
  Plus,
  Target,
} from 'lucide-vue-next';

const budgetsStore = useBudgetsStore();

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
  budgetsStore.fetchBudgets();
};

watch(showAddModal, (isShowing) => {
  if (!isShowing) {
    selectedBudget.value = null;
  }
});

onMounted(async () => {
  await budgetsStore.fetchBudgets();
});
</script>

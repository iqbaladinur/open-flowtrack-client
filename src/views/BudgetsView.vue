<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-neon">Budgets</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Set spending limits and track your progress
          </p>
        </div>
        <div class="flex items-center flex-wrap gap-2 justify-between">
          <div class="flex items-center gap-3 justify-start">
            <button @click="goToPreviousPeriod" class="flex items-center btn-secondary p-2 rounded-full btn-borderless">
              <ChevronLeft class="size-4" />
            </button>
            <button @click="goToNextPeriod" class="flex items-center btn-secondary p-2 rounded-full btn-borderless">
              <ChevronRight class="size-4" />
            </button>
          </div>
          <div class="flex items-center gap-2">
            <input type="date" v-model="dateRange.start" @change="fetchBudgets" class="input text-xs" />
            <span class="text-gray-500">-</span>
            <input type="date" v-model="dateRange.end" @change="fetchBudgets" class="input text-xs" />
          </div>
          <button @click="showAddModal = true" class="btn-primary hidden sm:flex p-2">
            <Plus class="size-4" />
          </button>
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
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No budgets found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Create your first budget for the selected date range to start tracking your spending.
        </p>
        <button @click="showAddModal = true" class="btn-primary">
          <Target class="w-4 h-4 mr-2" />
          Create Budget
        </button>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 lg:max-w-[400px] lg:mx-auto">
        <BudgetCard
          v-for="budget in budgets"
          :key="budget.id"
          :budget="budget"
          @edit="editBudget"
          @delete="deleteBudget"
        />
      </div>
    </div>

    <!-- Floating Add Button for Mobile -->
    <button @click="showAddModal = true" class="sm:hidden fixed bottom-[70px] right-6 z-[20] btn-primary rounded-full p-4 shadow-lg flex items-center justify-center">
      <Plus class="w-6 h-6" />
      <span class="sr-only">Create Budget</span>
    </button>

    <!-- Add/Edit Budget Modal -->
    <BudgetModal
      v-model="showAddModal"
      :budget="selectedBudget"
      @success="handleBudgetSaved"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue';
import { useBudgetsStore } from '@/stores/budgets';
import AppLayout from '@/components/layouts/AppLayout.vue';
import BudgetModal from '@/components/budget/BudgetModal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import BudgetCard from '@/components/budget/BudgetCard.vue';
import type { Budget } from '@/types/budget';
import { Plus, Target, ChevronRight, ChevronLeft } from 'lucide-vue-next';
import { format, parseISO } from 'date-fns';
import { useConfigStore } from '@/stores/config';

const budgetsStore = useBudgetsStore();
const configStore = useConfigStore();
const showAddModal = ref(false);
const selectedBudget = ref<Budget | null>(null);

const dateRange = reactive({
  start: '',
  end: '',
});

const budgets = computed(() => {
  return budgetsStore.budgets
    .slice()
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
});

const fetchBudgets = () => {
  const startDate = dateRange.start ? new Date(dateRange.start).toISOString() : undefined;
  const endDate = dateRange.end ? new Date(dateRange.end).toISOString() : undefined;
  budgetsStore.fetchBudgets(startDate, endDate);
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
  fetchBudgets();
};

function setInitialDate() {
  const today = new Date();
  const firstDay = configStore.firstDayOfMonth;
  
  let startDate = new Date(today.getFullYear(), today.getMonth(), firstDay);

  // If today's date is before the first day of this calendar month,
  // it means we are still in the previous financial month.
  if (today.getDate() < firstDay) {
    startDate.setMonth(startDate.getMonth() - 1);
  }

  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);
  endDate.setDate(firstDay - 1);

  dateRange.start = format(startDate, 'yyyy-MM-dd');
  dateRange.end = format(endDate, 'yyyy-MM-dd');
}

const navigatePeriod = (direction: 'previous' | 'next') => {
  if (!dateRange.start || !dateRange.end) return;
  
  const firstDay = configStore.firstDayOfMonth;
  const start = parseISO(dateRange.start);
  
  if (direction === 'previous') {
    // Move to previous month's configured date
    const newStart = new Date(start);
    newStart.setMonth(newStart.getMonth() - 1);
    newStart.setDate(firstDay);
    
    // Set end date to day before the configured date
    const newEnd = new Date(newStart);
    newEnd.setMonth(newEnd.getMonth() + 1);
    newEnd.setDate(firstDay - 1);
    
    dateRange.start = format(newStart, 'yyyy-MM-dd');
    dateRange.end = format(newEnd, 'yyyy-MM-dd');
  } else {
    // Move to next month's configured date
    const newStart = new Date(start);
    newStart.setMonth(newStart.getMonth() + 1);
    newStart.setDate(firstDay);
    
    // Set end date to day before the configured date
    const newEnd = new Date(newStart);
    newEnd.setMonth(newEnd.getMonth() + 1);
    newEnd.setDate(firstDay - 1);
    
    dateRange.start = format(newStart, 'yyyy-MM-dd');
    dateRange.end = format(newEnd, 'yyyy-MM-dd');
  }

  fetchBudgets();
}

const goToPreviousPeriod = () => navigatePeriod('previous');
const goToNextPeriod = () => navigatePeriod('next');

watch(showAddModal, (isShowing) => {
  if (!isShowing) {
    selectedBudget.value = null;
  }
});

onMounted(() => {
  setInitialDate();
  fetchBudgets();
});
</script>
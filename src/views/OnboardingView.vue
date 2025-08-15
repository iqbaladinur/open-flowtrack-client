<template>
  <div class="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
    <div class="max-w-4xl w-full">
      <!-- Step 1: Category Selection -->
      <div v-if="step === 1">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-neon">Let's Get You Set Up</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Select the categories you'd like to start with. You can always change this later.</p>
        </div>
        
        <!-- Predefined Categories -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-neon mb-3">Expenses</h2>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 justify-center">
            <div
              v-for="category in predefinedExpenses"
              :key="category.name"
              @click="toggleCategory(category)"
              class="cursor-pointer w-full"
            >
              <CategoryCard :category="category" class="w-full" :class="{ 'ring-2 ring-primary-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950': isSelected(category) }" />
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-neon mb-3">Income</h2>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 justify-center">
            <div
              v-for="category in predefinedIncome"
              :key="category.name"
              @click="toggleCategory(category)"
              class="cursor-pointer w-full"
            >
              <CategoryCard :category="category" class="w-full" :class="{ 'ring-2 ring-primary-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950': isSelected(category) }" />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-10 flex justify-end">
          <button @click="goToNextStep" class="btn-primary py-3 px-6" :disabled="selectedCategories.size === 0">
            Continue
          </button>
        </div>
      </div>

      <!-- Step 2: Settings -->
      <div v-if="step === 2">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-neon">Final Details</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Configure your currency settings.</p>
        </div>
        
        <OnboardingSettings :form="settingsForm" />

        <!-- Actions -->
        <div class="mt-10 flex justify-between items-center">
          <button @click="step = 1" class="btn-secondary py-3 px-6">Back</button>
          <button @click="finishOnboarding" class="btn-primary py-3 px-6" :disabled="loading">
            <LoadingSpinner v-if="loading" size="sm" />
            <span v-else>Finish Setup</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoriesStore } from '@/stores/categories';
import { useConfigStore } from '@/stores/config';
import type { Category } from '@/types/category';
import CategoryCard from '@/components/category/CategoryCard.vue';
import OnboardingSettings from '@/components/onboarding/OnboardingSettings.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

const router = useRouter();
const categoriesStore = useCategoriesStore();
const configStore = useConfigStore();

const step = ref(1);
const loading = ref(false);

// --- Step 1: Category Selection ---
const predefinedExpenses: Omit<Category, 'id' | 'created_at' | 'user_id' | 'is_default'>[] = [
  { name: 'Food', type: 'expense', icon: 'UtensilsCrossed', color: '#f97316' },
  { name: 'Transport', type: 'expense', icon: 'Car', color: '#3b82f6' },
  { name: 'Housing', type: 'expense', icon: 'Home', color: '#8b5cf6' },
  { name: 'Bills', type: 'expense', icon: 'Receipt', color: '#ef4444' },
  { name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#ec4899' },
];

const predefinedIncome: Omit<Category, 'id' | 'created_at' | 'user_id' | 'is_default'>[] = [
  { name: 'Salary', type: 'income', icon: 'Briefcase', color: '#10b981' },
  { name: 'Freelance', type: 'income', icon: 'Laptop', color: '#06b6d4' },
  { name: 'Investment', type: 'income', icon: 'DollarSign', color: '#f59e0b' },
  { name: 'Gifts', type: 'income', icon: 'Gift', color: '#d946ef' },
  { name: 'Other', type: 'income', icon: 'Plus', color: '#6b7280' },
];

const selectedCategories = ref(new Set<Omit<Category, 'id' | 'created_at' | 'user_id' | 'is_default'>>());

const toggleCategory = (category: Omit<Category, 'id' | 'created_at' | 'user_id' | 'is_default'>) => {
  if (selectedCategories.value.has(category)) {
    selectedCategories.value.delete(category);
  } else {
    selectedCategories.value.add(category);
  }
};

const isSelected = (category: Omit<Category, 'id' | 'created_at' | 'user_id' | 'is_default'>) => {
  return selectedCategories.value.has(category);
};

const goToNextStep = () => {
  if (selectedCategories.value.size > 0) {
    step.value = 2;
  }
};

// --- Step 2: Settings ---
const settingsForm = reactive({
  currency: 'USD',
  fractions: 2,
});

const finishOnboarding = async () => {
  loading.value = true;
  try {
    // Create categories
    const categoriesToCreate = Array.from(selectedCategories.value);
    await categoriesStore.createManyCategories(categoriesToCreate);

    // Save settings
    await configStore.updateConfig(settingsForm);

    // Redirect to dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Onboarding failed:', error);
    // Optionally, show an error message to the user
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
    <div class="max-w-4xl w-full">
      <!-- Step 1: Category Selection -->
      <div v-if="step === 1">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-neon">{{ $t('onboarding.title') }}</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('onboarding.subtitle') }}</p>
        </div>

        <!-- Predefined Categories -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-neon mb-3">{{ $t('onboarding.expenses') }}</h2>
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
          <h2 class="text-lg font-semibold text-gray-900 dark:text-neon mb-3">{{ $t('onboarding.income') }}</h2>
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
          <button @click="goToNextStep" class="btn-primary" :disabled="selectedCategories.size === 0">
            {{ $t('onboarding.continue') }}
          </button>
        </div>
      </div>

      <!-- Step 2: Settings -->
      <div v-if="step === 2">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-neon">{{ $t('onboarding.finalDetails') }}</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('onboarding.finalDetailsSubtitle') }}</p>
        </div>

        <OnboardingSettings :form="settingsForm" />

        <!-- Actions -->
        <div class="max-w-md mx-auto">
          <div class="mt-10 flex justify-between items-center">
            <button @click="step = 1" class="btn-secondary">{{ $t('onboarding.back') }}</button>
            <button @click="finishOnboarding" class="btn-primary" :disabled="loading">
              <LoadingSpinner v-if="loading" size="sm" />
              <span v-else>{{ $t('onboarding.finishSetup') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCategoriesStore } from '@/stores/categories';
import { useConfigStore } from '@/stores/config';
import type { Category } from '@/types/category';
import CategoryCard from '@/components/category/CategoryCard.vue';
import OnboardingSettings from '@/components/onboarding/OnboardingSettings.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

const { t } = useI18n();
const router = useRouter();
const categoriesStore = useCategoriesStore();
const configStore = useConfigStore();

const step = ref(1);
const loading = ref(false);

// --- Step 1: Category Selection ---
const predefinedExpenses: Omit<Category, 'id' | 'created_at' | 'user_id' | 'is_default'>[] = [
  { name: t('onboarding.food'), type: 'expense', icon: 'UtensilsCrossed', color: '#f97316' },
  { name: t('onboarding.transport'), type: 'expense', icon: 'Car', color: '#3b82f6' },
  { name: t('onboarding.housing'), type: 'expense', icon: 'Home', color: '#8b5cf6' },
  { name: t('onboarding.bills'), type: 'expense', icon: 'Receipt', color: '#ef4444' },
  { name: t('onboarding.shopping'), type: 'expense', icon: 'ShoppingBag', color: '#ec4899' },
];

const predefinedIncome: Omit<Category, 'id' | 'created_at' | 'user_id' | 'is_default'>[] = [
  { name: t('onboarding.salary'), type: 'income', icon: 'Briefcase', color: '#10b981' },
  { name: t('onboarding.freelance'), type: 'income', icon: 'Laptop', color: '#06b6d4' },
  { name: t('onboarding.investment'), type: 'income', icon: 'DollarSign', color: '#f59e0b' },
  { name: t('onboarding.gifts'), type: 'income', icon: 'Gift', color: '#d946ef' },
  { name: t('onboarding.other'), type: 'income', icon: 'MoreHorizontal', color: '#6b7280' },
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

<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-neon">Settings</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your application settings
        </p>
      </div>

      <!-- Currency Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-neon mb-4">
          Global Settings
        </h3>
        <form @submit.prevent="updateCurrencySettings" class="space-y-4">
          <div>
            <label for="currency" class="label">Default Currency</label>
            <select
              id="currency"
              v-model="currencyForm.currency"
              class="input"
              :disabled="configStore.loading"
            >
              <option v-for="c in popularCurrencies" :key="c.code" :value="c.code">
                {{ c.name }} ({{ c.code }})
              </option>
            </select>
          </div>
          <div>
            <label for="fractions" class="label">Decimal Fractions</label>
            <input
              id="fractions"
              v-model.number="currencyForm.fractions"
              type="number"
              min="0"
              max="4"
              class="input"
              :disabled="configStore.loading"
            />
          </div>
          <div>
            <label for="fractions" class="label">Gemini Api Key</label>
            <input
              id="geminiApiKey"
              v-model="currencyForm.gemini_api_key"
              type="password"
              class="input"
              placeholder="Your Api Key"
              autocomplete="off"
              :disabled="configStore.loading"
            />
            <p class="text-xs label mt-1">Add your gemini API Key to enable AI Features.</p>
          </div>

          <div v-if="currencyUpdateError" class="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
            <p class="text-sm text-error-700 dark:text-error-300">{{ currencyUpdateError }}</p>
          </div>

          <div v-if="currencyUpdateSuccess" class="p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
            <p class="text-sm text-success-700 dark:text-success-300">Currency settings updated successfully!</p>
          </div>

          <button
            type="submit"
            class="btn-primary"
            :disabled="configStore.loading || !hasCurrencyChanges"
          >
            <LoadingSpinner v-if="configStore.loading" size="sm" />
            <span v-else>Save Currency Settings</span>
          </button>
        </form>
      </div>

      <!-- Date Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-neon mb-4">
          Date Settings
        </h3>
        <form @submit.prevent="updateDateSettings" class="space-y-4">
          <div>
            <label for="firstDayOfMonth" class="label">First Day of Month</label>
            <input
              id="firstDayOfMonth"
              v-model.number="dateSettingsForm.firstDayOfMonth"
              type="number"
              min="1"
              max="28"
              class="input"
            />
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Set the starting day of your financial month (1-28).
            </p>
          </div>

          <div v-if="dateSettingsUpdateSuccess" class="p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
            <p class="text-sm text-success-700 dark:text-success-300">Date settings updated successfully!</p>
          </div>

          <button
            type="submit"
            class="btn-primary"
            :disabled="!hasDateSettingsChanges"
          >
            <span>Save Date Settings</span>
          </button>
        </form>
      </div>

      <!-- Calculation Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-neon mb-4">
          Calculation Settings
        </h3>
        <div class="space-y-4">
          <div class="flex item-start lg:items-center justify-between rounded-lg p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div>
              <label for="hidden-toggle" class="font-medium text-gray-900 dark:text-gray-100">
                Include hidden wallets in calculation
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enable this to include balances from hidden wallets in total calculations across the app.
              </p>
            </div>
            <button
              type="button"
              @click="calculationSettingsForm.includeHiddenWalletsInCalculation = !calculationSettingsForm.includeHiddenWalletsInCalculation"
              :class="[
                calculationSettingsForm.includeHiddenWalletsInCalculation ? 'bg-primary-600 dark:bg-neon' : 'bg-gray-200 dark:bg-gray-700',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
              ]"
              role="switch"
              :aria-checked="calculationSettingsForm.includeHiddenWalletsInCalculation"
              id="hidden-toggle"
            >
              <span class="sr-only">Include hidden wallets in calculation</span>
              <span
                aria-hidden="true"
                :class="[
                  calculationSettingsForm.includeHiddenWalletsInCalculation ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                ]"
              />
            </button>
          </div>

          <div v-if="calculationSettingsUpdateSuccess" class="p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
            <p class="text-sm text-success-700 dark:text-success-300">Calculation settings updated successfully!</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useConfigStore, popularCurrencies } from '@/stores/config';
import AppLayout from '@/components/layouts/AppLayout.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import { Config } from '@/types/config';

const configStore = useConfigStore();

// --- Currency Settings ---
const currencyUpdateError = ref('');
const currencyUpdateSuccess = ref(false);
const currencyForm = reactive<Partial<Config>>({
  currency: 'USD',
  fractions: 2,
  gemini_api_key: ''
});

const hasCurrencyChanges = computed(() => {
  return currencyForm.currency !== configStore.currency
    || currencyForm.fractions !== configStore.fractions
    || currencyForm.gemini_api_key !== configStore.gemini_api_key;
});

const updateCurrencySettings = async () => {
  if (!hasCurrencyChanges.value) return;

  currencyUpdateError.value = '';
  currencyUpdateSuccess.value = false;

  const result = await configStore.updateConfig({
    currency: currencyForm.currency,
    fractions: currencyForm.fractions,
    gemini_api_key: currencyForm.gemini_api_key
  });

  if (result.success) {
    currencyUpdateSuccess.value = true;
    setTimeout(() => {
      currencyUpdateSuccess.value = false;
    }, 3000);
  } else {
    currencyUpdateError.value = result.error || 'Failed to update settings.';
  }
};

watch(() => configStore.config, (newConfig) => {
  if (newConfig) {
    currencyForm.currency = newConfig.currency;
    currencyForm.fractions = newConfig.fractions;
    currencyForm.gemini_api_key = newConfig.gemini_api_key;
  }
}, { immediate: true });


// --- Date Settings ---
const dateSettingsUpdateSuccess = ref(false);
const dateSettingsForm = reactive({
  firstDayOfMonth: 1,
});

const hasDateSettingsChanges = computed(() => {
  return dateSettingsForm.firstDayOfMonth !== configStore.firstDayOfMonth;
});

const updateDateSettings = () => {
  if (!hasDateSettingsChanges.value) return;
  configStore.updateFirstDayOfMonth(dateSettingsForm.firstDayOfMonth);
  dateSettingsUpdateSuccess.value = true;
  setTimeout(() => {
    dateSettingsUpdateSuccess.value = false;
  }, 3000);
};

watch(() => configStore.firstDayOfMonth, (newDay) => {
  dateSettingsForm.firstDayOfMonth = newDay;
}, { immediate: true });

// --- Calculation Settings ---
const calculationSettingsUpdateSuccess = ref(false);
const calculationSettingsForm = reactive({
  includeHiddenWalletsInCalculation: false,
});

watch(() => configStore.includeHiddenWalletsInCalculation, (newValue) => {
  calculationSettingsForm.includeHiddenWalletsInCalculation = newValue;
}, { immediate: true });

watch(() => calculationSettingsForm.includeHiddenWalletsInCalculation, (newValue) => {
  if (newValue !== configStore.includeHiddenWalletsInCalculation) {
    configStore.updateIncludeHiddenWalletsInCalculation(newValue);
    calculationSettingsUpdateSuccess.value = true;
    setTimeout(() => {
      calculationSettingsUpdateSuccess.value = false;
    }, 3000);
  }
});


// --- Lifecycle Hooks ---
onMounted(() => {
  configStore.fetchConfig();
});
</script>

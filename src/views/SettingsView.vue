<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div>
        <h1 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-neon">{{ $t('settings.title') }}</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t('settings.subtitle') }}
        </p>
      </div>

      <!-- Language Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-neon mb-4">
          {{ $t('settings.language') }}
        </h3>
        <div class="space-y-4">
          <div>
            <label for="language" class="label">{{ $t('settings.language') }}</label>
            <select
              id="language"
              v-model="languageForm.language"
              @change="handleLanguageChange"
              class="input"
            >
              <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
                {{ lang.name }}
              </option>
            </select>
            <p class="text-xs label mt-1">{{ $t('settings.languageHint') }}</p>
          </div>

          <div v-if="languageUpdateSuccess" class="p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
            <p class="text-sm text-success-700 dark:text-success-300">{{ $t('settings.languageUpdateSuccess') }}</p>
          </div>
        </div>
      </div>

      <!-- Currency Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-neon mb-4">
          {{ $t('settings.globalSettings') }}
        </h3>
        <form @submit.prevent="updateCurrencySettings" class="space-y-4">
          <div>
            <label for="currency" class="label">{{ $t('settings.defaultCurrency') }}</label>
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
            <label for="fractions" class="label">{{ $t('settings.decimalFractions') }}</label>
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
            <label for="fractions" class="label">{{ $t('settings.geminiApiKey') }}</label>
            <input
              id="geminiApiKey"
              v-model="currencyForm.gemini_api_key"
              type="password"
              class="input"
              :placeholder="$t('settings.geminiApiKeyPlaceholder')"
              autocomplete="off"
              :disabled="configStore.loading"
            />
            <p class="text-xs label mt-1">{{ $t('settings.geminiApiKeyHint') }}</p>
          </div>

          <div v-if="currencyUpdateError" class="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
            <p class="text-sm text-error-700 dark:text-error-300">{{ currencyUpdateError }}</p>
          </div>

          <div v-if="currencyUpdateSuccess" class="p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
            <p class="text-sm text-success-700 dark:text-success-300">{{ $t('settings.currencyUpdateSuccess') }}</p>
          </div>

          <button
            type="submit"
            class="btn-primary text-xs"
            :disabled="configStore.loading || !hasCurrencyChanges"
          >
            <LoadingSpinner v-if="configStore.loading" size="sm" />
            <span v-if="configStore.loading" class="ml-2">{{ $t('common.saving') }}</span>
            <span v-else>{{ $t('settings.saveSettings') }}</span>
          </button>
        </form>
      </div>

      <!-- Date Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-neon mb-4">
          {{ $t('settings.dateSettings') }}
        </h3>
        <form @submit.prevent="updateDateSettings" class="space-y-4">
          <div>
            <label for="firstDayOfMonth" class="label">{{ $t('settings.firstDayOfMonth') }}</label>
            <input
              id="firstDayOfMonth"
              v-model.number="dateSettingsForm.firstDayOfMonth"
              type="number"
              min="1"
              max="28"
              class="input"
            />
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ $t('settings.firstDayOfMonthHint') }}
            </p>
          </div>

          <div v-if="dateSettingsUpdateSuccess" class="p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
            <p class="text-sm text-success-700 dark:text-success-300">{{ $t('settings.dateSettingsUpdateSuccess') }}</p>
          </div>

          <button
            type="submit"
            class="btn-primary text-xs"
            :disabled="!hasDateSettingsChanges"
          >
            <span>{{ $t('settings.saveDateSettings') }}</span>
          </button>
        </form>
      </div>

      <!-- Calculation Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-neon mb-4">
          {{ $t('settings.calculationSettings') }}
        </h3>
        <div class="space-y-4">
          <div class="flex item-start lg:items-center justify-between rounded-lg p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 gap-4">
            <div>
              <label for="hidden-toggle" class="font-medium text-gray-900 dark:text-gray-100">
                {{ $t('settings.includeHiddenWallets') }}
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('settings.includeHiddenWalletsHint') }}
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
              <span class="sr-only">{{ $t('settings.includeHiddenWallets') }}</span>
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
            <p class="text-sm text-success-700 dark:text-success-300">{{ $t('settings.calculationSettingsUpdateSuccess') }}</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfigStore, popularCurrencies } from '@/stores/config';
import { availableLanguages } from '@/i18n';
import AppLayout from '@/components/layouts/AppLayout.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import { Config } from '@/types/config';

const configStore = useConfigStore();
const { locale } = useI18n();

// --- Language Settings ---
const languageUpdateSuccess = ref(false);
const languageForm = reactive({
  language: 'en',
});

const handleLanguageChange = () => {
  locale.value = languageForm.language;
  configStore.updateLanguage(languageForm.language);
  languageUpdateSuccess.value = true;
  setTimeout(() => {
    languageUpdateSuccess.value = false;
  }, 3000);
};

watch(() => configStore.language, (newLang) => {
  languageForm.language = newLang;
  locale.value = newLang;
}, { immediate: true });

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

<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your application settings
        </p>
      </div>

      <!-- Currency Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Currency Settings
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
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useConfigStore, popularCurrencies } from '@/stores/config';
import AppLayout from '@/components/layouts/AppLayout.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

const configStore = useConfigStore();

const currencyUpdateError = ref('');
const currencyUpdateSuccess = ref(false);

const currencyForm = reactive({
  currency: 'USD',
  fractions: 2,
});

const hasCurrencyChanges = computed(() => {
  return currencyForm.currency !== configStore.currency || currencyForm.fractions !== configStore.fractions;
});

const updateCurrencySettings = async () => {
  if (!hasCurrencyChanges.value) return;

  currencyUpdateError.value = '';
  currencyUpdateSuccess.value = false;

  const result = await configStore.updateConfig({
    currency: currencyForm.currency,
    fractions: currencyForm.fractions,
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
  }
}, { immediate: true });

onMounted(() => {
  if (!configStore.config) {
    configStore.fetchConfig();
  }
});
</script>

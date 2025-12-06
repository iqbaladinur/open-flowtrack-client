<template>
  <div class="max-w-md mx-auto">
    <div class="card p-6">
      <form class="space-y-4">
        <div>
          <label for="language" class="label">{{ $t('settings.language') }}</label>
          <select
            id="language"
            v-model="form.language"
            class="input"
          >
            <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
              {{ lang.name }}
            </option>
          </select>
          <p class="text-xs label mt-1">{{ $t('settings.languageHint') }}</p>
        </div>
        <div>
          <label for="currency" class="label">{{ $t('settings.defaultCurrency') }}</label>
          <select
            id="currency"
            v-model="form.currency"
            class="input"
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
            v-model.number="form.fractions"
            type="number"
            min="0"
            max="4"
            class="input"
          />
        </div>
        <div>
          <label for="firstDayOfMonth" class="label">{{ $t('settings.firstDayOfMonth') }}</label>
          <input
            id="firstDayOfMonth"
            v-model.number="form.firstDayOfMonth"
            type="number"
            min="1"
            max="28"
            class="input"
          />
          <p class="text-xs label mt-1">{{ $t('settings.firstDayOfMonthHint') }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { popularCurrencies } from '@/stores/config';
import { availableLanguages } from '@/i18n';

defineProps({
  form: {
    type: Object as () => {
      language: string;
      currency: string;
      fractions: number;
      firstDayOfMonth: number;
    },
    required: true,
  },
});
</script>

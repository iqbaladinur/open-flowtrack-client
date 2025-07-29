<template>
  <div class="max-w-md mx-auto">
    <div class="card p-6">
      <form class="space-y-4">
        <div>
          <label for="currency" class="label">Default Currency</label>
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
          <label for="fractions" class="label">Decimal Fractions</label>
          <input
            id="fractions"
            v-model.number="form.fractions"
            type="number"
            min="0"
            max="4"
            class="input"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { popularCurrencies } from '@/stores/config';

defineProps({
  form: {
    type: Object as () => { currency: string; fractions: number },
    required: true,
  },
});
</script>

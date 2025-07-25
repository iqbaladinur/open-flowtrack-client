<template>
  <div class="card p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ title }}</p>
        <p class="text-2xl font-bold" :class="amountClass">
          <slot name="amount">{{ formattedAmount }}</slot>
        </p>
      </div>
      <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="iconBgClass">
        <slot name="icon"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  amountClass: {
    type: String,
    default: 'text-gray-900 dark:text-white',
  },
  iconBgClass: {
    type: String,
    default: 'bg-gray-100 dark:bg-gray-900',
  },
  currency: {
    type: String,
    default: 'USD',
  },
});

const formattedAmount = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(props.amount);
});
</script>

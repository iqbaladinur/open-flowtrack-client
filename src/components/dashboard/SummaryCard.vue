<template>
  <div class="card p-3 w-72 lg:w-full flex-shrink-0">
    <div class="flex flex-col h-full">
      <div class="size-12 rounded-xl flex items-center justify-center flex-shrink-0 mb-3" :class="iconBgClass">
        <component :is="icon" class="w-6 h-6" :class="iconClass" />
      </div>
      <div class="mt-auto">
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ title }}</p>
        <p class="lg:text-base text-xs " :class="valueClass">
          {{ prefix }}{{ configStore.formatCurrency(value) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/config';
import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue';

withDefaults(defineProps<{
  title: string;
  value: number;
  icon: FunctionalComponent<HTMLAttributes & VNodeProps, {}>;
  iconBgClass: string;
  iconClass: string;
  valueClass: any;
  prefix?: string;
  accent?: 'positive' | 'negative';
}>(), {
  prefix: '',
});

const configStore = useConfigStore();
</script>

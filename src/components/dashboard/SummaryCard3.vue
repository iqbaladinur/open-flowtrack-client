<template>
  <div class="card p-3 w-72 lg:w-full flex-shrink-0 relative rounded-2xl overflow-hidden
           bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700
           dark:shadow-xl border border-white/10 dark:border-black/20">
    <!-- subtle brushed texture -->
    <div class="absolute inset-0 opacity-25 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]">
    </div>

    <div class="relative flex flex-col h-full">
      <div class="size-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm shadow
               bg-gradient-to-br from-white/60 to-gray-200/60 dark:from-gray-600/40 dark:to-gray-800/40"
        :class="iconBgClass">
        <component :is="icon" class="w-5 h-5" :class="iconClass" />
      </div>

      <p class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ title }}</p>
      <p class="mt-auto text-lg font-semibold text-gray-900" :class="valueClass">
        {{  configStore.showAmount ? prefix : '*' }}{{ configStore.showAmount ? configStore.formatCurrency(value) : '********' }}
      </p>
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

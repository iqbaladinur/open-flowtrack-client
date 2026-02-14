<template>
  <div class="card pt-3 pb-4 px-4 lg:p-3 w-72 lg:w-full flex-shrink-0 relative rounded-2xl overflow-hidden h-[150px] lg:h-[130px] md:h-auto dark:hover:bg-gray-800 transition-colors">

    <div class="relative flex flex-col h-full items-center lg:items-start">
      <div class="size-14 lg:size-10 rounded-2xl lg:rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm shadow
               bg-gradient-to-br from-white/60 to-gray-200/60 dark:from-gray-600/40 dark:to-gray-800/40"
        :class="iconBgClass">
        <component :is="icon" class="size-6 lg:size-5" :class="iconClass" />
      </div>

      <div class="mt-auto">
        <p class="text-sm lg:text-xs font-medium text-sepia-700 dark:text-gray-300 text-center lg:text-left">{{ title }}</p>
        <p class="font-semibold text-2xl lg:text-sm text-center lg:text-left" :class="valueClass">
          <span v-if="isCurrency">
            {{  configStore.showAmount ? prefix : '*' }}{{ configStore.formatCurrency(value) }}
          </span>
          <span v-else>
            {{ formatter ? formatter(value) : value }}
          </span>
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
  isCurrency?: boolean;
  formatter?: Function;
}>(), {
  prefix: '',
  isCurrency: true
});

const configStore = useConfigStore();
</script>

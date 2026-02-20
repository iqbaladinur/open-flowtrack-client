<template>
  <div :class="[
    'relative overflow-hidden flex-shrink-0',
    flat
      ? 'w-full h-full px-5 pt-4 pb-3'
      : 'card pt-3 pb-4 px-4 lg:p-3 w-72 lg:w-full rounded-2xl h-[150px] lg:h-[130px] md:h-auto dark:hover:bg-gray-800 transition-colors',
  ]">
    <div :class="[
      'relative flex flex-col h-full',
      flat ? 'items-center justify-between' : 'items-center lg:items-start',
    ]">
      <div :class="[
        'flex items-center justify-center backdrop-blur-sm shadow bg-gradient-to-br from-white/60 to-gray-200/60 dark:from-gray-600/40 dark:to-gray-800/40',
        flat ? 'size-12 rounded-xl' : 'size-14 lg:size-10 rounded-2xl lg:rounded-xl mb-4',
        iconBgClass,
      ]">
        <component :is="icon" :class="[flat ? 'size-6' : 'size-6 lg:size-5', iconClass]" />
      </div>

      <div :class="flat ? 'text-center' : 'mt-auto'">
        <p class="text-xs font-medium text-sepia-700 dark:text-gray-300 text-center lg:text-left">{{ title }}</p>
        <p :class="['font-semibold text-center lg:text-left', flat ? 'text-xl' : 'text-2xl lg:text-sm', valueClass]">
          <span v-if="isCurrency">
            {{ configStore.showAmount ? prefix : '*' }}{{ configStore.formatCurrency(value) }}
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
  flat?: boolean;
}>(), {
  prefix: '',
  isCurrency: true,
  flat: false,
});

const configStore = useConfigStore();
</script>

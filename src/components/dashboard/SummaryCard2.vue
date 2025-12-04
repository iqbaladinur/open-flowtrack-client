<template>
  <div 
    class="relative group overflow-hidden border border-cyan-500/30 bg-white dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] p-3 w-72 lg:w-full flex-shrink-0"
    :style="{
      clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
    }"
  >
    <div 
      class="absolute inset-0 opacity-20"
      :style="{
        backgroundImage: `
          linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }"
    />

    <div :class="[`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getAccentColor(accent)}`]" />
    
    <div class="relative z-10 p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <div :class="[`p-2 border border-current/30 bg-current/10`]">
            <component :is="icon" class="w-6 h-6" :class="iconClass" />
          </div>
          <div class="flex flex-col space-y-0.5">
            <div class="w-8 h-0.5 bg-cyan-400/60" />
            <div class="w-4 h-0.5 bg-cyan-400/40" />
          </div>
        </div>
        <div class="text-xs text-cyan-400/60 ">
          #
        </div>
      </div>
      
      <p class="text-xs text-gray-400 uppercase tracking-wider mb-2 ">
        {{ title }}
      </p>
      
      <p :class="`text-xl font-medium ${valueClass}`">
        {{ prefix }}{{ configStore.formatCurrency(value) }}
      </p>
      
      <div class="absolute bottom-2 right-2 flex space-x-1">
        <div class="w-1 h-1 bg-cyan-400 animate-pulse" />
        <div class="w-1 h-1 bg-cyan-400/60 animate-pulse delay-100" />
        <div class="w-1 h-1 bg-cyan-400/40 animate-pulse delay-200" />
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

const getAccentColor = (type?: 'positive' | 'negative') => {
  switch (type) {
    case 'positive': return 'from-green-400 to-emerald-600';
    case 'negative': return 'from-red-400 to-pink-600';
    default: return 'from-cyan-400 to-blue-600';
  }
};
</script>

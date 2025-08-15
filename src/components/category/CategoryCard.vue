<template>
  <button 
    @click="$emit('edit', category)"
    class="card p-3 aspect-square flex flex-col items-center justify-center text-center transition-all group relative"
  >
    <!-- Type Indicator -->
    <div class="absolute top-1.5 left-1.5">
      <component
        :is="category.type === 'income' ? TrendingUp : TrendingDown"
        class="w-3.5 h-3.5"
        :class="category.type === 'income' ? 'text-success-500' : 'text-error-500'"
      />
    </div>

    <!-- Delete Button (visible on hover on desktop) -->
    <div v-if="category.id" class="absolute top-1 right-1 transition-opacity">
      <button
        @click.stop="$emit('delete', category.id)"
        class="p-1.5 rounded-full text-gray-400 bg-white/50 dark:bg-gray-800/50 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-error-600 dark:hover:text-error-400"
        :disabled="category.is_default"
      >
        <Trash2 class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Category Icon -->
    <div 
      class="w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110" 
      :style="{ backgroundColor: category.color + '20' }"
    >
      <!-- @vue-ignore -->
      <component :is="getIcon(category.icon)" class="w-5 h-5" :style="{ color: category.color }" />
    </div>

    <!-- Category Info -->
    <h3 class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate w-full">
      {{ category.name }}
    </h3>
  </button>
</template>

<script setup lang="ts">
import type { Category } from '@/types/category';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-vue-next';
import { getIcon } from '@/utils/icons';

defineProps({
  category: {
    type: Object as () => Category,
    required: true,
  },
});

defineEmits(['edit', 'delete']);
</script>

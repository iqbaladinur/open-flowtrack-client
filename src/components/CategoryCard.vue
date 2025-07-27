<template>
  <div class="card p-6 hover:shadow-md transition-shadow relative group">
    <!-- Category Actions -->
    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <div class="flex items-center space-x-1">
        <button
          @click="$emit('edit', category)"
          class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
        >
          <Edit2 class="w-4 h-4" />
        </button>
        <button
          @click="$emit('delete', category.id)"
          class="p-1 text-gray-400 hover:text-error-600 dark:hover:text-error-400 rounded"
          :disabled="category.is_default"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Category Icon -->
    <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" :style="{ backgroundColor: category.color + '20' }">
      <!-- @vue-ignore -->
      <component :is="icons[category.icon] || icons['Tag']" class="w-6 h-6" :style="{ color: category.color }" />
    </div>

    <!-- Category Info -->
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ category.name }}
      </h3>
      
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500 dark:text-gray-400">Type</span>
          <span 
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            :class="category.type === 'income' ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200' : 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200'"
          >
            {{ category.type }}
          </span>
        </div>
        <div v-if="category.is_default" class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400"></span>
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                Default
            </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@/types';
import { Edit2, Trash2 } from 'lucide-vue-next';
import * as icons from 'lucide-vue-next';

defineProps({
  category: {
    type: Object as () => Category,
    required: true,
  },
});

defineEmits(['edit', 'delete']);
</script>

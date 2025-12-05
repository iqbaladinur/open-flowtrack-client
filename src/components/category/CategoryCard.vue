<template>
  <button
    @click="$emit('edit', category)"
    class="group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-sepia-200 bg-sepia-50 p-4 text-center transition-colors hover:bg-sepia-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
  >
    <!-- Type Indicator Badge -->
    <div class="absolute left-2 top-2">
      <div
        class="flex items-center justify-center rounded-md p-1"
        :class="
          category.type === 'income'
            ? 'bg-success-100 dark:bg-success-900/30'
            : 'bg-error-100 dark:bg-error-900/30'
        "
      >
        <component
          :is="category.type === 'income' ? TrendingUp : TrendingDown"
          class="size-2.5"
          :class="
            category.type === 'income'
              ? 'text-success-600 dark:text-success-400'
              : 'text-error-600 dark:text-error-400'
          "
        />
      </div>
    </div>

    <!-- Delete Button -->
    <div
      v-if="category.id"
      class="absolute right-2 top-2 transition-opacity md:opacity-0 md:group-hover:opacity-100 flex items-start justify-center"
    >
      <button
        @click.stop="$emit('delete', category.id)"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-error-100 hover:text-error-600 dark:hover:bg-error-900/30 dark:hover:text-error-400"
        :disabled="category.is_default"
      >
        <Trash2 class="size-2.5" />
      </button>
    </div>

    <!-- Category Icon -->
    <div
      class="flex size-10 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
      :style="{ backgroundColor: category.color + '15' }"
    >
      <!-- @vue-ignore -->
      <component :is="getIcon(category.icon)" class="size-4" :style="{ color: category.color }" />
    </div>

    <!-- Category Name -->
    <h3 class="w-full truncate text-sm font-medium text-sepia-900 dark:text-gray-100">
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

<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    class="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors group"
  >
    <div
      class="w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-opacity-80 transition-colors"
      :class="iconBgClass"
    >
      <slot name="icon"></slot>
    </div>
    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
      <slot></slot>
    </span>
  </component>
</template>

<script setup lang="ts">
defineProps({
  to: {
    type: String,
    default: null,
  },
  iconBgClass: {
    type: String,
    default: 'bg-gray-100 dark:bg-gray-900',
  },
});
</script>

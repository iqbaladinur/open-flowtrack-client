<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    class="flex flex-col items-center p-4 rounded-lg transition-colors group"
  >
    <div
      class="w-10 h-10 rounded-xl flex items-center justify-center mb-2 group-hover:bg-opacity-80 transition-colors backdrop-blur-sm shadow
               bg-gradient-to-br from-white/60 to-gray-200/60 dark:from-gray-600/40 dark:to-gray-800/40"
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

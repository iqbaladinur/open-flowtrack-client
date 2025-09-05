<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div 
      class="animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"
      :class="sizeClass"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg' | string;
  fullHeight?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  fullHeight: false,
});

const sizeClass = computed(() => {
  if (!props.size) {
    return 'w-6 h-6';
  }
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4';
    case 'lg':
      return 'w-8 h-8';
    case 'md':
      return 'w-6 h-6';
    default:
      return props.size;
  }
});

const containerClass = computed(() => {
  return props.fullHeight ? 'min-h-64' : '';
});
</script>
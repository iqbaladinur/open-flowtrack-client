<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative flex items-center justify-center" :class="sizeClass">
      <!-- Glow pulse -->
      <div class="absolute rounded-full animate-ping opacity-20 bg-primary-500 dark:bg-neon" :class="glowSizeClass" />

      <!-- SVG arc spinner -->
      <svg class="animate-spin" :class="sizeClass" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient :id="gradId" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" class="stop-from" />
            <stop offset="100%" class="stop-to" />
          </linearGradient>
        </defs>
        <!-- Track -->
        <circle cx="22" cy="22" r="18" stroke-width="3.5" class="track-circle" />
        <!-- Arc -->
        <circle cx="22" cy="22" r="18" stroke-width="3.5" stroke-linecap="round"
          :stroke="`url(#${gradId})`"
          stroke-dasharray="72 41"
          stroke-dashoffset="-6"
        />
      </svg>
    </div>
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

// Unique gradient ID to avoid SVG id collisions when multiple spinners render
const gradId = `spinner-grad-${Math.random().toString(36).slice(2, 7)}`;

const sizeClass = computed(() => {
  if (!props.size) return 'w-6 h-6';
  switch (props.size) {
    case 'sm': return 'w-4 h-4';
    case 'lg': return 'w-8 h-8';
    case 'md': return 'w-6 h-6';
    default:   return props.size;
  }
});

const glowSizeClass = computed(() => {
  if (!props.size) return 'w-4 h-4';
  switch (props.size) {
    case 'sm': return 'w-2.5 h-2.5';
    case 'lg': return 'w-5 h-5';
    case 'md': return 'w-4 h-4';
    default:   return 'w-4 h-4';
  }
});

const containerClass = computed(() => props.fullHeight ? 'min-h-64' : '');
</script>

<style scoped>
.track-circle {
  stroke: theme('colors.gray.200');
}
.dark .track-circle {
  stroke: theme('colors.gray.700');
}

/* Light mode: primary blue-green gradient */
.stop-from {
  stop-color: theme('colors.primary.400');
  stop-opacity: 0.15;
}
.stop-to {
  stop-color: theme('colors.primary.600');
  stop-opacity: 1;
}

/* Dark mode: neon green gradient */
.dark .stop-from {
  stop-color: theme('colors.emerald.700');
  stop-opacity: 0.1;
}
.dark .stop-to {
  stop-color: #a3ff6f; /* neon */
  stop-opacity: 1;
}

/* Slow down ping so it doesn't look frantic */
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
.animate-ping {
  animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>

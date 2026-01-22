<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#4C2A86"/>
    <ellipse cx="12" cy="24" rx="6" ry="10" fill="white"/>
    <ellipse cx="12" cy="24" rx="3" ry="6" fill="#4C2A86"/>
    <path d="M20 14L24 34L28 14" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="36" cy="24" rx="6" ry="10" fill="white"/>
    <ellipse cx="36" cy="24" rx="3" ry="6" fill="#4C2A86"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

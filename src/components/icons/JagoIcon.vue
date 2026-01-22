<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#FFDD00"/>
    <circle cx="24" cy="24" r="12" fill="#1A1A1A"/>
    <path d="M20 20L24 28L28 20" stroke="#FFDD00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="24" cy="24" r="3" fill="#FFDD00"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#9C27B0"/>
    <rect x="8" y="14" width="32" height="24" rx="4" fill="white"/>
    <rect x="8" y="10" width="28" height="8" rx="2" fill="#E1BEE7"/>
    <rect x="28" y="22" width="12" height="10" rx="2" fill="#9C27B0"/>
    <circle cx="34" cy="27" r="2" fill="white"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

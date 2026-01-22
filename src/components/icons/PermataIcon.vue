<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#00A650"/>
    <path d="M24 8L32 16L24 24L16 16L24 8Z" fill="white"/>
    <path d="M24 24L32 32L24 40L16 32L24 24Z" fill="#FFC20E"/>
    <path d="M8 16L16 24L8 32V16Z" fill="white"/>
    <path d="M40 16V32L32 24L40 16Z" fill="#FFC20E"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

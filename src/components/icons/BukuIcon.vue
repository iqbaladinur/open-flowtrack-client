<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#E91E63"/>
    <circle cx="24" cy="24" r="14" fill="white"/>
    <path d="M18 18H22V24H26V18H30V30H26V28H22V30H18V18Z" fill="#E91E63"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#EE4D2D"/>
    <path d="M24 8C20 8 17 10 17 10V14C17 14 20 12 24 12C28 12 31 14 31 14V10C31 10 28 8 24 8Z" fill="white"/>
    <path d="M14 18C14 14 18 14 24 14C30 14 34 14 34 18V32C34 38 30 40 24 40C18 40 14 38 14 32V18Z" fill="white"/>
    <path d="M20 26C20 24 21.5 22 24 22C26.5 22 28 24 28 26C28 28 26.5 30 24 30C21.5 30 20 28 20 26Z" fill="#EE4D2D"/>
    <circle cx="21" cy="25" r="1.5" fill="white"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

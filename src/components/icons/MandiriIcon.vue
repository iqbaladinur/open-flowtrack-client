<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#003876"/>
    <path d="M6 28L12 16H16L22 28V16H26V34H22L16 22V34H12L6 22V34H2V16H6V28Z" fill="white"/>
    <path d="M28 16H32L38 27V16H42V34H38L32 23V34H28V16Z" fill="#F7A600"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

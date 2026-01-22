<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#4CAF50"/>
    <path d="M8 14H40V16H8V14Z" fill="white"/>
    <path d="M10 16H38V36H10V16Z" fill="white"/>
    <rect x="12" y="18" width="24" height="16" rx="2" fill="#4CAF50"/>
    <circle cx="24" cy="26" r="6" fill="white"/>
    <path d="M24 22V30M21 25H27M21 27H27" stroke="#4CAF50" stroke-width="1.5"/>
    <circle cx="14" cy="20" r="2" fill="white"/>
    <circle cx="34" cy="32" r="2" fill="white"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

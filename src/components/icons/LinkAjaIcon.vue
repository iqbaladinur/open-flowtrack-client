<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#E31E25"/>
    <circle cx="24" cy="24" r="14" fill="white"/>
    <path d="M18 30V18H22V26H28V18H32V30H18Z" fill="#E31E25"/>
    <circle cx="24" cy="24" r="3" fill="#E31E25"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

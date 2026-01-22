<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#F47920"/>
    <path d="M6 16H12C15.3137 16 18 18.1863 18 21C18 22.5 17 24 15.5 24.5C17.5 25 19 26.5 19 29C19 32.3137 16.3137 34 13 34H6V16Z" fill="white"/>
    <path d="M10 19V23H12C13.1046 23 14 22.3284 14 21C14 19.6716 13.1046 19 12 19H10Z" fill="#F47920"/>
    <path d="M10 26V31H13C14.1046 31 15 30.1046 15 29C15 27.3431 14.1046 26 13 26H10Z" fill="#F47920"/>
    <path d="M20 16H34V20H29V34H25V20H20V16Z" fill="white"/>
    <path d="M36 16H40L44 27V16H48V34H44L40 23V34H36V16Z" fill="white"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

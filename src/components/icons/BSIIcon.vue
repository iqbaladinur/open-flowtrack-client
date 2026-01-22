<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#00A85A"/>
    <path d="M8 16H14C17.3137 16 20 18.1863 20 21C20 22.5 19 24 17.5 24.5C19.5 25 21 26.5 21 29C21 32.3137 18.3137 34 15 34H8V16Z" fill="white"/>
    <path d="M12 19V23H14C15.1046 23 16 22.3284 16 21C16 19.6716 15.1046 19 14 19H12Z" fill="#00A85A"/>
    <path d="M12 26V31H15C16.1046 31 17 30.1046 17 29C17 27.3431 16.1046 26 15 26H12Z" fill="#00A85A"/>
    <path d="M23 28C23 26 25 24 28 24C30 24 32 25 32 25V28C32 28 30 27 28 27C26.5 27 26 27.5 26 28C26 28.5 26.5 29 28 29.5C31 30.5 33 31 33 34C33 37 30 38 28 38C25 38 23 37 23 37V34C23 34 25 35 28 35C29.5 35 30 34.5 30 34C30 33.5 29.5 33 28 32.5C25 31.5 23 30 23 28Z" fill="white"/>
    <path d="M36 16H40V34H36V16Z" fill="white"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

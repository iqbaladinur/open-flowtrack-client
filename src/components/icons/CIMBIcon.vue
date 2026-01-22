<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#ED1C24"/>
    <path d="M8 22C8 18.6863 10.6863 16 14 16C17.3137 16 20 18.6863 20 22V23H16V22C16 20.8954 15.1046 20 14 20C12.8954 20 12 20.8954 12 22V28C12 29.1046 12.8954 30 14 30C15.1046 30 16 29.1046 16 28V27H20V28C20 31.3137 17.3137 34 14 34C10.6863 34 8 31.3137 8 28V22Z" fill="white"/>
    <path d="M22 16H26V34H22V16Z" fill="white"/>
    <path d="M28 16H34L37 26L40 16H44V34H40V24L37 34H35L32 24V34H28V16Z" fill="white"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#0066B3"/>
    <path d="M12 20C12 18 14 16 18 16C21 16 24 17 24 17V21C24 21 21 20 18 20C16 20 15 20.5 15 21C15 21.5 16 22 18 22.5C22 23.5 25 25 25 28C25 32 22 34 18 34C14 34 12 33 12 33V29C12 29 14 30 18 30C20 30 22 29.5 22 28.5C22 27.5 20 27 18 26.5C14 25.5 12 24 12 20Z" fill="white"/>
    <path d="M28 16H40V20H32V23H38V27H32V30H40V34H28V16Z" fill="white"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

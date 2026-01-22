<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#00AEEF"/>
    <path d="M16 16H20V28C20 30.2091 18.2091 32 16 32H14V28H16V16Z" fill="white"/>
    <circle cx="18" cy="36" r="2" fill="white"/>
    <path d="M24 16H36V20H28V22H34V26H28V28H36V32H24V16Z" fill="white"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

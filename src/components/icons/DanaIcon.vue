<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#108EE9"/>
    <path d="M8 16H14C18.4183 16 22 19.5817 22 24C22 28.4183 18.4183 32 14 32H8V16Z" fill="white"/>
    <path d="M12 20V28H14C16.2091 28 18 26.2091 18 24C18 21.7909 16.2091 20 14 20H12Z" fill="#108EE9"/>
    <path d="M24 32L28 16H32L36 32H32L31.2 29H28.8L28 32H24ZM29.2 26H30.8L30 20L29.2 26Z" fill="white"/>
    <path d="M38 16H42V32H38V16Z" fill="white"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 24
})
</script>

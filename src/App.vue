<script setup lang="ts">
import { onMounted } from 'vue'
import nprogress from 'nprogress'

onMounted(() => {
  nprogress.configure({
    showSpinner: false
  })
})
</script>

<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import nprogress from 'nprogress'

onMounted(() => {
  nprogress.configure({
    showSpinner: false
  })

  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.body.classList.add('is-standalone')
  }
})
</script>

<template>
  <router-view />
</template>

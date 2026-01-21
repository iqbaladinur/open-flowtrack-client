<script setup lang="ts">
import { onMounted } from 'vue'
import nprogress from 'nprogress'
import ReloadPWA from './components/shared/ReloadPWA.vue';
import Toast from './components/ui/Toast.vue';

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
  <ReloadPWA />
  <Toast />
</template>

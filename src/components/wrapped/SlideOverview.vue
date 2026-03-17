<template>
  <div class="slide bg-gradient-to-br from-[#0a0a2e] to-[#0d0d3d] flex flex-col justify-center px-8 lg:px-20 overflow-hidden">
    <!-- Decorative blur -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-lg">
      <p class="text-blue-400 text-xs font-mono tracking-widest uppercase mb-8">Year at a Glance</p>

      <!-- Big stat -->
      <div class="mb-10">
        <p class="text-white/40 text-sm mb-1">You made</p>
        <div class="flex items-end gap-2 flex-wrap">
          <span class="text-5xl sm:text-6xl lg:text-8xl font-bold text-white tabular-nums">{{ displayCount }}</span>
          <span class="text-xl sm:text-2xl text-white/60 mb-1 sm:mb-2 lg:mb-3">transactions</span>
        </div>
      </div>

      <!-- Secondary stats -->
      <div class="grid grid-cols-2 gap-6">
        <div :class="{ 'animate-fade-up': mounted }" style="animation-delay: 400ms">
          <p class="text-white/40 text-xs mb-1">Active days</p>
          <p class="text-2xl font-bold text-blue-300">{{ data.overview.activeDays }}</p>
          <p class="text-white/30 text-xs mt-1">days you recorded</p>
        </div>
        <div :class="{ 'animate-fade-up': mounted }" style="animation-delay: 600ms">
          <p class="text-white/40 text-xs mb-1">Most used wallet</p>
          <p class="text-xl font-bold text-blue-300 truncate">{{ data.overview.topWalletName }}</p>
          <p class="text-white/30 text-xs mt-1">your go-to account</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { WrappedData } from '@/composables/useWrappedData'

const props = defineProps<{ data: WrappedData; config: any }>()

const mounted = ref(false)
const displayCount = ref(0)

function countUp(target: number, duration = 1200) {
  const start = performance.now()
  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    displayCount.value = Math.round(ease * target)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  setTimeout(() => {
    mounted.value = true
    countUp(props.data.overview.totalTransactions)
  }, 100)
})
</script>

<style scoped>
.slide { position: absolute; inset: 0; }

.animate-fade-up {
  animation: fade-up 0.6s ease forwards;
  opacity: 0;
}
@keyframes fade-up {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
</style>

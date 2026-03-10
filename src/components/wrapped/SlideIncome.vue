<template>
  <div class="slide bg-gradient-to-br from-[#061a0e] to-[#0a2918] flex flex-col justify-center px-8 lg:px-20 overflow-hidden">
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-lg">
      <p class="text-emerald-400 text-xs font-mono tracking-widest uppercase mb-8">Income</p>

      <p class="text-white/40 text-sm mb-2">This year, you earned</p>
      <p class="text-5xl lg:text-6xl font-bold text-emerald-400 leading-tight mb-2 tabular-nums">
        {{ displayAmount }}
      </p>
      <p class="text-white/30 text-sm mb-10">total income in {{ data.period.year }}</p>

      <div class="grid grid-cols-2 gap-6">
        <div :class="{ 'animate-fade-up': mounted }" style="animation-delay: 500ms">
          <p class="text-white/40 text-xs mb-1">Best month</p>
          <p class="text-3xl font-bold text-emerald-300">{{ data.income.peakMonth }}</p>
          <p class="text-white/30 text-xs mt-1">{{ config.formatCurrency(data.income.peakAmount) }}</p>
        </div>
        <div :class="{ 'animate-fade-up': mounted }" style="animation-delay: 700ms">
          <p class="text-white/40 text-xs mb-1">Monthly avg</p>
          <p class="text-2xl font-bold text-emerald-300">
            {{ config.formatCurrency(data.income.total / 12) }}
          </p>
          <p class="text-white/30 text-xs mt-1">per month</p>
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
const displayAmount = ref(props.config.formatCurrency(0))

function countUpCurrency(target: number, duration = 1500) {
  const start = performance.now()
  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    displayAmount.value = props.config.formatCurrency(Math.round(ease * target))
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  setTimeout(() => {
    mounted.value = true
    countUpCurrency(props.data.income.total)
  }, 100)
})
</script>

<style scoped>
.slide { position: absolute; inset: 0; }
.animate-fade-up { animation: fade-up 0.6s ease forwards; opacity: 0; }
@keyframes fade-up {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
</style>

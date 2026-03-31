<template>
  <div class="slide bg-gradient-to-br from-[#1a0608] to-[#2a0a0e] flex flex-col justify-center px-8 lg:px-20 overflow-hidden">
    <div class="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-lg">
      <p class="text-red-400 text-xs font-mono tracking-widest uppercase mb-8">Spending</p>

      <p class="text-white/40 text-sm mb-2">And you spent</p>
      <p
        class="font-bold text-red-400 leading-tight mb-2 tabular-nums break-all"
        :class="amountSizeClass"
      >
        {{ displayAmount }}
      </p>
      <p class="text-white/30 text-sm mb-10">in total expenses</p>

      <div class="grid grid-cols-2 gap-6">
        <!-- Saving rate -->
        <div :style="{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease', transitionDelay: '400ms' }">
          <p class="text-white/40 text-xs mb-2">Saving rate</p>
          <div class="flex items-end gap-2 mb-1">
            <p
              class="text-3xl font-bold tabular-nums"
              :class="savingRateColor"
            >
              {{ data.expense.savingRate.toFixed(1) }}%
            </p>
          </div>
          <div class="w-full bg-white/10 rounded-full h-1.5 mt-2">
            <div
              class="h-full rounded-full transition-all duration-1000"
              :class="savingRateBarColor"
              :style="{ width: mounted ? Math.max(0, Math.min(100, data.expense.savingRate)) + '%' : '0%' }"
            />
          </div>
          <p class="text-white/30 text-xs mt-2">
            {{ savingRateLabel }}
          </p>
        </div>

        <!-- Busiest day -->
        <div :style="{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease', transitionDelay: '600ms' }">
          <p class="text-white/40 text-xs mb-1">Most expenses on</p>
          <p class="text-xl font-bold text-orange-300">{{ data.expense.busiestDayOfWeek }}</p>
          <p class="text-white/30 text-xs mt-1">{{ data.expense.busiestDayCount }} transactions</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { WrappedData } from '@/composables/useWrappedData'

const props = defineProps<{ data: WrappedData; config: any }>()

const mounted = ref(false)
const displayAmount = ref(props.config.formatCurrency(0))

const amountSizeClass = computed(() => {
  const formatted = props.config.formatCurrency(props.data.expense.total)
  if (formatted.length > 18) return 'text-xl sm:text-2xl lg:text-3xl'
  if (formatted.length > 15) return 'text-2xl sm:text-3xl lg:text-4xl'
  if (formatted.length > 12) return 'text-3xl sm:text-4xl lg:text-5xl'
  if (formatted.length > 9)  return 'text-4xl sm:text-5xl lg:text-6xl'
  return 'text-5xl sm:text-6xl lg:text-7xl'
})

const savingRateColor = computed(() => {
  const r = props.data.expense.savingRate
  if (r >= 30) return 'text-emerald-400'
  if (r >= 15) return 'text-yellow-400'
  return 'text-red-400'
})

const savingRateBarColor = computed(() => {
  const r = props.data.expense.savingRate
  if (r >= 30) return 'bg-emerald-500'
  if (r >= 15) return 'bg-yellow-500'
  return 'bg-red-500'
})

const savingRateLabel = computed(() => {
  const r = props.data.expense.savingRate
  if (r >= 30) return 'Great job!'
  if (r >= 15) return 'Decent, keep it up'
  if (r >= 0) return 'Room to improve'
  return 'Spent more than earned'
})

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
    countUpCurrency(props.data.expense.total)
  }, 100)
})
</script>

<style scoped>
.slide { position: absolute; inset: 0; }
</style>

<template>
  <div class="slide bg-gradient-to-br from-[#001a1f] to-[#002a30] flex flex-col justify-center px-8 lg:px-20 overflow-hidden">
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-lg w-full">
      <p class="text-teal-400 text-xs font-mono tracking-widest uppercase mb-6">Month by Month</p>

      <!-- Best / Worst month callout -->
      <div class="flex gap-6 mb-8" :class="{ 'animate-fade-up': mounted }">
        <div>
          <p class="text-white/30 text-xs mb-1">Best month</p>
          <p class="text-xl font-bold text-teal-300">{{ bestMonth.label }}</p>
          <p class="text-white/40 text-xs">+{{ config.formatCurrency(bestMonth.net) }}</p>
        </div>
        <div v-if="worstMonth.net < 0">
          <p class="text-white/30 text-xs mb-1">Toughest month</p>
          <p class="text-xl font-bold text-red-400">{{ worstMonth.label }}</p>
          <p class="text-white/40 text-xs">{{ config.formatCurrency(worstMonth.net) }}</p>
        </div>
      </div>

      <!-- Bar chart -->
      <div class="flex items-end gap-1.5 h-28 w-full">
        <div
          v-for="(m, i) in activeMonths"
          :key="m.month"
          class="flex-1 flex flex-col items-center gap-1"
        >
          <!-- Net bar -->
          <div class="w-full flex flex-col justify-end" style="height: 88px">
            <div
              class="w-full rounded-sm transition-all duration-700"
              :class="m.net >= 0 ? 'bg-teal-500/80' : 'bg-red-500/80'"
              :style="{
                height: mounted ? barHeight(m.net) + 'px' : '2px',
                transitionDelay: `${i * 50}ms`,
                minHeight: '2px',
              }"
            />
          </div>
          <!-- Month label -->
          <span
            class="text-white/30 font-mono leading-none"
            :style="{ fontSize: '9px' }"
          >
            {{ m.label.slice(0, 1) }}
          </span>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex gap-4 mt-4">
        <div class="flex items-center gap-1.5">
          <div class="w-2 h-2 rounded-sm bg-teal-500" />
          <span class="text-white/30 text-xs">Positive</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="w-2 h-2 rounded-sm bg-red-500" />
          <span class="text-white/30 text-xs">Negative</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { WrappedData, MonthSummary } from '@/composables/useWrappedData'

const props = defineProps<{ data: WrappedData; config: any }>()

const mounted = ref(false)

// Only show months that have any activity
const activeMonths = computed(() =>
  props.data.monthly.filter(m => m.income > 0 || m.expense > 0).length >= 3
    ? props.data.monthly
    : props.data.monthly,
)

const maxAbsNet = computed(() =>
  Math.max(...props.data.monthly.map(m => Math.abs(m.net)), 1),
)

function barHeight(net: number, maxH = 80): number {
  return Math.max(2, (Math.abs(net) / maxAbsNet.value) * maxH)
}

const bestMonth = computed(() =>
  props.data.monthly.reduce(
    (best: MonthSummary, m: MonthSummary) => (m.net > best.net ? m : best),
    props.data.monthly[0],
  ),
)

const worstMonth = computed(() =>
  props.data.monthly.reduce(
    (worst: MonthSummary, m: MonthSummary) => (m.net < worst.net ? m : worst),
    props.data.monthly[0],
  ),
)

onMounted(() => setTimeout(() => (mounted.value = true), 100))
</script>

<style scoped>
.slide { position: absolute; inset: 0; }
.animate-fade-up { animation: fade-up 0.5s ease forwards; opacity: 0; }
@keyframes fade-up {
  from { transform: translateY(12px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
</style>

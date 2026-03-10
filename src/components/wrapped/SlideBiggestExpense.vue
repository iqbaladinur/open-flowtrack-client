<template>
  <div class="slide bg-gradient-to-br from-[#1a0f00] to-[#2a1800] flex flex-col justify-center px-8 lg:px-20 overflow-hidden">
    <div class="absolute top-0 left-0 w-96 h-96 bg-amber-600/8 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-lg">
      <p class="text-amber-400 text-xs font-mono tracking-widest uppercase mb-8">Biggest Move</p>

      <template v-if="data.biggestExpense">
        <p class="text-white/40 text-sm mb-2">Your single biggest expense was</p>

        <p
          class="font-bold text-amber-400 leading-none mb-4 tabular-nums"
          :class="amountSizeClass"
          :style="{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'scale(0.8)', transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }"
        >
          {{ config.formatCurrency(data.biggestExpense.amount) }}
        </p>

        <div class="space-y-4 mt-8" :class="{ 'animate-fade-up': mounted }" style="animation-delay: 400ms">
          <div class="flex gap-8">
            <div>
              <p class="text-white/30 text-xs mb-1">Category</p>
              <p class="text-white text-base font-medium">{{ data.biggestExpense.categoryName }}</p>
            </div>
            <div>
              <p class="text-white/30 text-xs mb-1">Date</p>
              <p class="text-white text-base font-medium">{{ formattedDate }}</p>
            </div>
          </div>

          <div v-if="data.biggestExpense.note">
            <p class="text-white/30 text-xs mb-1">Note</p>
            <p class="text-white/80 text-sm italic">"{{ data.biggestExpense.note }}"</p>
          </div>
        </div>
      </template>

      <template v-else>
        <p class="text-white/40 text-lg">No expenses recorded this year.</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { WrappedData } from '@/composables/useWrappedData'

const props = defineProps<{ data: WrappedData; config: any }>()

const mounted = ref(false)

const formattedDate = computed(() => {
  if (!props.data.biggestExpense) return ''
  return new Date(props.data.biggestExpense.date).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
})

// Shrink font for very large numbers
const amountSizeClass = computed(() => {
  const formatted = props.config.formatCurrency(props.data.biggestExpense?.amount ?? 0)
  if (formatted.length > 18) return 'text-xl sm:text-2xl lg:text-3xl'
  if (formatted.length > 15) return 'text-2xl sm:text-3xl lg:text-4xl'
  if (formatted.length > 12) return 'text-3xl sm:text-4xl lg:text-5xl'
  if (formatted.length > 9)  return 'text-4xl sm:text-5xl lg:text-6xl'
  return 'text-5xl sm:text-6xl lg:text-7xl'
})

onMounted(() => setTimeout(() => (mounted.value = true), 100))
</script>

<style scoped>
.slide { position: absolute; inset: 0; }
.animate-fade-up { animation: fade-up 0.6s ease forwards; opacity: 0; }
@keyframes fade-up {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
</style>

<template>
  <div class="slide bg-[#0b0b18] flex flex-col items-center justify-center text-center px-8 overflow-hidden">
    <!-- Animated rings -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="ring ring-1" />
      <div class="ring ring-2" />
      <div class="ring ring-3" />
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center gap-6">
      <div
        class="w-20 h-20 rounded-2xl bg-green-500 border border-emerald-500/40 flex items-center justify-center"
        :class="{ 'animate-pop': mounted }"
      >
        <TrendingUp class="w-10 h-10 text-white" />
      </div>

      <div :class="{ 'animate-fade-up': mounted }" style="animation-delay: 200ms">
        <p class="text-emerald-400 text-sm font-mono tracking-widest uppercase mb-2">FlowTrack</p>
        <h1 class="text-4xl lg:text-6xl font-bold text-white leading-tight">
          Your {{ data.period.year }}<br />
          <span class="text-emerald-400">Wrapped</span>
        </h1>
      </div>

      <p
        class="text-white/50 text-sm lg:text-base max-w-xs"
        :class="{ 'animate-fade-up': mounted }"
        style="animation-delay: 400ms"
      >
        A year of financial decisions, habits, and growth — all in one place.
      </p>

      <div
        class="flex items-center gap-2 text-white/30 text-xs"
        :class="{ 'animate-fade-up': mounted }"
        style="animation-delay: 600ms"
      >
        <span>Tap anywhere to begin</span>
        <ChevronRight class="w-3.5 h-3.5" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrendingUp, ChevronRight } from 'lucide-vue-next'
import type { WrappedData } from '@/composables/useWrappedData'

defineProps<{ data: WrappedData; config: any }>()

const mounted = ref(false)
onMounted(() => setTimeout(() => (mounted.value = true), 50))
</script>

<style scoped>
.slide { position: absolute; inset: 0; }

.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(52, 211, 153, 0.08);
  animation: pulse-ring 4s ease-in-out infinite;
}
.ring-1 { width: 300px; height: 300px; }
.ring-2 { width: 500px; height: 500px; animation-delay: 1s; }
.ring-3 { width: 700px; height: 700px; animation-delay: 2s; }

@keyframes pulse-ring {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50%       { transform: scale(1.05); opacity: 1; }
}

.animate-pop {
  animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes pop {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.animate-fade-up {
  animation: fade-up 0.6s ease forwards;
  opacity: 0;
}
@keyframes fade-up {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
</style>

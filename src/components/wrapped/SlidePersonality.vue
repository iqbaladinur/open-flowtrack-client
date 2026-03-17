<template>
  <div class="slide flex flex-col justify-center px-8 lg:px-20 overflow-hidden" :style="{ background: bgGradient }">
    <!-- Particles -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        v-for="p in particles"
        :key="p.id"
        class="absolute rounded-full"
        :style="p.style"
      />
    </div>

    <div class="relative z-10 max-w-lg">
      <p class="text-white/40 text-xs font-mono tracking-widest uppercase mb-8">You are...</p>

      <!-- Icon reveal -->
      <div
        class="text-8xl mb-6 select-none"
        :style="{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'scale(1)' : 'scale(0.2)',
          transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }"
      >
        {{ data.personality.icon }}
      </div>

      <!-- Title -->
      <h2
        class="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
        :style="{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(20px)',
          transition: 'all 0.6s ease 0.3s',
        }"
      >
        {{ data.personality.label }}
      </h2>

      <!-- Description -->
      <p
        class="text-white/60 text-base lg:text-lg leading-relaxed mb-8"
        :style="{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(20px)',
          transition: 'all 0.6s ease 0.5s',
        }"
      >
        {{ data.personality.description }}
      </p>

      <!-- Traits -->
      <div
        class="flex flex-wrap gap-2"
        :style="{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 0.7s',
        }"
      >
        <span
          v-for="trait in data.personality.traits"
          :key="trait"
          class="text-xs px-3 py-1 rounded-full bg-white/10 text-white/60 font-mono border border-white/10"
        >
          {{ trait }}
        </span>
      </div>

      <!-- Closing note -->
      <p
        class="text-white/20 text-xs mt-10"
        :style="{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 1s',
        }"
      >
        FlowTrack · {{ data.period.year }} Financial Wrapped
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { WrappedData } from '@/composables/useWrappedData'

const props = defineProps<{ data: WrappedData; config: any }>()

const mounted = ref(false)

const bgGradient = computed(() => {
  const label = props.data.personality.label
  if (label.includes('Disciplined')) return 'linear-gradient(135deg, #0a1f0a, #0d3020)'
  if (label.includes('Smart'))       return 'linear-gradient(135deg, #0a0f1f, #0d1a35)'
  if (label.includes('Steady'))      return 'linear-gradient(135deg, #0f0a1f, #1a0d35)'
  if (label.includes('Meticulous'))  return 'linear-gradient(135deg, #001a1a, #002828)'
  return 'linear-gradient(135deg, #1a0a0f, #2a0a18)' // Free Spirit
})

// Decorative floating particles
const particles = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({
    id: i,
    style: {
      width: `${4 + (i % 4) * 3}px`,
      height: `${4 + (i % 4) * 3}px`,
      top: `${10 + i * 7}%`,
      left: `${5 + (i * 17) % 90}%`,
      background: 'rgba(255,255,255,0.04)',
      animation: `float-${i % 3} ${4 + (i % 3)}s ease-in-out infinite`,
      animationDelay: `${i * 0.4}s`,
    },
  })),
)

onMounted(() => setTimeout(() => (mounted.value = true), 100))
</script>

<style scoped>
.slide { position: absolute; inset: 0; }

@keyframes float-0 {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
}
@keyframes float-1 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-14px) rotate(5deg); }
}
@keyframes float-2 {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}
</style>

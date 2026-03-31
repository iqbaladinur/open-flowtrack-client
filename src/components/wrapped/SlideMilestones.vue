<template>
  <div class="slide bg-gradient-to-br from-[#1a1200] to-[#2a1e00] flex flex-col justify-center px-8 lg:px-20 overflow-hidden">
    <div class="absolute top-0 right-0 w-72 h-72 bg-yellow-500/8 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-lg">
      <p class="text-yellow-400 text-xs font-mono tracking-widest uppercase mb-8">Milestones</p>

      <!-- Trophy section -->
      <div
        class="flex items-center gap-5 mb-10"
        :style="{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)', transition: 'all 0.6s ease' }"
      >
        <div class="text-6xl">🏆</div>
        <div>
          <p class="text-white/40 text-sm mb-1">You achieved</p>
          <p class="text-5xl font-bold text-yellow-400">
            {{ data.milestones.achievedCount }}
            <span class="text-2xl text-white/40">/ {{ data.milestones.totalCount }}</span>
          </p>
          <p class="text-white/30 text-sm">milestones completed</p>
        </div>
      </div>

      <!-- Progress ring or bar -->
      <div
        v-if="data.milestones.totalCount > 0"
        class="mb-8"
        :style="{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease', transitionDelay: '300ms' }"
      >
        <div class="flex justify-between text-xs text-white/30 mb-1">
          <span>Completion rate</span>
          <span>{{ completionRate.toFixed(0) }}%</span>
        </div>
        <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            class="h-full bg-yellow-500 rounded-full transition-all duration-1000"
            :style="{ width: mounted ? completionRate + '%' : '0%', transitionDelay: '400ms' }"
          />
        </div>
      </div>

      <!-- Nearest in-progress -->
      <div
        v-if="data.milestones.nearestName"
        :style="{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease', transitionDelay: '500ms' }"
      >
        <p class="text-white/30 text-xs mb-2">Almost there →</p>
        <div class="bg-white/5 border border-white/10 rounded-xl p-4">
          <p class="text-white font-medium mb-2">{{ data.milestones.nearestName }}</p>
          <div class="flex justify-between text-xs text-white/40 mb-1">
            <span>Progress</span>
            <span>{{ data.milestones.nearestProgress.toFixed(0) }}%</span>
          </div>
          <div class="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              class="h-full bg-yellow-400 rounded-full transition-all duration-1000"
              :style="{ width: mounted ? data.milestones.nearestProgress + '%' : '0%', transitionDelay: '700ms' }"
            />
          </div>
        </div>
      </div>

      <p
        v-else-if="data.milestones.totalCount === 0"
        class="text-white/30 text-sm italic"
        :style="{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease', transitionDelay: '300ms' }"
      >
        No milestones set yet. Create your first goal!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { WrappedData } from '@/composables/useWrappedData'

const props = defineProps<{ data: WrappedData; config: any }>()

const mounted = ref(false)

const completionRate = computed(() => {
  if (props.data.milestones.totalCount === 0) return 0
  return (props.data.milestones.achievedCount / props.data.milestones.totalCount) * 100
})

onMounted(() => setTimeout(() => (mounted.value = true), 100))
</script>

<style scoped>
.slide { position: absolute; inset: 0; }
</style>

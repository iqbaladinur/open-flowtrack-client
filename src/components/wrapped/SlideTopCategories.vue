<template>
  <div class="slide bg-gradient-to-br from-[#0a0620] to-[#130a30] flex flex-col justify-center px-8 lg:px-20 overflow-hidden">
    <div class="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-lg w-full">
      <p class="text-purple-400 text-xs font-mono tracking-widest uppercase mb-8">Top Categories</p>
      <p class="text-white/40 text-sm mb-6">Where your money went most</p>

      <div class="space-y-5">
        <div
          v-for="(cat, i) in data.topCategories"
          :key="cat.category_id"
          :class="{ 'animate-fade-up': mounted }"
          :style="{ animationDelay: `${i * 120}ms` }"
        >
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center gap-2">
              <span class="text-white/30 text-xs w-4">{{ i + 1 }}</span>
              <span class="text-white text-sm font-medium">{{ cat.name }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-white/40 text-xs">{{ cat.count }}x</span>
              <span class="text-white text-sm font-semibold tabular-nums">
                {{ config.formatCurrency(cat.total) }}
              </span>
            </div>
          </div>
          <!-- Bar -->
          <div class="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000"
              :style="{
                width: mounted ? cat.percentage + '%' : '0%',
                background: cat.color,
                transitionDelay: `${i * 120 + 200}ms`,
              }"
            />
          </div>
          <p class="text-white/30 text-xs mt-1">{{ cat.percentage.toFixed(1) }}% of total spending</p>
        </div>

        <p v-if="data.topCategories.length === 0" class="text-white/40 text-sm italic">
          No expense categories found.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { WrappedData } from '@/composables/useWrappedData'

defineProps<{ data: WrappedData; config: any }>()

const mounted = ref(false)
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

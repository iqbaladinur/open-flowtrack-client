<template>
  <!-- Fullscreen takeover — no AppLayout -->
  <div class="wrapped-root" ref="rootEl">

    <!-- Loading / error state -->
    <div v-if="loading || (error && !data)" class="wrapped-root flex flex-col items-center justify-center gap-4 bg-[#0b0b18]">
      <div v-if="loading" class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p class="text-emerald-400 text-sm font-mono">Loading your year...</p>
      </div>
      <div v-else-if="error" class="text-center px-8">
        <p class="text-red-400 text-sm">{{ error }}</p>
        <button @click="loadData" class="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white text-sm">Retry</button>
      </div>
    </div>

    <!-- Slides -->
    <template v-else-if="data">
      <!-- Progress bars -->
      <div class="fixed top-0 left-0 right-0 z-50 flex gap-1 p-3 pt-safe">
        <div
          v-for="(_, i) in slides"
          :key="i"
          class="h-0.5 flex-1 rounded-full overflow-hidden bg-white/20"
        >
          <div
            class="h-full bg-white rounded-full transition-all"
            :style="{
              width: i < currentSlide ? '100%' : i === currentSlide ? slideProgress + '%' : '0%',
              transitionDuration: i === currentSlide ? '100ms' : '300ms',
            }"
          />
        </div>
      </div>

      <!-- Close button -->
      <button
        @click="router.back()"
        class="fixed top-4 right-4 z-50 mt-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
      >
        <X class="w-4 h-4" />
      </button>

      <!-- Year picker -->
      <div class="fixed top-7 left-4 z-50">
        <button
          @click.stop="showYearPicker = !showYearPicker"
          class="flex items-center gap-1 text-xs font-mono text-white/40 hover:text-white/70 transition-colors"
        >
          {{ selectedYear }}
          <ChevronDown class="w-3 h-3" :class="{ 'rotate-180': showYearPicker }" style="transition: transform 0.2s" />
        </button>
        <Transition name="dropdown">
          <div
            v-if="showYearPicker"
            class="absolute top-6 left-0 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden py-1 min-w-[80px]"
          >
            <button
              v-for="yr in availableYears"
              :key="yr"
              @click.stop="changeYear(yr)"
              class="w-full text-left px-4 py-2 text-xs font-mono transition-colors"
              :class="yr === selectedYear ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'"
            >
              {{ yr }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Slide area — tap zones are layered above content but below UI chrome -->
      <div ref="slideAreaEl" class="absolute inset-0">
        <Transition :name="transitionName" mode="out-in">
          <component
            :is="slides[currentSlide]"
            :key="currentSlide"
            :data="data"
            :config="configStore"
            class="absolute inset-0"
          />
        </Transition>
      </div>

      <!-- Tap zones (invisible, on top of slides) -->
      <div class="fixed inset-0 z-40 flex" :class="{ 'pointer-events-none': sharing }">
        <div class="w-1/3 h-full cursor-pointer" @click="prevSlide" />
        <div class="w-2/3 h-full cursor-pointer" @click="nextSlide" />
      </div>

      <!-- Share button (always visible, bottom-right) -->
      <button
        @click.stop="shareSlide"
        :disabled="sharing"
        class="fixed bottom-6 right-4 lg:bottom-8 lg:right-8 z-50 flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-medium transition-colors backdrop-blur-sm border border-white/10 disabled:opacity-50"
      >
        <component :is="sharing ? Loader2 : Share2" class="w-3.5 h-3.5" :class="{ 'animate-spin': sharing }" />
        <span>{{ sharing ? 'Saving...' : 'Share' }}</span>
      </button>

      <!-- Desktop navigation (above tap zones) -->
      <div class="hidden lg:flex fixed bottom-10 left-0 right-0 z-50 justify-center items-center gap-6 pointer-events-none">
        <button
          @click.stop="prevSlide"
          class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-20 pointer-events-auto"
          :disabled="currentSlide === 0"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <span class="text-white/30 text-xs font-mono">{{ currentSlide + 1 }} / {{ slides.length }}</span>
        <button
          @click.stop="nextSlide"
          class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors pointer-events-auto"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>
    </template>

    <!-- Off-screen capture target: rendered only during share, behind all UI -->
    <div
      v-if="sharing && data"
      ref="captureEl"
      class="fixed inset-0 pointer-events-none overflow-hidden"
      style="z-index:-9999;"
      aria-hidden="true"
    >
      <WrappedCaptureView
        :data="data"
        :config="configStore"
        :slide-index="currentSlide"
        style="position:absolute;inset:0;"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useSwipe } from '@vueuse/core'
import { X, ChevronLeft, ChevronRight, ChevronDown, Share2, Loader2 } from 'lucide-vue-next'
import html2canvas from 'html2canvas'
import { useWrappedData, useWrappedAvailability } from '@/composables/useWrappedData'
import { useConfigStore } from '@/stores/config'

import SlideIntro from '@/components/wrapped/SlideIntro.vue'
import SlideOverview from '@/components/wrapped/SlideOverview.vue'
import SlideIncome from '@/components/wrapped/SlideIncome.vue'
import SlideExpense from '@/components/wrapped/SlideExpense.vue'
import SlideTopCategories from '@/components/wrapped/SlideTopCategories.vue'
import SlideBiggestExpense from '@/components/wrapped/SlideBiggestExpense.vue'
import SlideMonthly from '@/components/wrapped/SlideMonthly.vue'
import SlideMilestones from '@/components/wrapped/SlideMilestones.vue'
import SlidePersonality from '@/components/wrapped/SlidePersonality.vue'
import WrappedCaptureView from '@/components/wrapped/WrappedCaptureView.vue'

const slides = [
  markRaw(SlideIntro),
  markRaw(SlideOverview),
  markRaw(SlideIncome),
  markRaw(SlideExpense),
  markRaw(SlideTopCategories),
  markRaw(SlideBiggestExpense),
  markRaw(SlideMonthly),
  markRaw(SlideMilestones),
  markRaw(SlidePersonality),
]

const router = useRouter()
const configStore = useConfigStore()
const { defaultYear } = useWrappedAvailability()
const { loading, error, data, compute } = useWrappedData()

const rootEl = ref<HTMLElement | null>(null)
const slideAreaEl = ref<HTMLElement | null>(null) // used for swipe target
const captureEl = ref<HTMLElement | null>(null)
const currentSlide = ref(0)
const transitionName = ref('slide-left')
const slideProgress = ref(0)
const sharing = ref(false)
const showYearPicker = ref(false)
const selectedYear = ref(defaultYear.value)

const availableYears = computed(() => {
  const current = new Date().getFullYear()
  const years: number[] = []
  for (let y = current; y >= 2020; y--) years.push(y)
  return years
})

const SLIDE_DURATION = 10_000
let progressTimer: ReturnType<typeof setInterval> | null = null

function startProgress() {
  slideProgress.value = 0
  clearInterval(progressTimer!)
  const step = 100 / (SLIDE_DURATION / 100)
  progressTimer = setInterval(() => {
    slideProgress.value = Math.min(slideProgress.value + step, 100)
    if (slideProgress.value >= 100) nextSlide()
  }, 100)
}

function nextSlide() {
  if (currentSlide.value < slides.length - 1) {
    transitionName.value = 'slide-left'
    currentSlide.value++
    startProgress()
  } else {
    router.back()
  }
}

function prevSlide() {
  if (currentSlide.value > 0) {
    transitionName.value = 'slide-right'
    currentSlide.value--
    startProgress()
  }
}

useSwipe(rootEl, {
  onSwipeEnd(_, direction) {
    if (direction === 'left') nextSlide()
    if (direction === 'right') prevSlide()
  },
  threshold: 50,
})

async function changeYear(year: number) {
  showYearPicker.value = false
  if (year === selectedYear.value) return
  selectedYear.value = year
  currentSlide.value = 0
  clearInterval(progressTimer!)
  await compute(year)
  startProgress()
}

async function shareSlide() {
  if (sharing.value) return
  sharing.value = true
  clearInterval(progressTimer!)

  // Wait for Vue to render the WrappedCaptureView into captureEl
  await nextTick()
  await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())))

  if (!captureEl.value) {
    sharing.value = false
    startProgress()
    return
  }

  try {
    const canvas = await html2canvas(captureEl.value, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0b0b18',
      scale: 2,
      scrollX: 0,
      scrollY: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    })

    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/png'),
    )

    const filename = `flowtrack-${data.value?.period.year}-wrapped-slide${currentSlide.value + 1}.png`
    const file = new File([blob], filename, { type: 'image/png' })

    let shared = false
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: `FlowTrack ${data.value?.period.year} Wrapped`,
          text: 'Check out my financial year in review!',
          files: [file],
        })
        shared = true
      } catch (err) {
        // AbortError = user dismissed the share sheet — treat as success (no fallback)
        if (err instanceof Error && err.name === 'AbortError') shared = true
        // NotAllowedError (gesture timeout) or anything else → fall through to download
      }
    }

    if (!shared) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
  } catch (err) {
    console.warn('[FlowTrack] share/capture error:', err)
  } finally {
    sharing.value = false
    startProgress()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide() }
  if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide() }
  if (e.key === 'Escape') {
    if (showYearPicker.value) { showYearPicker.value = false; return }
    router.back()
  }
}

function onDocClick() {
  if (showYearPicker.value) showYearPicker.value = false
}

const loadData = async () => {
  await compute(selectedYear.value)
  startProgress()
}

onMounted(() => {
  loadData()
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocClick)
})

onUnmounted(() => {
  clearInterval(progressTimer!)
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocClick)
})
</script>

<style scoped>
.wrapped-root {
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  background: #0b0b18;
}

.pt-safe {
  padding-top: max(12px, env(safe-area-inset-top));
}

/* Slide left (forward) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s;
  position: absolute;
  inset: 0;
}
.slide-left-enter-from { transform: translateX(100%); opacity: 0; }
.slide-left-leave-to   { transform: translateX(-30%); opacity: 0; }

/* Slide right (back) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s;
  position: absolute;
  inset: 0;
}
.slide-right-enter-from { transform: translateX(-100%); opacity: 0; }
.slide-right-leave-to   { transform: translateX(30%); opacity: 0; }

/* Year picker dropdown */
.dropdown-enter-active,
.dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from,
.dropdown-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>

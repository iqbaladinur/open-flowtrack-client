<template>
  <div class="card p-4">
    <div class="flex justify-between items-start sm:items-center mb-3 flex-col sm:flex-row gap-3 sm:gap-0">
      <div>
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
          Expense Hotspots
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Frequent categories in this period.
        </p>
      </div>
      <div class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-full sm:w-auto">
        <button @click="sizeBy = 'total'" :class="['btn btn-xs flex-1 lg:flex-auto btn-borderless px-2', sizeBy === 'total' ? 'bg-white dark:bg-gray-600 shadow' : '']">By Amount</button>
        <button @click="sizeBy = 'frequency'" :class="['btn btn-xs flex-1 lg:flex-auto btn-borderless px-2', sizeBy === 'frequency' ? 'bg-white dark:bg-gray-600 shadow' : '']">By Frequency</button>
      </div>
    </div>

    <div v-if="analysisData.length === 0" class="text-center py-8 flex flex-col items-center justify-center min-h-[300px]">
      <Activity class="w-10 h-10 text-gray-400 mx-auto mb-2" />
      <p class="text-gray-500 dark:text-gray-400 text-sm">No expense data to analyze.</p>
    </div>

    <div v-else class="relative min-h-[300px]" ref="container">
      <!-- Bubble Cloud -->
      <div v-show="!selectedCategory" class="absolute inset-0">
        <button 
          v-for="bubble in bubbles" 
          :key="bubble.name"
          @click="selectCategory(bubble)"
          class="absolute rounded-full flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none"
          :style="{ 
            width: bubble.size + 'px', 
            height: bubble.size + 'px',
            top: (bubble.y - bubble.radius) + 'px',
            left: (bubble.x - bubble.radius) + 'px',
            backgroundColor: bubble.color + '20',
            color: bubble.color,
            boxShadow: `0 0 0 2px ${bubble.color} inset`,
            zIndex: Math.floor(bubble.size)
          }"
        >
          <component :is="getIcon(bubble.icon)" :style="{ width: bubble.size / 3.5 + 'px', height: bubble.size / 3.5 + 'px' }" />
          <span 
            v-if="bubble.size > 60"
            class="font-medium mt-1 truncate w-full px-1"
            :style="{ fontSize: Math.max(8, bubble.size / 8) + 'px' }"
          >
            {{ bubble.name }}
          </span>
        </button>
      </div>

      <!-- Details View -->
      <div v-if="selectedCategoryStats" class="absolute inset-0 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
        <div class="w-full sm:max-w-xs bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col h-full sm:h-auto">
            <div>
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                  <div 
                    class="size-10 rounded-xl flex items-center justify-center" 
                    :style="{ backgroundColor: selectedCategoryStats.color + '20' }"
                  >
                    <component :is="getIcon(selectedCategoryStats.icon)" class="size-5" :style="{ color: selectedCategoryStats.color }" />
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800 dark:text-gray-200 text-md">{{ selectedCategoryStats.name }}</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ selectedCategoryStats.count }} transactions</p>
                  </div>
                </div>
                <button @click="selectCategory(selectedCategoryStats)" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                  <X class="size-4 text-gray-500" />
                </button>
              </div>
    
              <div class="mt-4 text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
                <p v-fit-text class="font-mono text-xl font-bold text-error-500 dark:text-error-400 break-words">{{ configStore.formatCurrency(selectedCategoryStats.total) }}</p>
              </div>
            </div>
    
            <div class="mt-auto">
                <div class="grid grid-cols-2 gap-2 text-xs mt-4">
                  <div class="text-center rounded-md py-2 px-2 bg-gray-100 dark:bg-gray-700/50">
                    <p v-fit-text class="font-mono text-gray-700 dark:text-gray-300 font-semibold">{{ configStore.formatCurrency(selectedCategoryStats.average) }}</p>
                    <p class="text-gray-500 dark:text-gray-400 capitalize text-[10px]">Avg / {{ analysisPeriod === 'period' ? 'Trx' : analysisPeriod }}</p>
                  </div>
                  <div class="text-center rounded-md py-2 px-2 bg-gray-100 dark:bg-gray-700/50">
                    <p v-fit-text class="font-mono text-gray-700 dark:text-gray-300 font-semibold">{{ configStore.formatCurrency(selectedCategoryStats.median) }}</p>
                    <p class="text-gray-500 dark:text-gray-400 text-[10px]">Median</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-full mt-3">
                  <button @click="analysisPeriod = 'daily'" :class="['btn btn-xs flex-1 lg:flex-auto btn-borderless px-2', analysisPeriod === 'daily' ? 'bg-white dark:bg-gray-600 shadow' : '']">Daily</button>
                  <button @click="analysisPeriod = 'weekly'" :class="['btn btn-xs flex-1 lg:flex-auto btn-borderless px-2', analysisPeriod === 'weekly' ? 'bg-white dark:bg-gray-600 shadow' : '']">Weekly</button>
                  <button @click="analysisPeriod = 'period'" :class="['btn btn-xs flex-1 lg:flex-auto btn-borderless px-2', analysisPeriod === 'period' ? 'bg-white dark:bg-gray-600 shadow' : '']">Period</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import type { Transaction } from '@/types/transaction';
import { useConfigStore } from '@/stores/config';
import { differenceInDays, differenceInWeeks, parseISO } from 'date-fns';
import { Activity, X } from 'lucide-vue-next';
import { getIcon } from '@/utils/icons';
import type { Directive } from 'vue';

const props = defineProps<{
  transactions: Transaction[];
  startDate: string;
  endDate: string;
}>();

const configStore = useConfigStore();

type AnalysisPeriod = 'daily' | 'weekly' | 'period';
type SizeBy = 'total' | 'frequency';

const analysisPeriod = ref<AnalysisPeriod>('daily');
const sizeBy = ref<SizeBy>('total');
const selectedCategory = ref<any>(null);

const container = ref<HTMLElement | null>(null);
const bubbles = ref<any[]>([]);
let animationFrameId: number;

// Directive to fit text within its container
const vFitText: Directive<HTMLElement> = {
  async mounted(el) {
    await nextTick();
    adjustFontSize(el);
  },
  async updated(el) {
    await nextTick();
    adjustFontSize(el);
  }
};

function adjustFontSize(el: HTMLElement) {
  // Reset to default to recalculate
  el.style.fontSize = ''; 
  
  const initialFontSize = parseFloat(getComputedStyle(el).fontSize);
  let currentSize = initialFontSize;

  // Iteratively reduce font size
  while (el.scrollWidth > el.clientWidth && currentSize > 8) {
    currentSize--;
    el.style.fontSize = `${currentSize}px`;
  }
}

const selectCategory = (category: any) => {
  if (selectedCategory.value && selectedCategory.value.name === category.name) {
    selectedCategory.value = null;
  } else {
    selectedCategory.value = category;
  }
};

watch(selectedCategory, (newValue) => {
  if (newValue === null) {
    // Resume animation
    if (!animationFrameId) {
      animate();
    }
  } else {
    // Pause animation
    cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  }
});

const selectedCategoryStats = computed(() => {
  if (!selectedCategory.value) return null;

  const { total, count, amounts } = selectedCategory.value;
  
  amounts.sort((a: number, b: number) => a - b);
  const mid = Math.floor(amounts.length / 2);
  const median = amounts.length % 2 !== 0 ? amounts[mid] : (amounts[mid - 1] + amounts[mid]) / 2;

  let average = 0;
  if (analysisPeriod.value === 'daily') {
    average = total / numberOfDays.value;
  } else if (analysisPeriod.value === 'weekly') {
    average = total / numberOfWeeks.value;
  } else { // 'period'
    average = count > 0 ? total / count : 0;
  }

  return {
    ...selectedCategory.value,
    average: average || 0,
    median: median || 0,
  };
});

const numberOfDays = computed(() => {
  if (!props.startDate || !props.endDate) return 1;
  const days = differenceInDays(parseISO(props.endDate), parseISO(props.startDate)) + 1;
  return days > 0 ? days : 1;
});

const numberOfWeeks = computed(() => {
  if (!props.startDate || !props.endDate) return 1;
  const weeks = differenceInWeeks(parseISO(props.endDate), parseISO(props.startDate));
  return weeks >= 0 ? weeks + 1 : 1;
});

const analysisData = computed(() => {
    const expenseTransactions = props.transactions.filter(t => t.type === 'expense' && t.category);
    const categoryStats = new Map<string, { name: string, color: string, icon: string, count: number, total: number, amounts: number[] }>();

    expenseTransactions.forEach(t => {
        if (t.category) {
            // @ts-ignore
            const stat = categoryStats.get(t.category.id) || { name: t.category.name, color: t.category.color, icon: t.category.icon, count: 0, total: 0, amounts: [] };
            stat.count++;
            stat.total += t.amount;
            stat.amounts.push(t.amount);
            // @ts-ignore
            categoryStats.set(t.category.id, stat);
        }
    });

    const result = Array.from(categoryStats.values()).map(stat => {
        stat.amounts.sort((a, b) => a - b);
        const mid = Math.floor(stat.amounts.length / 2);
        const median = stat.amounts.length % 2 !== 0 ? stat.amounts[mid] : (stat.amounts[mid - 1] + stat.amounts[mid]) / 2;
        let average = 0;
        if (analysisPeriod.value === 'daily') average = stat.total / numberOfDays.value;
        else if (analysisPeriod.value === 'weekly') average = stat.total / numberOfWeeks.value;
        else average = stat.count > 0 ? stat.total / stat.count : 0;
        return { ...stat, median: median || 0, average: average || 0 };
    });

    const sorted = result.sort((a, b) => b.total - a.total);
    
    if (sorted.length === 0) return [];

    const maxTotal = sorted.reduce((max, item) => Math.max(max, item.total), 0) || 1;
    const maxCount = sorted.reduce((max, item) => Math.max(max, item.count), 0) || 1;

    return sorted.map(s => {
      const sizeValue = sizeBy.value === 'total' ? s.total / maxTotal : s.count / maxCount;
      return {
        ...s,
        size: Math.max(50, Math.min(130, sizeValue * 130))
      }
    });
});

const initializeBubbles = () => {
  if (!container.value) return;
  const containerWidth = container.value.offsetWidth;
  const containerHeight = container.value.offsetHeight;

  bubbles.value = analysisData.value.map(cat => ({
    ...cat,
    x: Math.random() * (containerWidth - cat.size) + cat.size / 2,
    y: Math.random() * (containerHeight - cat.size) + cat.size / 2,
    vx: (Math.random() - 0.5), // Slower speed
    vy: (Math.random() - 0.5), // Slower speed
    radius: cat.size / 2
  }));
};

const animate = () => {
  if (!container.value || bubbles.value.length === 0) return;
  const width = container.value.offsetWidth;
  const height = container.value.offsetHeight;

  bubbles.value.forEach((b, i) => {
    b.x += b.vx;
    b.y += b.vy;

    if (b.x - b.radius < 0) { b.x = b.radius; b.vx *= -1; }
    if (b.x + b.radius > width) { b.x = width - b.radius; b.vx *= -1; }
    if (b.y - b.radius < 0) { b.y = b.radius; b.vy *= -1; }
    if (b.y + b.radius > height) { b.y = height - b.radius; b.vy *= -1; }

    for (let j = i + 1; j < bubbles.value.length; j++) {
      const other = bubbles.value[j];
      const dx = other.x - b.x;
      const dy = other.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = b.radius + other.radius;

      if (distance < minDistance) {
        const angle = Math.atan2(dy, dx);
        const overlap = minDistance - distance;
        
        b.x -= (Math.cos(angle) * overlap) / 2;
        b.y -= (Math.sin(angle) * overlap) / 2;
        other.x += (Math.cos(angle) * overlap) / 2;
        other.y += (Math.sin(angle) * overlap) / 2;

        [b.vx, other.vx] = [other.vx, b.vx];
        [b.vy, other.vy] = [other.vy, b.vy];
      }
    }
  });

  animationFrameId = requestAnimationFrame(animate);
};

watch(analysisData, () => {
  cancelAnimationFrame(animationFrameId);
  initializeBubbles();
  if (bubbles.value.length > 0) {
    animate();
  }
}, { immediate: true, deep: true });

onMounted(() => {
  setTimeout(() => {
    initializeBubbles();
    if (bubbles.value.length > 0 && !animationFrameId) {
      animate();
    }
  }, 100);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});
</script>

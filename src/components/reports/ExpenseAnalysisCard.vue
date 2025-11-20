<template>
  <div class="card p-4">
    <div class="flex justify-between items-start sm:items-center mb-3 flex-col sm:flex-row gap-3 sm:gap-0">
      <div>
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
          {{ $t('expenseAnalysis.title') }} 
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ $t('expenseAnalysis.subtitle') }}
        </p>
      </div>
      <div class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-full sm:w-auto">
        <button @click="sizeBy = 'total'" :class="['btn btn-xs flex-1 lg:flex-auto btn-borderless px-2', sizeBy === 'total' ? 'bg-white dark:bg-gray-600 shadow' : '']">{{ $t('expenseAnalysis.byAmount') }}</button>
        <button @click="sizeBy = 'frequency'" :class="['btn btn-xs flex-1 lg:flex-auto btn-borderless px-2', sizeBy === 'frequency' ? 'bg-white dark:bg-gray-600 shadow' : '']">{{ $t('expenseAnalysis.byFrequency') }}</button>
      </div>
    </div>

    <div v-if="analysisData.length === 0" class="text-center py-8 flex flex-col items-center justify-center min-h-[300px]">
      <Activity class="w-10 h-10 text-gray-400 mx-auto mb-2" />
      <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('expenseAnalysis.noData') }}</p>
    </div>

    <div v-else class="relative min-h-[300px]">
      <!-- Treemap Chart -->
      <div v-show="!selectedCategory" class="w-full rounded-lg" style="height: 400px;">
        <v-chart
          ref="chartRef"
          class="w-full h-full"
          :option="chartOption"
          autoresize
          @click="handleChartClick"
        />
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
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ selectedCategoryStats.count }} {{ $t('expenseAnalysis.transactions') }}</p>
                  </div>
                </div>
                <button @click="closeDetails" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                  <X class="size-4 text-gray-500" />
                </button>
              </div>

              <div class="mt-4 text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('expenseAnalysis.totalSpent') }}</p>
                <p class="font-mono text-xl font-bold text-error-500 dark:text-error-400 break-words">{{ configStore.formatCurrency(selectedCategoryStats.total) }}</p>
              </div>
            </div>

            <div class="mt-auto">
                <div class="grid grid-cols-2 gap-2 text-xs mt-4">
                  <div class="text-center rounded-md py-2 px-2 bg-gray-100 dark:bg-gray-700/50">
                    <p class="font-mono text-gray-700 dark:text-gray-300 font-semibold text-sm">{{ configStore.formatCurrency(selectedCategoryStats.average) }}</p>
                    <p class="text-gray-500 dark:text-gray-400 capitalize text-[10px]">{{ $t('expenseAnalysis.avg') }} / {{ analysisPeriod === 'period' ? $t('expenseAnalysis.trx') : analysisPeriod }}</p>
                  </div>
                  <div class="text-center rounded-md py-2 px-2 bg-gray-100 dark:bg-gray-700/50">
                    <p class="font-mono text-gray-700 dark:text-gray-300 font-semibold text-sm">{{ configStore.formatCurrency(selectedCategoryStats.median) }}</p>
                    <p class="text-gray-500 dark:text-gray-400 text-[10px]">{{ $t('expenseAnalysis.median') }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-full mt-3">
                  <button @click="analysisPeriod = 'daily'" :class="['btn btn-xs flex-1 lg:flex-auto btn-borderless px-2', analysisPeriod === 'daily' ? 'bg-white dark:bg-gray-600 shadow' : '']">{{ $t('expenseAnalysis.daily') }}</button>
                  <button @click="analysisPeriod = 'weekly'" :class="['btn btn-xs flex-1 lg:flex-auto btn-borderless px-2', analysisPeriod === 'weekly' ? 'bg-white dark:bg-gray-600 shadow' : '']">{{ $t('expenseAnalysis.weekly') }}</button>
                  <button @click="analysisPeriod = 'period'" :class="['btn btn-xs flex-1 lg:flex-auto btn-borderless px-2', analysisPeriod === 'period' ? 'bg-white dark:bg-gray-600 shadow' : '']">{{ $t('expenseAnalysis.period') }}</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { TreemapChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { Transaction } from '@/types/transaction';
import { useConfigStore } from '@/stores/config';
import { useThemeStore } from '@/stores/theme';
import { differenceInDays, differenceInWeeks, parseISO } from 'date-fns';
import { Activity, X } from 'lucide-vue-next';
import { getIcon } from '@/utils/icons';

// Register ECharts components
use([TreemapChart, TitleComponent, TooltipComponent, CanvasRenderer]);

const props = defineProps<{
  transactions: Transaction[];
  startDate: string;
  endDate: string;
}>();

const configStore = useConfigStore();
const themeStore = useThemeStore();

const isDark = computed(() => {
  if (themeStore.theme === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return themeStore.theme === 'dark';
});

type AnalysisPeriod = 'daily' | 'weekly' | 'period';
type SizeBy = 'total' | 'frequency';

const analysisPeriod = ref<AnalysisPeriod>('daily');
const sizeBy = ref<SizeBy>('total');
const selectedCategory = ref<any>(null);
const chartRef = ref<InstanceType<typeof VChart> | null>(null);

const closeDetails = () => {
  selectedCategory.value = null;
};

const handleChartClick = (params: any) => {
  if (params.data && params.data.categoryData) {
    selectedCategory.value = params.data.categoryData;
  }
};

const selectedCategoryStats = computed(() => {
  if (!selectedCategory.value) return null;

  const { total, count, amounts } = selectedCategory.value;

  const sortedAmounts = [...amounts].sort((a: number, b: number) => a - b);
  const mid = Math.floor(sortedAmounts.length / 2);
  const median = sortedAmounts.length % 2 !== 0 ? sortedAmounts[mid] : (sortedAmounts[mid - 1] + sortedAmounts[mid]) / 2;

  let average = 0;
  if (analysisPeriod.value === 'daily') {
    average = total / numberOfDays.value;
  } else if (analysisPeriod.value === 'weekly') {
    average = total / numberOfWeeks.value;
  } else {
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

// Function to determine if a color is light or dark
const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance using the formula
  // https://www.w3.org/TR/WCAG20/#relativeluminancedef
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#1f2937' : '#ffffff';
};

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

  return Array.from(categoryStats.values()).sort((a, b) => b.total - a.total);
});

const chartOption = computed(() => {
  const chartBg = isDark.value ? '#111827' : '#f9fafb';
  const tooltipBg = isDark.value ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark.value ? '#374151' : '#e5e7eb';
  const tooltipTextColor = isDark.value ? '#d1d5db' : '#374151';

  const treemapData = analysisData.value.map(cat => {
    const itemLabelColor = getContrastColor(cat.color);
    return {
      name: cat.name,
      value: sizeBy.value === 'total' ? cat.total : cat.count,
      itemStyle: {
        color: cat.color + '4d', // Add transparency (80% opacity)
        borderColor: cat.color,
        borderWidth: 0,
      },
      categoryData: cat,
      label: {
        show: true,
        formatter: () => {
          if (sizeBy.value === 'total') {
            return `{name|${cat.name}}\n{value|${configStore.formatCurrency(cat.total)}}`;
          }
          return `{name|${cat.name}}\n{value|${cat.count} trx}`;
        },
        rich: {
          name: {
            fontSize: 11,
            fontWeight: 'bold',
            color: itemLabelColor,
            lineHeight: 16,
            verticalAlign: 'middle',
          },
          value: {
            fontSize: 10,
            color: itemLabelColor,
            lineHeight: 14,
            opacity: 0.8,
            verticalAlign: 'middle',
          },
        },
        position: ['50%', '50%'],
        align: 'center',
        verticalAlign: 'middle',
      },
    };
  });

  return {
    backgroundColor: chartBg,
    tooltip: {
      trigger: 'item',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      padding: 12,
      textStyle: {
        color: tooltipTextColor,
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
      },
      formatter: (params: any) => {
        const data = params.data.categoryData;
        const valueLabel = sizeBy.value === 'total'
          ? configStore.formatCurrency(data.total)
          : `${data.count} trx`;
        return `<div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
                <div>${valueLabel}</div>`;
      },
    },
    series: [
      {
        type: 'treemap',
        left: 4,
        top: 4,
        right: 4,
        bottom: 4,
        roam: false,
        nodeClick: false,
        breadcrumb: {
          show: false,
        },
        itemStyle: {
          borderRadius: 4,
          gapWidth: 5,
          borderColor: 'transparent',       // hilangkan frame putih
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        levels: [
          {
            itemStyle: {
              color: 'transparent',         // root background hilang
            }
          }
        ],
        data: treemapData,
      },
    ],
  };
});
</script>

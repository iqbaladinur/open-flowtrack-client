<template>
  <!-- @vue-ignore -->
  <Line :data="styledChartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme';
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import type { PropType } from 'vue';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

const props = defineProps({
  chartData: {
    type: Object as PropType<{
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
      }[];
    }>,
    required: true,
  },
});

const themeStore = useThemeStore();
const isDarkMode = computed(() => {
  if (themeStore.theme === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return themeStore.theme === 'dark';
});

const styledChartData = computed(() => ({
  labels: props.chartData.labels,
  datasets: props.chartData.datasets.map(dataset => ({
    ...dataset,
    borderColor: dataset.backgroundColor,
    backgroundColor: dataset.backgroundColor + '33', // Add 20% opacity for fill
    tension: 0.4, // Smooth, rounded lines
    fill: true,
    pointStyle: 'circle',
    pointRadius: 0.1,
    pointHoverRadius: 6,
    borderWidth: 2.5,
  })),
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        color: isDarkMode.value ? '#9ca3af' : '#6b7280',
        font: {
          family: "'Inter', sans-serif",
        },
        autoSkip: true,
        maxTicksLimit: 4,
      },
      grid: {
        display: false,
      },
      border: {
        color: isDarkMode.value ? '#374151' : '#e5e7eb',
      }
    },
    y: {
      ticks: {
        color: isDarkMode.value ? '#9ca3af' : '#6b7280',
        font: {
          family: "'Inter', sans-serif",
        },
        callback: function(value: number) {
          return Intl.NumberFormat('en', { notation: 'compact' }).format(value);
        }
      },
      grid: {
        color: isDarkMode.value ? '#374151' : '#e5e7eb',
        drawBorder: false,
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'end' as const,
      labels: {
        color: isDarkMode.value ? '#d1d5db' : '#374151',
        boxWidth: 12,
        padding: 20,
        font: {
          family: "'Inter', sans-serif",
          size: 12,
        },
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: isDarkMode.value ? '#1f2937' : '#ffffff',
      titleColor: isDarkMode.value ? '#d1d5db' : '#374151',
      bodyColor: isDarkMode.value ? '#9ca3af' : '#6b7280',
      borderColor: isDarkMode.value ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4,
      titleFont: {
        family: "'Inter', sans-serif",
        size: 14,
        weight: 'bold',
      },
      bodyFont: {
        family: "'Inter', sans-serif",
        size: 12,
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
}));
</script>
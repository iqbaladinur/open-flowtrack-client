<template>
  <Line :data="styledChartData" :options="chartOptions" />
</template>

<script setup lang="ts">
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

const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const styledChartData = computed(() => ({
  labels: props.chartData.labels,
  datasets: props.chartData.datasets.map(dataset => ({
    ...dataset,
    borderColor: dataset.backgroundColor,
    backgroundColor: dataset.backgroundColor + '33', // Add 20% opacity for fill
    tension: 0.4, // Smooth, rounded lines
    fill: true,
    pointStyle: 'circle',
    pointRadius: 4,
    pointHoverRadius: 6,
    borderWidth: 2.5,
  })),
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        color: isDarkMode ? '#9ca3af' : '#6b7280',
        font: {
          family: "'Inter', sans-serif",
        },
      },
      grid: {
        display: false,
      },
      border: {
        color: isDarkMode ? '#374151' : '#e5e7eb',
      }
    },
    y: {
      ticks: {
        color: isDarkMode ? '#9ca3af' : '#6b7280',
        font: {
          family: "'Inter', sans-serif",
        },
      },
      grid: {
        color: isDarkMode ? '#374151' : '#e5e7eb',
        drawBorder: false,
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'end' as const,
      labels: {
        color: isDarkMode ? '#d1d5db' : '#374151',
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
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      titleColor: isDarkMode ? '#d1d5db' : '#374151',
      bodyColor: isDarkMode ? '#9ca3af' : '#6b7280',
      borderColor: isDarkMode ? '#374151' : '#e5e7eb',
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
};
</script>
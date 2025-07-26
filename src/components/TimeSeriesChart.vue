<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs';
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
  LineElement
);

defineProps({
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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        color: isDarkMode ? '#9ca3af' : '#6b7280',
      },
      grid: {
        color: isDarkMode ? '#374151' : '#e5e7eb',
      },
    },
    y: {
      ticks: {
        color: isDarkMode ? '#9ca3af' : '#6b7280',
      },
      grid: {
        color: isDarkMode ? '#374151' : '#e5e7eb',
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: isDarkMode ? '#d1d5db' : '#374151',
      },
    },
  },
};
</script>

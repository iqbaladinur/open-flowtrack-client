<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from 'chart.js';
import type { PropType } from 'vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

defineProps({
  chartData: {
    type: Object as PropType<{
      labels: string[];
      datasets: {
        data: number[];
        backgroundColor: string[];
      }[];
    }>,
    required: true,
  },
});

const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: isDarkMode ? '#d1d5db' : '#374151',
      },
    },
  },
};
</script>

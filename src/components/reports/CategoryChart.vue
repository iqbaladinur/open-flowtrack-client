<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import type { PropType } from 'vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

interface CategoryReportItem {
  name: string;
  color: string;
  icon: string;
  total: number;
}

const props = defineProps({
  reportData: {
    type: Array as PropType<CategoryReportItem[]>,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
});

const chartData = computed(() => ({
  labels: props.reportData.map(item => item.name),
  datasets: [
    {
      backgroundColor: props.reportData.map(item => (item.color ? `${item.color}33` : '#A1A1AA33')),
      borderColor: props.reportData.map(item => item.color || '#A1A1AA'),
      borderWidth: 1,
      data: props.reportData.map(item => item.total),
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed !== null) {
            const locale = props.currency === 'IDR' ? 'id-ID' : 'en-US';
            const options = {
              style: 'currency',
              currency: props.currency,
              minimumFractionDigits: props.currency === 'IDR' ? 0 : 2,
              maximumFractionDigits: props.currency === 'IDR' ? 0 : 2,
            };
            // @ts-ignore
            label += new Intl.NumberFormat(locale, options).format(context.parsed);
          }
          return label;
        }
      }
    }
  }
}));
</script>

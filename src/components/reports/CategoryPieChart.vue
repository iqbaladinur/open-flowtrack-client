<template>
  <div>
    <h3 class="text-slate-600 dark:text-white text-center font-mono font-medium my-6 lg:mb-10 lg:mt-6">
      Total: {{ totalNominal }}
    </h3>
    <div class="flex items-center"
      :class="{ 'flex-col-reverse gap-4 md:flex-row lg:gap-0': chartData.labels?.length > devideconst }">
      <div class="pr-4" :class="{ '!w-full': chartData.labels?.length > devideconst }">
        <ul :class="{ 'grid grid-cols-2': chartData.labels?.length > devideconst }">
          <li v-for="(label, index) in chartData.labels" :key="index" @click="toggleData(index)"
            class="flex items-start cursor-pointer p-1 rounded text-xs"
            :class="{ 'line-through text-slate-600 dark:text-white': !dataVisibility[index] }">
            <span class="w-4 h-4 mr-2 rounded-full mt-1 flex-shrink-0" :style="{
              backgroundColor: chartData.datasets[0].backgroundColor[index],
              borderColor: chartData.datasets[0].backgroundColor[index],
              borderWidth: '2px',
            }"></span>
            <span class="whitespace-pre-wrap text-slate-600 dark:text-white text-xs">{{ Array.isArray(label) ?
              label.join('\n') : label }}</span>
          </li>
        </ul>
      </div>
      <div class="flex-1" :class="{ '!w-full p-6': chartData.labels?.length > devideconst }">
        <Pie ref="pieChart" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  type Chart,
} from 'chart.js';
import type { PropType } from 'vue';
import { useConfigStore } from '@/stores/config';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const devideconst = ref(7);

const props = defineProps({
  chartData: {
    type: Object as PropType<{
      labels: (string | string[])[];
      datasets: {
        data: number[];
        backgroundColor: string[];
        borderColor?: string[];
      }[];
    }>,
    required: true,
  },
});

const pieChart = ref<InstanceType<typeof Pie> | null>(null);
const dataVisibility = ref<boolean[]>([]);

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Hide the default legend
    },
  },
}));

const configStore = useConfigStore();

const totalNominal = computed(() => {
  if (dataVisibility.value.length) {
    // @ts-ignore
    return configStore.formatCurrency(props.chartData.datasets[0].data?.filter((n, i) => dataVisibility.value[i]).reduce((sum, nominal) => sum + (nominal || 0), 0))
  }

  return configStore.formatCurrency(props.chartData.datasets[0].data?.reduce((sum, nominal) => sum + (nominal || 0), 0))
})

const initializeVisibility = () => {
  const chart = pieChart.value?.chart as Chart | undefined;
  if (chart && chart.data.labels) {
    dataVisibility.value = chart.data.labels.map((_, i) => chart.getDataVisibility(i));
  }
};

watch(pieChart, (newChart) => {
  if (newChart) {
    // Use nextTick to ensure the chart instance is fully mounted and ready
    nextTick(() => {
      initializeVisibility();
    });
  }
});

watch(() => props.chartData, () => {
  nextTick(() => {
    initializeVisibility();
  });
}, { deep: true });


const toggleData = (index: number) => {
  const chart = pieChart.value?.chart as Chart | undefined;
  if (!chart) return;

  chart.toggleDataVisibility(index);
  chart.update();

  // Update our reactive state to reflect the change
  dataVisibility.value[index] = chart.getDataVisibility(index);
};
</script>

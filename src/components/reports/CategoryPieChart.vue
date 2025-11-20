<template>
  <div>
    <h3 class="text-slate-600 dark:text-white text-center font-mono font-medium my-6 lg:mb-10 lg:mt-6">
      Total: {{ totalNominal }}
    </h3>
    <div class="flex items-center"
      :class="{ 'flex-col-reverse gap-4 md:flex-row lg:gap-0': chartData.labels?.length > divideConst }">
      <div class="pr-4 flex-1" :class="{ '!w-full': chartData.labels?.length > divideConst }">
        <ul :class="{ 'grid grid-cols-2': chartData.labels?.length > divideConst }">
          <li v-for="(label, index) in chartData.labels" :key="index" @click="toggleData(index)"
            class="flex items-start cursor-pointer p-1 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'line-through opacity-50': !dataVisibility[index] }">
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
      <div class="flex-1 relative min-w-20" :class="{ '!w-full p-6': chartData.labels?.length > divideConst }">
        <div class="w-full" style="height: 400px;">
          <v-chart ref="chartRef" class="w-full h-full" :option="chartOption" autoresize />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { PropType } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useDark } from '@vueuse/core';

// Register ECharts components
use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const divideConst = ref(7);

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

const chartRef = ref<InstanceType<typeof VChart> | null>(null);
const dataVisibility = ref<boolean[]>([]);

const configStore = useConfigStore();
const isDark = useDark();

// Initialize visibility array when chartData changes
const initializeVisibility = () => {
  if (props.chartData.labels) {
    dataVisibility.value = props.chartData.labels.map(() => true);
  }
};

// ECharts option configuration
const chartOption = computed(() => {
  const seriesData = props.chartData.labels.map((label, index) => {
    const name = Array.isArray(label) ? label[0] : label;
    return {
      name,
      value: dataVisibility.value[index] ? props.chartData.datasets[0].data[index] : 0,
      itemStyle: {
        color: props.chartData.datasets[0].backgroundColor[index],
        borderColor: props.chartData.datasets[0].borderColor?.[index] || props.chartData.datasets[0].backgroundColor[index],
        borderWidth: 2,
      },
      originalValue: props.chartData.datasets[0].data[index],
    };
  });

  // Sort data from smallest to biggest value
  seriesData.sort((a, b) => a.value - b.value);

  const tooltipBg = isDark.value ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark.value ? '#374151' : '#e5e7eb';
  const tooltipTextColor = isDark.value ? '#d1d5db' : '#374151';

  return {
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
        return `${params.name}: ${configStore.formatCurrency(params.value)}`;
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '70%'],
        center: ['50%', '50%'],
        itemStyle: {
          borderRadius: 6,
        },
        padAngle: 3,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
          scale: true,
          scaleSize: 10,
        },
        labelLine: {
          show: false,
        },
        data: seriesData,
      },
    ],
  };
});

const totalNominal = computed(() => {
  if (dataVisibility.value.length) {
    return configStore.formatCurrency(
      props.chartData.datasets[0].data
        ?.filter((_, i) => dataVisibility.value[i])
        .reduce((sum, nominal) => sum + (nominal || 0), 0)
    );
  }

  return configStore.formatCurrency(
    props.chartData.datasets[0].data?.reduce((sum, nominal) => sum + (nominal || 0), 0)
  );
});

watch(() => props.chartData, () => {
  nextTick(() => {
    initializeVisibility();
  });
}, { deep: true, immediate: true });

const toggleData = (index: number) => {
  dataVisibility.value[index] = !dataVisibility.value[index];
};
</script>

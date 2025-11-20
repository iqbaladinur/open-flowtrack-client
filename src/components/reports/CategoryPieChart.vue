<template>
  <div class="space-y-4">
    <h3 class="text-slate-600 dark:text-white text-center font-mono font-medium">
      Total: {{ totalNominal }}
    </h3>

    <!-- Chart -->
    <div class="w-full h-[300px] lg:h-[400px]">
      <v-chart ref="chartRef" class="w-full h-full" :option="chartOption" autoresize />
    </div>

    <!-- Legend as chips -->
    <div class="flex flex-wrap gap-2 justify-center">
      <button v-for="(label, index) in chartData.labels" :key="index" @click="toggleData(index)"
        class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors"
        :class="dataVisibility[index]
          ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          : 'bg-gray-50 dark:bg-gray-900 opacity-50'">
        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{
          backgroundColor: chartData.datasets[0].borderColor?.[index] || chartData.datasets[0].backgroundColor[index],
        }"></span>
        <span class="text-slate-600 dark:text-white" :class="{ 'line-through': !dataVisibility[index] }">
          {{ Array.isArray(label) ? label[0] : label }}
        </span>
        <span v-if="Array.isArray(label) && label[1]" class="text-gray-500 dark:text-gray-400 font-mono" :class="{ 'line-through': !dataVisibility[index] }">
          {{ label[1] }}
        </span>
      </button>
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
import { useThemeStore } from '@/stores/theme';

// Register ECharts components
use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

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
const themeStore = useThemeStore();

const isDark = computed(() => {
  if (themeStore.theme === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return themeStore.theme === 'dark';
});

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

  // Add label only for the largest value (last item after sorting)
  const labelColor = isDark.value ? '#e5e7eb' : '#374151';
  seriesData.forEach((item, index) => {
    if (index === seriesData.length - 1 && item.value > 0) {
      // @ts-ignore
      item.label = {
        show: true,
        position: 'outside',
        formatter: (params: any) => {
          return `${params.name}\n${configStore.formatCurrency(params.value)} (${params.percent}%)`;
        },
        color: labelColor,
        fontSize: 11,
        fontWeight: 'bold',
      };
    }
  });

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
        radius: ['30%', '90%'],
        center: ['50%', '50%'],
        itemStyle: {
          // borderRadius: 6,
        },
        roseType: 'radius',
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
          },
          scale: true,
          scaleSize: 10,
        },
        labelLine: {
          show: true,
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

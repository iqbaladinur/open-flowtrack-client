<template>
  <div>
    <h3 class="text-slate-600 dark:text-white text-center font-mono font-medium text-sm lg:text-base mb-8 lg:mb-10">
      {{ $t('wallets.totalBalance') }}: {{ totalBalance }}
    </h3>

    <!-- Layout with custom legend -->
    <div v-if="useCustomLegend" class="flex flex-col-reverse lg:flex-row items-center gap-6">
      <!-- Legend -->
      <div class="w-full lg:w-1/2 lg:pr-4">
        <ul class="grid grid-cols-2 gap-1">
          <li v-for="(label, index) in chartData.labels" :key="index" @click="toggleData(index)"
            class="flex items-start cursor-pointer p-2 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'line-through opacity-50': !dataVisibility[index] }">
            <span class="w-4 h-4 mr-2 rounded-full mt-0.5 flex-shrink-0" :style="{
              backgroundColor: chartData.datasets[0].backgroundColor[index],
              borderColor: chartData.datasets[0].backgroundColor[index],
              borderWidth: '2px',
            }"></span>
            <span class="whitespace-pre-wrap text-slate-600 dark:text-white text-xs">{{ Array.isArray(label) ?
              label.join('\n') : label }}</span>
          </li>
        </ul>
      </div>

      <!-- Chart -->
      <div class="w-full lg:w-1/2 flex justify-center">
        <div class="w-full max-w-[400px]" style="height: 400px;">
          <v-chart ref="chartRef" class="w-full h-full" :option="chartOption" autoresize />
        </div>
      </div>
    </div>

    <!-- Layout with built-in chart labels -->
    <div v-else class="flex justify-center">
      <div class="w-full max-w-[600px]" style="height: 500px;">
        <v-chart ref="chartRef" class="w-full h-full" :option="chartOption" autoresize />
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
import { useThemeStore } from '@/stores/theme';
import { useWindowSize } from '@vueuse/core';

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
  useCustomLegend: {
    type: Boolean,
    default: true,
  },
});

const chartRef = ref<InstanceType<typeof VChart> | null>(null);
const dataVisibility = ref<boolean[]>([]);

const configStore = useConfigStore();
const themeStore = useThemeStore();
const { width: windowWidth } = useWindowSize();

const isDark = computed(() => {
  if (themeStore.theme === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return themeStore.theme === 'dark';
});

// Responsive radius based on screen size
const chartRadius = computed(() => {
  // Mobile: smaller radius to fit labels
  // Desktop (lg: 1024px+): larger radius
  if (windowWidth.value >= 1024) {
    return ['15%', '65%'];
  }
  return ['10%', '50%'];
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
      // Store original value for toggling
      originalValue: props.chartData.datasets[0].data[index],
    };
  });

  // Sort data from smallest to biggest value
  seriesData.sort((a, b) => a.value - b.value);

  // Configuration for custom legend (current layout)
  if (props.useCustomLegend) {
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${params.name}: ${configStore.formatCurrency(params.value)}`;
        },
      },
      series: [
        {
          type: 'pie',
          radius: [80, 190],
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false,
            },
          },
          labelLine: {
            show: false,
          },
          data: seriesData,
        },
      ],
    };
  }

  // Configuration for built-in chart labels
  const labelNameColor = isDark.value ? '#f3f4f6' : '#374151';
  const labelValueColor = isDark.value ? '#9ca3af' : '#6b7280';
  const labelLineColor = isDark.value ? '#6b7280' : '#9ca3af';

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}: ${configStore.formatCurrency(params.value)}`;
      },
    },
    series: [
      {
        type: 'pie',
        radius: chartRadius.value,
        center: ['50%', '50%'],
        label: {
          show: true,
          position: 'outside',
          formatter: (params: any) => {
            const name = params.name.split(' (')[0]; // Get name without percentage
            return `{name|${name}}\n{value|${configStore.formatCurrency(params.value)}}`;
          },
          rich: {
            name: {
              fontSize: 11,
              fontWeight: 'bold',
              color: labelNameColor,
              lineHeight: 16,
            },
            value: {
              fontSize: 10,
              color: labelValueColor,
              lineHeight: 14,
            },
          },
          alignTo: 'labelLine',
          distanceToLabelLine: 3,
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 8,
          smooth: true,
          lineStyle: {
            color: labelLineColor,
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
          },
        },
        data: seriesData,
      },
    ],
  };
});

const totalBalance = computed(() => {
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

const toggleMultipleData = (indices: number[]) => {
  indices.forEach(index => {
    dataVisibility.value[index] = !dataVisibility.value[index];
  });
};

// Expose methods to parent component
defineExpose({
  toggleMultipleData,
});
</script>

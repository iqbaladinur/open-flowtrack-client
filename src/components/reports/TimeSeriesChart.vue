<template>
  <v-chart ref="chartRef" class="w-full h-full" :option="chartOption" autoresize />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { PropType } from 'vue';
import { useThemeStore } from '@/stores/theme';

// Register ECharts components
use([
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
]);

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
  chartType: {
    type: String as PropType<'line' | 'bar'>,
    default: 'line',
  },
});

const themeStore = useThemeStore();

const isDark = computed(() => {
  if (themeStore.theme === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return themeStore.theme === 'dark';
});

const chartOption = computed(() => {
  const textColor = isDark.value ? '#9ca3af' : '#6b7280';
  const legendColor = isDark.value ? '#d1d5db' : '#374151';
  const gridLineColor = isDark.value ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark.value ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark.value ? '#374151' : '#e5e7eb';

  const series = props.chartData.datasets.map(dataset => {
    const baseConfig = {
      name: dataset.label,
      data: dataset.data,
      itemStyle: {
        color: dataset.backgroundColor,
      },
    };

    if (props.chartType === 'line') {
      return {
        ...baseConfig,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 1,
        lineStyle: {
          width: 2.5,
          color: dataset.backgroundColor,
        },
        areaStyle: {
          color: dataset.backgroundColor + '33',
        },
        emphasis: {
          symbolSize: 8,
        },
      };
    } else {
      return {
        ...baseConfig,
        type: 'bar',
        barMaxWidth: 20,
        itemStyle: {
          color: dataset.backgroundColor,
          borderRadius: [4, 4, 0, 0],
        },
      };
    }
  });

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      padding: 12,
      textStyle: {
        color: legendColor,
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
      },
      axisPointer: {
        type: props.chartType === 'line' ? 'cross' : 'shadow',
        crossStyle: {
          color: textColor,
        },
      },
      formatter: (params: any) => {
        let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
        params.forEach((param: any) => {
          const value = Intl.NumberFormat('en', { notation: 'compact' }).format(param.value);
          result += `<div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 2px;"></span>
            <span>${param.seriesName}: ${value}</span>
          </div>`;
        });
        return result;
      },
    },
    legend: {
      show: true,
      top: 0,
      right: 0,
      textStyle: {
        color: legendColor,
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: props.chartData.labels,
      axisLine: {
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: textColor,
        fontFamily: "'Inter', sans-serif",
        fontSize: 11,
        interval: 'auto',
        rotate: 0,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: textColor,
        fontFamily: "'Inter', sans-serif",
        fontSize: 11,
        formatter: (value: number) => {
          return Intl.NumberFormat('en', { notation: 'compact' }).format(value);
        },
      },
    },
    series,
  };
});
</script>

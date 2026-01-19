<template>
  <div class="h-full">
    <v-chart v-if="chartData.labels.length > 0" class="w-full h-full" :option="chartOption" autoresize />
    <div v-else class="flex items-center justify-center h-full text-sepia-500 dark:text-gray-400">
      <p>{{ $t('reports.noBudgetData') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { Budget } from '@/types/budget';
import type { PropType } from 'vue';
import { useThemeStore } from '@/stores/theme';

// Register ECharts components
use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
]);

const props = defineProps({
  budgets: {
    type: Array as PropType<Budget[]>,
    required: true,
  },
  currency: {
    type: String,
    default: 'IDR',
  },
});

const themeStore = useThemeStore();

const isDark = computed(() => {
  if (themeStore.theme === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return themeStore.theme === 'dark';
});

const chartData = computed(() => {
  const labels = props.budgets.map(b => b.name);
  const limitData = props.budgets.map(b => b.limit_amount);
  const spentData = props.budgets.map(b => b.total_spent || 0);

  return {
    labels,
    limitData,
    spentData,
  };
});

const getSpentColor = (index: number) => {
  const spent = chartData.value.spentData[index];
  const limit = chartData.value.limitData[index];
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;

  if (percentage > 100) return '#b91c1c';
  if (percentage > 90) return '#ef4444';
  if (percentage > 75) return '#f59e0b';
  if (percentage > 50) return '#10b981';
  return '#3b82f6';
};

const chartOption = computed(() => {
  const textColor = isDark.value ? '#9ca3af' : '#6b7280';
  const legendColor = isDark.value ? '#d1d5db' : '#374151';
  const gridLineColor = isDark.value ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark.value ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark.value ? '#374151' : '#e5e7eb';
  const budgetLimitColor = isDark.value ? '#6b7280' : '#d1d5db';

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
        type: 'shadow',
      },
      formatter: (params: any) => {
        let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
        params.forEach((param: any, idx: number) => {
          const formattedValue = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: props.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(param.value);

          // Add percentage for spent
          let extraInfo = '';
          if (idx === 1) {
            const limit = chartData.value.limitData[param.dataIndex];
            const percentage = limit > 0 ? ((param.value / limit) * 100).toFixed(1) : '0.0';
            extraInfo = ` (${percentage}%)`;
          }

          result += `<div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 2px;"></span>
            <span>${param.seriesName}: ${formattedValue}${extraInfo}</span>
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
      data: chartData.value.labels,
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
        show: true,
        lineStyle: {
          color: gridLineColor,
        },
      },
      axisLabel: {
        color: textColor,
        fontFamily: "'Inter', sans-serif",
        fontSize: 11,
        formatter: (value: number) => {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: props.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            notation: 'compact',
          }).format(value);
        },
      },
    },
    series: [
      {
        name: 'Budget Limit',
        type: 'bar',
        data: chartData.value.limitData,
        barMaxWidth: 30,
        itemStyle: {
          color: budgetLimitColor,
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: 'Actual Spent',
        type: 'bar',
        data: chartData.value.spentData,
        barMaxWidth: 30,
        itemStyle: {
          color: (params: any) => getSpentColor(params.dataIndex),
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };
});
</script>

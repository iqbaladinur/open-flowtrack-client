<template>
  <div>
    <div v-if="!hasData" class="text-center py-8 flex flex-col items-center justify-center min-h-[300px]">
      <ArrowRightLeft class="w-10 h-10 text-gray-400 mx-auto mb-2" />
      <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('reports.noWalletData') }}</p>
    </div>
    <div v-else class="w-full" style="height: 400px;">
      <v-chart ref="chartRef" class="w-full h-full" :option="chartOption" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { SankeyChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { Transaction } from '@/types/transaction';
import { useConfigStore } from '@/stores/config';
import { useThemeStore } from '@/stores/theme';
import { ArrowRightLeft } from 'lucide-vue-next';

// Register ECharts components
use([SankeyChart, TitleComponent, TooltipComponent, CanvasRenderer]);

const props = defineProps<{
  transactions: Transaction[];
}>();

const configStore = useConfigStore();
const themeStore = useThemeStore();

const isDark = computed(() => {
  if (themeStore.theme === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return themeStore.theme === 'dark';
});

const sankeyData = computed(() => {
  const nodes: { name: string }[] = [];
  const links: { source: string; target: string; value: number }[] = [];
  const nodeSet = new Set<string>();

  // Track totals per wallet
  const walletIncome = new Map<string, number>();
  const walletExpense = new Map<string, number>();
  const transferMap = new Map<string, number>(); // "source->target" -> amount

  props.transactions.forEach(t => {
    if (t.type === 'income' && t.wallet) {
      const walletName = t.wallet.name;
      walletIncome.set(walletName, (walletIncome.get(walletName) || 0) + t.amount);
      nodeSet.add(walletName);
    } else if (t.type === 'expense' && t.wallet) {
      const walletName = t.wallet.name;
      walletExpense.set(walletName, (walletExpense.get(walletName) || 0) + t.amount);
      nodeSet.add(walletName);
    } else if (t.type === 'transfer' && t.wallet && t.destinationWallet) {
      const sourceWallet = t.wallet.name;
      const destWallet = t.destinationWallet.name;
      const key = `${sourceWallet}->${destWallet}`;
      transferMap.set(key, (transferMap.get(key) || 0) + t.amount);
      nodeSet.add(sourceWallet);
      nodeSet.add(destWallet);
    }
  });

  // Add special nodes for Income and Expense
  const hasIncome = walletIncome.size > 0;
  const hasExpense = walletExpense.size > 0;

  if (hasIncome) {
    nodes.push({ name: 'Income' });
  }
  if (hasExpense) {
    nodes.push({ name: 'Expense' });
  }

  // Add wallet nodes
  nodeSet.forEach(walletName => {
    nodes.push({ name: walletName });
  });

  // Add income links (Income -> Wallet)
  walletIncome.forEach((amount, walletName) => {
    if (amount > 0) {
      links.push({
        source: 'Income',
        target: walletName,
        value: amount,
      });
    }
  });

  // Add transfer links (Wallet -> Wallet)
  transferMap.forEach((amount, key) => {
    const [source, target] = key.split('->');
    if (amount > 0) {
      links.push({
        source,
        target,
        value: amount,
      });
    }
  });

  // Add expense links (Wallet -> Expense)
  walletExpense.forEach((amount, walletName) => {
    if (amount > 0) {
      links.push({
        source: walletName,
        target: 'Expense',
        value: amount,
      });
    }
  });

  return { nodes, links };
});

const hasData = computed(() => {
  return sankeyData.value.nodes.length > 0 && sankeyData.value.links.length > 0;
});

const chartOption = computed(() => {
  const tooltipBg = isDark.value ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark.value ? '#374151' : '#e5e7eb';
  const tooltipTextColor = isDark.value ? '#d1d5db' : '#374151';
  const labelColor = isDark.value ? '#e5e7eb' : '#374151';

  return {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
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
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}<br/>${configStore.formatCurrency(params.data.value)}`;
        }
        return params.name;
      },
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        emphasis: {
          focus: 'adjacency',
        },
        nodeAlign: 'justify',
        orient: 'horizontal',
        draggable: true,
        label: {
          show: true,
          position: 'right',
          color: labelColor,
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
        },
        lineStyle: {
          color: 'gradient',
          curveness: 0.5,
        },
        itemStyle: {
          borderWidth: 0,
        },
        data: sankeyData.value.nodes.map(node => ({
          name: node.name,
          itemStyle: {
            color: node.name === 'Income'
              ? '#10b981'
              : node.name === 'Expense'
                ? '#ef4444'
                : '#6366f1',
          },
        })),
        links: sankeyData.value.links,
      },
    ],
  };
});
</script>

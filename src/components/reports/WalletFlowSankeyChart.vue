<template>
  <div>
    <div v-if="!hasData" class="text-center py-8 flex flex-col items-center justify-center min-h-[300px]">
      <ArrowRightLeft class="w-10 h-10 text-gray-400 mx-auto mb-2" />
      <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('reports.noWalletData') }}</p>
    </div>
    <div v-else class="space-y-4">
      <!-- Sankey Chart -->
      <div class="w-full" style="height: 400px;">
        <v-chart ref="chartRef" class="w-full h-full" :option="chartOption" autoresize />
      </div>

      <!-- Wallet Details Legend -->
      <div class="flex flex-wrap gap-2">
        <button v-for="item in walletReportData" :key="item.name"
          @click="openWalletDetail(item)"
          class="flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <span class="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
          <span class="text-xs text-gray-900 dark:text-white">{{ item.name }}</span>
          <span :class="item.net >= 0 ? 'text-success-600' : 'text-error-600'" class="font-medium text-xs font-mono">
            {{ item.net >= 0 ? '+' : '' }}{{ configStore.formatCurrency(item.net) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Wallet Detail Modal -->
    <Modal v-model="showModal" :title="selectedWallet?.name">
      <div v-if="selectedWallet" class="space-y-4">
        <!-- Net Summary -->
        <div class="text-center py-4">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ $t('reports.netFlow') }}</p>
          <p :class="selectedWallet.net >= 0 ? 'text-success-600' : 'text-error-600'" class="text-xs font-mono">
            {{ selectedWallet.net >= 0 ? '+' : '' }}{{ configStore.formatCurrency(selectedWallet.net) }}
          </p>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-lg bg-success-50 dark:bg-success-900/20 p-3">
            <div class="flex items-center gap-2 mb-1">
              <TrendingUp class="size-4 text-success-600" />
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ $t('reports.income') }}</span>
            </div>
            <p class="font-mono text-xs text-success-600">+{{ configStore.formatCurrency(selectedWallet.income) }}</p>
          </div>

          <div class="rounded-lg bg-error-50 dark:bg-error-900/20 p-3">
            <div class="flex items-center gap-2 mb-1">
              <TrendingDown class="size-4 text-error-600" />
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ $t('reports.expense') }}</span>
            </div>
            <p class="font-mono text-xs text-error-600">-{{ configStore.formatCurrency(selectedWallet.expense) }}</p>
          </div>

          <div class="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
            <div class="flex items-center gap-2 mb-1">
              <ArrowDownRight class="size-4 text-blue-600" />
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ $t('reports.transferIn') }}</span>
            </div>
            <p class="font-mono text-xs text-blue-600">+{{ configStore.formatCurrency(selectedWallet.transferIn) }}</p>
          </div>

          <div class="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
            <div class="flex items-center gap-2 mb-1">
              <ArrowUpRight class="size-4 text-blue-600" />
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ $t('reports.transferOut') }}</span>
            </div>
            <p class="font-mono text-xs text-blue-600">-{{ configStore.formatCurrency(selectedWallet.transferOut) }}</p>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, markRaw } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { SankeyChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { Transaction } from '@/types/transaction';
import { useConfigStore } from '@/stores/config';
import { useThemeStore } from '@/stores/theme';
import { ArrowRightLeft, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-vue-next';
import Modal from '@/components/ui/Modal.vue';

// Register ECharts components
use([SankeyChart, TitleComponent, TooltipComponent, CanvasRenderer]);

interface WalletData {
  name: string;
  income: number;
  expense: number;
  transferIn: number;
  transferOut: number;
  net: number;
}

const props = defineProps<{
  transactions: Transaction[];
  walletReportData: WalletData[];
}>();

const configStore = useConfigStore();
const themeStore = useThemeStore();

// Modal state
const showModal = ref(false);
const selectedWallet = ref<WalletData | null>(null);

const openWalletDetail = (wallet: WalletData) => {
  selectedWallet.value = wallet;
  showModal.value = true;
};

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

  // Add transfer links (Wallet -> Wallet) with cycle resolution (Net Flow)
  const processedPairs = new Set<string>();
  
  transferMap.forEach((amount, key) => {
    const [source, target] = key.split('->');
    if (source === target) return; // Ignore self-loops

    // Check if we already handled this pair
    const pairKey = [source, target].sort().join('-');
    if (processedPairs.has(pairKey)) return;

    const reverseKey = `${target}->${source}`;
    const reverseAmount = transferMap.get(reverseKey) || 0;

    const netAmount = amount - reverseAmount;
    
    if (netAmount > 0) {
      links.push({
        source,
        target,
        value: netAmount,
      });
    } else if (netAmount < 0) {
      links.push({
        source: target,
        target: source,
        value: Math.abs(netAmount),
      });
    }
    
    processedPairs.add(pairKey);
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

  // Optimization: If there are too many links, filter out very small ones to prevent rendering issues
  // This is especially important for mobile devices
  let finalLinks = links;
  let finalNodes = nodes;

  if (links.length > 50) {
    const totalValue = links.reduce((sum, link) => sum + link.value, 0);
    // Filter out links that represent less than 0.5% of the total flow
    const threshold = totalValue * 0.005;
    finalLinks = links.filter(link => link.value > threshold);

    // Filter out nodes that are no longer connected
    const connectedNodes = new Set<string>();
    finalLinks.forEach(link => {
      connectedNodes.add(link.source);
      connectedNodes.add(link.target);
    });
    finalNodes = nodes.filter(node => connectedNodes.has(node.name));
  }

  return { nodes: finalNodes, links: finalLinks };
});

const hasData = computed(() => {
  return sankeyData.value.nodes.length > 0 && sankeyData.value.links.length > 0;
});

const chartOption = computed(() => {
  const tooltipBg = isDark.value ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark.value ? '#374151' : '#e5e7eb';
  const tooltipTextColor = isDark.value ? '#d1d5db' : '#374151';
  const labelColor = isDark.value ? '#e5e7eb' : '#374151';

  return markRaw({
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
        draggable: false, // Disable draggable to improve performance on mobile
        animation: sankeyData.value.links.length < 100, // Disable animation for large datasets
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
  });
});
</script>

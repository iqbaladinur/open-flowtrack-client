<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-neon">{{ $t('wallets.title') }}</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            {{ $t('wallets.subtitle') }}
          </p>
        </div>
        <div class="flex items-center gap-4 lg:gap-2 justify-between">
          <div class="flex items-center gap-3 justify-start">
            <button @click="prevDate" class="flex items-center btn-secondary p-2 rounded-full btn-borderless">
              <ChevronLeft class="size-4" />
            </button>
            <span class="text-xs italic text-gray-600 dark:text-gray-300">
              {{ readableDate }}
            </span>
            <button @click="nextDate" class="flex items-center btn-secondary p-2 rounded-full btn-borderless">
              <ChevronRight class="size-4" />
            </button>
          </div>
          <div class="flex items-center gap-2 justify-end">
            <button @click="exportToJson" class="btn btn-secondary gap-2 flex items-center p-2">
              <Download class="size-4" />
            </button>
            <button @click="shareWallets" class="btn-secondary lg:hidden p-2" :disabled="loadingShare">
              <span v-if="loadingShare" class="flex items-center gap-2">
                <LoadingSpinner size="sm"/>
              </span>
              <span v-else class="flex items-center gap-2">
                <Share2 class="size-4" />
              </span>
            </button>
            <button @click="showAddModal = true" class="btn-primary hidden sm:flex flex-shrink-0 p-2">
              <Plus class="size-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Wallets Grid -->
      <div v-if="walletsStore.loading" class="card p-8">
        <LoadingSpinner fullHeight />
      </div>

      <div v-else-if="wallets.length === 0" class="card p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <WalletIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('wallets.noWalletsYet') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          {{ $t('wallets.createFirstWallet') }}
        </p>
        <button @click="showAddModal = true" class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          {{ $t('wallets.addWallet') }}
        </button>
      </div>

      <div v-else class="space-y-6">
        <!-- Wallet Distribution Chart -->
        <div class="card p-4 lg:p-6">
          <div class="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <PieChartIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 class="text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                {{ $t('wallets.distribution') }} ({{ configStore.currency }})
              </h2>
            </div>
            <div class="flex items-center gap-1">
              <!-- Toggle Chart View -->
              <button
                @click="useCustomLegend = !useCustomLegend"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :title="useCustomLegend ? 'Show chart labels' : 'Show custom legend'"
              >
                <List v-if="useCustomLegend" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <Tag v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                @click="toggleHiddenWallets"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :title="showHiddenWallets ? $t('wallets.hideHidden') : $t('wallets.showHidden')"
              >
                <EyeOff v-if="showHiddenWallets" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <Eye v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
          <div v-if="visibleWallets.length === 0" class="text-center py-8">
            <WalletIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500 dark:text-gray-400">{{ $t('wallets.noVisibleWallets') }}</p>
          </div>
          <WalletBalancePieChart v-else ref="chartRef" :chart-data="walletChartData" :use-custom-legend="useCustomLegend" />
        </div>

        <!-- Wallets Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="wallet in wallets"
            :key="wallet.id"
            class="cursor-pointer"
            @click="goToWalletDetail(wallet.id)"
          >
            <WalletCard
              :wallet="wallet"
              :enable-actions="false"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Add Button for Mobile -->
    <button @click="showAddModal = true" class="sm:hidden fixed bottom-[70px] right-6 z-[20] btn-primary rounded-xl p-3 shadow-lg flex items-center justify-center">
      <Plus class="w-6 h-6" />
      <span class="sr-only">{{ $t('wallets.addWallet') }}</span>
    </button>

    <!-- Add/Edit Wallet Modal -->
    <WalletModal
      v-model="showAddModal"
      :wallet="selectedWallet"
      @success="handleWalletSaved"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useWalletsStore } from '@/stores/wallets';
import AppLayout from '@/components/layouts/AppLayout.vue';
import WalletModal from '@/components/wallet/WalletModal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import WalletCard from '@/components/wallet/WalletCard.vue';
import WalletBalancePieChart from '@/components/wallet/WalletBalancePieChart.vue';
import type { Wallet } from '@/types/wallet';
import { endOfDay, format, parseISO } from 'date-fns';
import {
  Plus,
  Wallet as WalletIcon,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  PieChart as PieChartIcon,
  Eye,
  EyeOff,
  List,
  Tag,
} from 'lucide-vue-next';
import { useConfigStore } from '@/stores/config';

const { t } = useI18n();
const walletsStore = useWalletsStore();
const router = useRouter();

const showAddModal = ref(false);
const selectedWallet = ref<Wallet | null>(null);
const loadingShare = ref<boolean>(false);
const endDate = ref<Date>(new Date());
const configStore = useConfigStore();

const wallets = computed(() => {
  return walletsStore.wallets
    .slice();
});

const chartRef = ref<InstanceType<typeof WalletBalancePieChart> | null>(null);
const showHiddenWallets = ref(true);
const useCustomLegend = ref(true);

const visibleWallets = computed(() => {
  return wallets.value.filter(w => {
    // Only include wallets with balance > 0
    return w.current_balance && w.current_balance > 0;
  });
});

const walletChartData = computed(() => {
  const walletsData = visibleWallets.value;
  const totalBalance = walletsData.reduce((sum, w) => sum + (w.current_balance || 0), 0);

  // Generate colors for wallets (you can customize this)
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
  ];

  return {
    labels: walletsData.map(w => {
      const balance = w.current_balance || 0;
      const percentage = totalBalance > 0 ? ((balance / totalBalance) * 100).toFixed(1) : '0.0';
      return [`${w.name} (${percentage}%)`, `${configStore.formatCurrency(balance)}`];
    }),
    datasets: [{
      data: walletsData.map(w => w.current_balance || 0),
      backgroundColor: walletsData.map((_, idx) => `${colors[idx % colors.length]}4d`),
      borderColor: walletsData.map((_, idx) => colors[idx % colors.length]),
    }],
  };
});

const toggleHiddenWallets = () => {
  if (!chartRef.value) return;

  // Get indices of hidden wallets
  const hiddenIndices = visibleWallets.value
    .map((w, idx) => w.hidden ? idx : -1)
    .filter(idx => idx !== -1);

  // Toggle visibility for all hidden wallets
  chartRef.value.toggleMultipleData(hiddenIndices);

  // Toggle state for icon
  showHiddenWallets.value = !showHiddenWallets.value;
};

const readableDate = computed(() => {
  return format(endOfDay(endDate.value), 'E, dd MMM')
});

const handleWalletSaved = () => {
  showAddModal.value = false;
  getWalletsData();
};

const exportToJson = () => {
  const data = wallets.value;
  if (data.length === 0) {
    alert(t('wallets.noWalletsToExport'));
    return;
  }

  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

  const today = format(new Date(), 'yyyy-MM-dd');
  const filename = `wallets_${today}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', filename);
  linkElement.click();
};

const shareWallets = async () => {
  loadingShare.value = true;
  try {
    const data = wallets.value;
    if (data.length === 0) {
      alert(t('wallets.noWalletsToShare'));
      return;
    }

    const dataStr = JSON.stringify(data, null, 2);
    const today = format(endDate.value, 'yyyy-MM-dd');
    const jsonFilename = `wallets_${today}.json`;
    const txtFilename = `wallets_${today}.json.txt`;

    const file = new File([dataStr], txtFilename, { type: 'text/plain' });

    const formatted = data.map(w => {
      const status = w.hidden ? t('wallets.hidden') : t('wallets.visible');
      return `${w.name}: Current balance ${w.current_balance}, Initial balance ${w.initial_balance} (${status})`;
    });

    const llmInput = `${t('wallets.shareWalletData')} \n \`\`\`\n${formatted.join("\n")}\n\`\`\`\n\n`;

    const shareData = {
      title: jsonFilename,
      text: llmInput,
      files: [file],
    };

    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      throw new Error(t('wallets.sharingNotSupported'));
    }
  } catch (error: any) {
    alert(t('wallets.failedToShare') + ' ' + error?.message);
  } finally {
    loadingShare.value = false;
  }
};

const goToWalletDetail = (walletId: string) => {
  router.push(`/wallet/${walletId}`);
};

const getWalletsData = () => {
  const endPeriod = endOfDay(endDate.value).toISOString();
  walletsStore.fetchWallets(true, undefined, endPeriod);
}

const nextDate = () => {
    const firstDay = configStore.firstDayOfMonth;
    const endDateNow = endOfDay(endDate.value);
    const start = parseISO(endDateNow.toISOString());

    const newStart = new Date(start);
    // Set to day 1 first to avoid month overflow issues
    newStart.setDate(1);
    // Move to next month
    newStart.setMonth(newStart.getMonth() + 1);
    // Set the correct end date
    if (firstDay === 1) {
      // Get last day of this month by going to next month day 0
      newStart.setMonth(newStart.getMonth() + 1);
      newStart.setDate(0);
    } else {
      newStart.setDate(firstDay - 1);
    }

    endDate.value = newStart;

    getWalletsData();
}

const prevDate = () => {
  const firstDay = configStore.firstDayOfMonth;
    const endDateNow = endOfDay(endDate.value);
    const start = parseISO(endDateNow.toISOString());

    const newStart = new Date(start);
    // Set to day 1 first to avoid month overflow issues
    newStart.setDate(1);
    // Move to previous month
    newStart.setMonth(newStart.getMonth() - 1);
    // Set the correct end date
    if (firstDay === 1) {
      // Get last day of this month by going to next month day 0
      newStart.setMonth(newStart.getMonth() + 1);
      newStart.setDate(0);
    } else {
      newStart.setDate(firstDay - 1);
    }

    endDate.value = newStart;

    getWalletsData();
}

watch(showAddModal, (isShowing) => {
  if (!isShowing) {
    selectedWallet.value = null;
  }
});

onMounted(() => {
  getWalletsData();
});
</script>
<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="hidden lg:block">
          <h1 class="text-xl lg:text-3xl font-bold text-sepia-900 dark:text-neon">{{ $t('wallets.title') }}</h1>
          <p class="text-sepia-600 dark:text-gray-400 mt-1 text-sm">{{ $t('wallets.subtitle') }}</p>
        </div>
        <div class="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
          <!-- Mobile: date nav inline -->
          <div class="flex items-center gap-1 lg:hidden">
            <button @click="prevDate" class="p-2 rounded-full btn-borderless">
              <ChevronLeft class="size-4 text-sepia-600 dark:text-gray-300" />
            </button>
            <button @click="openDatePicker"
              class="text-xs italic text-sepia-600 dark:text-gray-300 hover:text-sepia-900 dark:hover:text-white transition-colors px-1">
              {{ readableDate }}
            </button>
            <button @click="nextDate" class="p-2 rounded-full btn-borderless">
              <ChevronRight class="size-4 text-sepia-600 dark:text-gray-300" />
            </button>
          </div>
          <!-- Action buttons -->
          <div class="flex items-center gap-2">
            <button @click="exportToJson" class="btn btn-secondary gap-2 flex items-center p-2">
              <Download class="size-4 text-sepia-600 dark:text-gray-300" />
            </button>
            <button @click="shareWallets" class="btn-secondary lg:hidden p-2" :disabled="loadingShare">
              <span v-if="loadingShare"><LoadingSpinner size="sm" /></span>
              <span v-else><Share2 class="size-4 text-sepia-600 dark:text-gray-300" /></span>
            </button>
            <button @click="showAddModal = true" class="btn-primary hidden sm:flex flex-shrink-0 p-2">
              <Plus class="size-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop: Calendar + Wallet Overview — unified card -->
      <div class="hidden lg:flex card special-card rounded-2xl overflow-hidden divide-x divide-white/10">

        <!-- Calendar (25%) -->
        <div class="w-1/4 shrink-0 flex flex-col pt-4 pb-4">
          <div class="flex items-center justify-between px-3 mb-3">
            <div class="flex items-center gap-0.5">
              <button @click="prevDate" class="p-1.5 rounded-full hover:bg-success-700/60 transition-colors">
                <ChevronLeft class="size-3.5 text-success-200" />
              </button>
              <h3 class="text-xs font-semibold text-white px-1 min-w-[100px] text-center">{{ calendarHeader }}</h3>
              <button @click="nextDate" class="p-1.5 rounded-full hover:bg-success-700/60 transition-colors">
                <ChevronRight class="size-3.5 text-success-200" />
              </button>
            </div>
            <div class="flex items-center gap-0.5">
              <button v-if="!isCurrentPeriodToday" @click="goToToday"
                class="text-[10px] text-success-200 hover:underline font-medium px-1">
                {{ $t('common.today') }}
              </button>
              <button @click="configStore.toggleShowAmount"
                class="p-1.5 rounded-full text-success-200 hover:bg-success-700/60 transition-colors">
                <Unlock v-if="configStore.showAmount" class="size-3" />
                <Lock v-else class="size-3" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-7 px-2 mb-1">
            <div v-for="day in WEEK_DAYS" :key="day"
              class="flex items-center justify-center h-5 text-[9px] font-medium text-white/40">
              {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 px-2 gap-y-0.5">
            <div v-for="(cell, i) in calendarDays" :key="i" class="flex items-center justify-center">
              <button @click="!cell.isOverflow && selectCalendarDay(cell)" :class="[
                'relative w-6 h-6 rounded-full text-[10px] flex items-center justify-center transition-colors',
                cell.isOverflow
                  ? 'text-white/20 cursor-default'
                  : cell.isSelected
                    ? 'bg-white/20 text-white font-semibold'
                    : cell.isToday
                      ? 'text-neon font-bold hover:bg-success-700/60'
                      : 'text-white/80 hover:bg-success-700/60',
              ]">
                {{ cell.day }}
                <span v-if="cell.isToday" :class="[
                  'absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full',
                  cell.isSelected ? 'bg-white/70' : 'bg-neon',
                ]" />
              </button>
            </div>
          </div>
        </div>

        <!-- Wallet Overview (75%) -->
        <div class="flex-1 px-7 py-5 flex flex-col">
          <!-- Label -->
          <p class="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-5">
            {{ $t('wallets.overview') }}
          </p>

          <!-- Hero: Total Balance -->
          <div class="mb-3">
            <p class="text-[10px] uppercase tracking-wide text-white/40 mb-1">{{ $t('wallets.totalBalance') }}</p>
            <p class="text-3xl font-bold text-white tracking-tight leading-none">
              {{ configStore.showAmount ? configStore.formatCurrency(overviewTotalBalance) : '••••••' }}
            </p>
          </div>

          <!-- Wallet distribution bar -->
          <div v-if="topWallets.length > 0 && overviewTotalBalance > 0" class="flex h-1 rounded-full overflow-hidden gap-px mb-5">
            <div v-for="(w, i) in topWallets" :key="w.id"
              :style="{ width: `${Math.max((w.current_balance || 0) / overviewTotalBalance * 100, 1)}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }"
              class="min-w-[4px] transition-all" />
          </div>
          <div v-else class="h-1 rounded-full bg-white/10 mb-5" />

          <!-- Secondary stats -->
          <div class="flex items-start gap-6 mt-auto">
            <!-- Net Change -->
            <div>
              <p class="text-[10px] uppercase tracking-wide text-white/40 mb-2">{{ $t('wallets.netChange') }}</p>
              <span :class="['inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
                overviewNetChange >= 0
                  ? 'bg-success-900/40 text-success-400'
                  : 'bg-error-900/40 text-error-400']">
                <TrendingUp v-if="overviewNetChange >= 0" class="size-3" />
                <TrendingDown v-else class="size-3" />
                {{ configStore.showAmount ? `${overviewNetChange >= 0 ? '+' : ''}${configStore.formatCurrency(overviewNetChange)}` : '••••••' }}
              </span>
            </div>

            <div class="w-px self-stretch bg-white/10 shrink-0" />

            <!-- Active wallets -->
            <div>
              <p class="text-[10px] uppercase tracking-wide text-white/40 mb-1.5">{{ $t('wallets.active') }}</p>
              <p class="text-xl font-bold text-white">{{ activeWalletCount }}</p>
            </div>

            <!-- Hidden wallets -->
            <div>
              <p class="text-[10px] uppercase tracking-wide text-white/40 mb-1.5">{{ $t('wallets.hidden') }}</p>
              <p class="text-xl font-bold text-white/40">{{ hiddenWalletCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile: Date Picker Bottom Sheet -->
      <Teleport to="body">
        <Transition name="sheet">
          <div v-if="showDatePicker"
            class="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end"
            @click.self="showDatePicker = false">
            <div class="w-full bg-white dark:bg-gray-800 rounded-t-2xl p-4 shadow-xl">
              <div class="w-12 h-1 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-4" />
              <div class="flex items-center justify-between mb-4">
                <button @click="pickerYear--" class="p-2 rounded-full hover:bg-sepia-100 dark:hover:bg-gray-700 transition-colors">
                  <ChevronLeft class="size-4 text-sepia-600 dark:text-gray-300" />
                </button>
                <span class="text-sm font-semibold text-sepia-900 dark:text-white">{{ pickerYear }}</span>
                <button @click="pickerYear++" class="p-2 rounded-full hover:bg-sepia-100 dark:hover:bg-gray-700 transition-colors">
                  <ChevronRight class="size-4 text-sepia-600 dark:text-gray-300" />
                </button>
              </div>
              <div class="grid grid-cols-4 gap-2 mb-4">
                <button v-for="(month, i) in MONTHS_SHORT" :key="i" @click="selectPickerMonth(i)" :class="[
                  'py-2.5 rounded-xl text-sm font-medium transition-colors',
                  pickerYear === endDate.getFullYear() && i === endDate.getMonth()
                    ? 'bg-sepia-700 dark:bg-primary-600 text-white'
                    : 'text-sepia-700 dark:text-gray-300 hover:bg-sepia-100 dark:hover:bg-gray-700',
                ]">
                  {{ month }}
                </button>
              </div>
              <button @click="showDatePicker = false"
                class="w-full py-2.5 rounded-xl text-sm font-medium text-sepia-600 dark:text-gray-400 bg-sepia-100 dark:bg-gray-700 hover:bg-sepia-200 dark:hover:bg-gray-600 transition-colors">
                {{ $t('common.cancel') }}
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Wallets Grid -->
      <div v-if="walletsStore.loading" class="card p-8">
        <LoadingSpinner fullHeight />
      </div>

      <div v-else-if="wallets.length === 0" class="card p-12 text-center">
        <div class="w-16 h-16 bg-sepia-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <WalletIcon class="w-8 h-8 text-sepia-400" />
        </div>
        <h3 class="text-lg font-medium text-sepia-900 dark:text-white mb-2">{{ $t('wallets.noWalletsYet') }}</h3>
        <p class="text-sepia-500 dark:text-gray-400 mb-6">
          {{ $t('wallets.createFirstWallet') }}
        </p>
        <button @click="showAddModal = true" class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          {{ $t('wallets.addWallet') }}
        </button>
      </div>

      <div v-else class="space-y-6">
        <!-- Wallet Distribution Chart -->
        <div class="card">
          <div
            class="flex items-center justify-between p-4 cursor-pointer select-none"
            :class="{ 'border-b border-sepia-200 dark:border-gray-700': !isDistributionCollapsed }"
            @click="toggleDistribution"
          >
            <div class="flex items-center gap-2">
              <ChevronDown
                class="w-5 h-5 text-sepia-600 dark:text-gray-400 transition-transform duration-300"
                :class="{ '-rotate-90': isDistributionCollapsed }"
              />
              <h2 class="text-base lg:text-lg font-bold text-sepia-900 dark:text-white">
                {{ $t('wallets.distribution') }} ({{ configStore.currency }})
              </h2>
            </div>
            <div class="flex items-center gap-1" @click.stop>
              <!-- Toggle Chart View -->
              <button
                @click="useCustomLegend = !useCustomLegend"
                class="p-2 rounded-lg hover:bg-sepia-100 dark:hover:bg-gray-700 transition-colors"
                :title="useCustomLegend ? 'Show chart labels' : 'Show custom legend'"
              >
                <List v-if="useCustomLegend" class="size-5 lg:size-4 text-sepia-600 dark:text-gray-400" />
                <Tag v-else class="size-5 lg:size-4 text-sepia-600 dark:text-gray-400" />
              </button>
              <button
                @click="toggleHiddenWallets"
                class="p-2 rounded-lg hover:bg-sepia-100 dark:hover:bg-gray-700 transition-colors"
                :title="showHiddenWallets ? $t('wallets.hideHidden') : $t('wallets.showHidden')"
              >
                <EyeOff v-if="showHiddenWallets" class="size-5 lg:size-4 text-sepia-600 dark:text-gray-400" />
                <Eye v-else class="size-5 lg:size-4 text-sepia-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
          <div
            class="grid transition-[grid-template-rows] duration-300 ease-out"
            :class="isDistributionCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'"
          >
            <div class="overflow-hidden">
              <div class="p-4 pt-6">
                <div v-if="visibleWallets.length === 0" class="text-center py-8">
                  <WalletIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p class="text-gray-500 dark:text-gray-400">{{ $t('wallets.noVisibleWallets') }}</p>
                </div>
                <WalletBalancePieChart v-else ref="chartRef" :chart-data="walletChartData" :use-custom-legend="useCustomLegend" />
              </div>
            </div>
          </div>
        </div>

        <!-- Wallets Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
  ChevronDown,
  Eye,
  EyeOff,
  List,
  Tag,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown,
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

// Calendar constants
const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface CalendarCell { day: number; isToday: boolean; isSelected: boolean; isOverflow: boolean; }

const isCurrentPeriodToday = computed(() => {
  const today = new Date();
  const end = endDate.value;
  return today.getFullYear() === end.getFullYear()
    && today.getMonth() === end.getMonth()
    && today.getDate() === end.getDate();
});

const calendarHeader = computed(() => format(endDate.value, 'MMMM yyyy'));

const calendarDays = computed((): CalendarCell[] => {
  const month = endDate.value.getMonth();
  const year = endDate.value.getFullYear();
  const today = new Date();
  const selected = endDate.value;
  const firstWeekDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells: CalendarCell[] = [];

  // Leading days from previous month
  for (let i = firstWeekDay - 1; i >= 0; i--)
    cells.push({ day: prevMonthDays - i, isToday: false, isSelected: false, isOverflow: true });

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === d,
      isSelected: selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === d,
      isOverflow: false,
    });
  }

  // Trailing days from next month
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    for (let d = 1; d <= 7 - remainder; d++)
      cells.push({ day: d, isToday: false, isSelected: false, isOverflow: true });
  }

  return cells;
});

const selectCalendarDay = (cell: CalendarCell) => {
  endDate.value = endOfDay(new Date(endDate.value.getFullYear(), endDate.value.getMonth(), cell.day));
  getWalletsData();
};

const goToToday = () => {
  endDate.value = endOfDay(new Date());
  getWalletsData();
};

// Mobile date picker
const showDatePicker = ref(false);
const pickerYear = ref(new Date().getFullYear());

const openDatePicker = () => {
  pickerYear.value = endDate.value.getFullYear();
  showDatePicker.value = true;
};

const selectPickerMonth = (monthIndex: number) => {
  const firstDay = configStore.firstDayOfMonth;
  const newEnd = firstDay <= 1
    ? new Date(pickerYear.value, monthIndex + 1, 0)
    : new Date(pickerYear.value, monthIndex + 1, firstDay - 1);
  endDate.value = endOfDay(newEnd);
  showDatePicker.value = false;
  getWalletsData();
};

// Wallet overview stats
const BAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const topWallets = computed(() =>
  walletsStore.wallets
    .filter(w => (w.current_balance || 0) > 0)
    .sort((a, b) => (b.current_balance || 0) - (a.current_balance || 0))
    .slice(0, 8)
);

const overviewTotalBalance = computed(() =>
  walletsStore.wallets.reduce((sum, w) => sum + (w.current_balance || 0), 0)
);

const overviewNetChange = computed(() =>
  walletsStore.wallets.reduce((sum, w) => sum + ((w.current_balance || 0) - (w.initial_balance || 0)), 0)
);

const activeWalletCount = computed(() =>
  walletsStore.wallets.filter(w => !w.hidden).length
);

const hiddenWalletCount = computed(() =>
  walletsStore.wallets.filter(w => w.hidden).length
);

const wallets = computed(() => {
  return walletsStore.wallets
    .slice();
});

const chartRef = ref<InstanceType<typeof WalletBalancePieChart> | null>(null);
const showHiddenWallets = ref(true);
const useCustomLegend = ref(true);
const isDistributionCollapsed = ref(localStorage.getItem('distributionCollapsed') === 'true');

const toggleDistribution = () => {
  isDistributionCollapsed.value = !isDistributionCollapsed.value;
  localStorage.setItem('distributionCollapsed', String(isDistributionCollapsed.value));
};

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
  return format(endOfDay(endDate.value), 'E, dd MMM yyy')
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

    const totalBalance = data.reduce((sum, w) => sum + (w.current_balance || 0), 0);
    const formatted = data.map((w, i) => {
      const pct = totalBalance > 0 ? ((w.current_balance || 0) / totalBalance * 100).toFixed(1) : '0.0';
      const status = w.hidden ? t('wallets.hidden') : t('wallets.visible');
      return `${i + 1}. ${w.name} (${status}): ${configStore.formatCurrency(w.current_balance || 0)} (${pct}%) — Initial: ${configStore.formatCurrency(w.initial_balance || 0)}`;
    });

    const llmInput = `${t('wallets.shareWalletData')}\n\n**${t('wallets.totalBalance')}:** ${configStore.formatCurrency(totalBalance)}\n**Currency:** ${configStore.currency}\n**Date:** ${format(endDate.value, 'yyyy-MM-dd')}\n\n${formatted.join("\n")}\n\n`;

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
  const today = endOfDay(new Date());

  // Calculate current period's start date
  let currentPeriodStart = new Date(today.getFullYear(), today.getMonth(), firstDay - 1);
  if (today.getDate() < firstDay) {
    currentPeriodStart.setMonth(currentPeriodStart.getMonth() - 1);
  }

  // Check if current endDate is at today (meaning user hasn't navigated yet)
  const isAtToday =
    endDateNow.getFullYear() === today.getFullYear() &&
    endDateNow.getMonth() === today.getMonth() &&
    endDateNow.getDate() === today.getDate();

  let newEnd;

  if (isAtToday) {
    // First click: go to the first day of current period
    newEnd = new Date(currentPeriodStart);
  } else {
    // Subsequent clicks: navigate to previous month period end
    const start = parseISO(endDateNow.toISOString());
    newEnd = new Date(start);
    // Set to day 1 first to avoid month overflow issues
    newEnd.setDate(1);
    // Move to previous month
    newEnd.setMonth(newEnd.getMonth() - 1);
    // Set the correct end date
    if (firstDay === 1) {
      // Get last day of this month by going to next month day 0
      newEnd.setMonth(newEnd.getMonth() + 1);
      newEnd.setDate(0);
    } else {
      newEnd.setDate(firstDay - 1);
    }
  }

  endDate.value = newEnd;
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

<style scoped>
/* Bottom sheet transition */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s ease;
}
.sheet-enter-active > div,
.sheet-leave-active > div {
  transition: transform 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from > div,
.sheet-leave-to > div {
  transform: translateY(100%);
}
</style>

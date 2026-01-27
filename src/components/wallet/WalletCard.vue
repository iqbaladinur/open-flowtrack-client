<template>
  <div
    class="card p-4 transition-all relative rounded-2xl overflow-hidden hover:bg-sepia-50/10 dark:hover:bg-gray-800/50"
  >
    <!-- Header: Icon + Badges + Actions -->
    <div class="flex items-start justify-between mb-4">
      <!-- Icon + Badges -->
      <div class="flex items-center gap-2">
        <div
          class="size-11 rounded-xl flex items-center justify-center backdrop-blur-sm shadow
                 bg-gradient-to-br from-white/60 to-sepia-200/60 dark:from-gray-500/60 dark:to-gray-600/50"
        >
          <component :is="walletIconComponent" :size="32" class="text-gray-200/0" />
        </div>
        <!-- Badges -->
        <div class="flex flex-col gap-1">
          <span
            v-if="wallet.is_main_wallet"
            class="text-[9px] font-medium px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded"
          >
            Main
          </span>
          <span
            v-if="wallet.hidden"
            class="text-[9px] font-medium px-1.5 py-0.5 bg-warning-100 dark:bg-warning-900/40 text-warning-600 dark:text-warning-400 rounded"
          >
            Excluded
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="enableActions" class="flex items-center gap-1">
        <button
          @click="$emit('edit', wallet)"
          class="p-1.5 rounded-lg text-sepia-500 dark:text-gray-400 hover:bg-sepia-100 dark:hover:bg-gray-700 hover:text-sepia-700 dark:hover:text-white transition-colors"
        >
          <Edit2 class="w-4 h-4" />
        </button>
        <button
          @click="$emit('delete', wallet.id)"
          class="p-1.5 rounded-lg text-sepia-500 dark:text-gray-400 hover:bg-error-100 dark:hover:bg-error-900/30 hover:text-error-600 dark:hover:text-error-400 transition-colors"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Name -->
    <div class="mb-3">
      <h3 class="text-sm font-medium text-sepia-800 dark:text-white truncate">
        {{ wallet.name }}
      </h3>
      <slot name="description" />
    </div>

    <!-- Balance -->
    <div class="space-y-1">
      <p
        class="text-lg font-semibold"
        :class="(wallet.current_balance || 0) >= 0 ? 'text-sepia-900 dark:text-white' : 'text-error-600 dark:text-error-400'"
      >
        {{ configStore.showAmount ? '' : '*' }}{{ configStore.formatCurrency(wallet.current_balance || 0) }}
      </p>

      <!-- Change Indicator -->
      <div class="flex items-center gap-2 text-xs">
        <div
          class="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
          :class="isPositiveChange
            ? 'bg-success-100 dark:bg-success-900/30'
            : 'bg-error-100 dark:bg-error-900/30'"
        >
          <component
            :is="isPositiveChange ? TrendingUp : TrendingDown"
            class="w-3 h-3"
            :class="isPositiveChange ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'"
          />
          <span
            class="font-medium"
            :class="isPositiveChange ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'"
          >
            {{ configStore.showAmount ? (isPositiveChange ? '+' : '') : '*' }}{{ configStore.formatCurrency(Math.abs(balanceChange)) }}
          </span>
        </div>
        <span
          v-if="wallet.initial_balance > 0"
          class="font-medium"
          :class="isPositiveChange ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'"
        >
          ({{ configStore.showAmount ? changePercentage : '**' }}%)
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Wallet } from '@/types/wallet';
import { useConfigStore } from '@/stores/config';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-vue-next';

// Import bank & e-wallet icons
import {
  BRIIcon, BCAIcon, BNIIcon, MandiriIcon, JagoIcon,
  CIMBIcon, PermataIcon, BSIIcon, JeniusIcon, SeabankIcon, BTNIcon,
  GopayIcon, OvoIcon, DanaIcon, ShopeePayIcon, LinkAjaIcon,
  BankCashIcon, WalletIcon
} from '@/components/icons';

const props = defineProps({
  wallet: {
    type: Object as () => Wallet,
    required: true,
  },
  enableActions: {
    type: Boolean,
    default: false
  }
});

defineEmits(['edit', 'delete']);

const configStore = useConfigStore();

const iconMap: Record<string, any> = {
  bri: BRIIcon,
  bca: BCAIcon,
  bni: BNIIcon,
  mandiri: MandiriIcon,
  jago: JagoIcon,
  cimb: CIMBIcon,
  permata: PermataIcon,
  bsi: BSIIcon,
  jenius: JeniusIcon,
  seabank: SeabankIcon,
  btn: BTNIcon,
  gopay: GopayIcon,
  ovo: OvoIcon,
  dana: DanaIcon,
  shopeepay: ShopeePayIcon,
  linkaja: LinkAjaIcon,
  cash: BankCashIcon,
  wallet: WalletIcon,
};

const walletIconComponent = computed(() => {
  const iconKey = props.wallet.icon || 'wallet';
  return iconMap[iconKey] || WalletIcon;
});

const balanceChange = computed(() => {
  return (props.wallet.current_balance || 0) - props.wallet.initial_balance;
});

const isPositiveChange = computed(() => {
  return balanceChange.value >= 0;
});

const changePercentage = computed(() => {
  if (props.wallet.initial_balance === 0) return '0.00';
  return ((balanceChange.value / props.wallet.initial_balance) * 100).toFixed(2);
});
</script>

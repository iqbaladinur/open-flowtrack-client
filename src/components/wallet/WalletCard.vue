<template>
  <div>
    <div
      class="card p-3 transition-all relative rounded-2xl overflow-hidden"
      :class="{ 'opacity-50': wallet.hidden }"
    >
      <!-- Wallet Info -->
      <div class="p-2 border-2 border-transparent relative">
        <div class="mb-6 flex items-center gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <div class="dark:bg-slate-400 bg-sepia-100 rounded-lg">
              <component :is="walletIconComponent" :size="38" class="text-gray-200/0" />
            </div>
          </div>
          <!-- Name & Badges -->
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-medium text-sepia-800 dark:text-white flex items-center gap-2 flex-wrap">
              <span class="truncate">{{ wallet.name }}</span>
              <span
                v-if="wallet.is_main_wallet"
                class="text-[9px] font-normal px-3 py-0 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full whitespace-nowrap"
              >
                Main
              </span>
              <span
                v-if="wallet.hidden"
                class="text-[9px] font-normal px-3 py-0 bg-green-500/40 text-white rounded-full whitespace-nowrap"
              >
                Excluded
              </span>
            </h3>
            <slot name="description" />
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span
              class="text-sm font-medium "
              :class="(wallet.current_balance || 0) >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'"
            >
              {{ configStore.formatCurrency(wallet.current_balance || 0) }}
            </span>
          </div>

          <div class="text-[11px] flex items-center justify-between">
            <span
              v-if="wallet.initial_balance > 0"
              :class="(wallet.current_balance || 0) >= wallet.initial_balance
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-error-600 dark:text-error-400'"
            >
              {{ (((wallet.current_balance || 0) - wallet.initial_balance) / wallet.initial_balance * 100).toFixed(2) }} %
            </span>
            <span class="text-gray-600 dark:text-gray-400  font-medium flex items-center gap-2">
              <component
                :is="(wallet.current_balance || 0) >= wallet.initial_balance ? TrendingUp : TrendingDown"
                class="w-4 h-4"
                :class="(wallet.current_balance || 0) >= wallet.initial_balance
                  ? 'text-success-500'
                  : 'text-error-500'"
              />
              <span
                class="font-medium "
                :class="(wallet.current_balance || 0) >= wallet.initial_balance
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-error-600 dark:text-error-400'"
              >
                {{ (wallet.current_balance || 0) >= wallet.initial_balance ? '+' : '' }}{{ configStore.formatCurrency(Math.abs((wallet.current_balance || 0) - wallet.initial_balance)) }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- Wallet Actions -->
    <div v-if="enableActions" class="flex items-center space-x-1 justify-center my-2">
      <button
        @click="$emit('edit', wallet)"
        class="p-2 text-gray-600 dark:text-white rounded btn btn-primary"
      >
        <Edit2 class="w-4 h-4" />
      </button>
      <button
        @click="$emit('delete', wallet.id)"
        class="p-2 text-gray-600 dark:text-white rounded btn btn-error"
      >
        <Trash2 class="w-4 h-4" />
      </button>
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
</script>

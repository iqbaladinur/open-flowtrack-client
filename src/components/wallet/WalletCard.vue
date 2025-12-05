<template>
  <div>
    <div
      class="card p-3 transition-all relative rounded-2xl overflow-hidden"
      :class="{ 'opacity-50': wallet.hidden }"
    >
      <!-- Wallet Info -->
      <div class="p-2 border-2 border-transparent relative">
        <div class="mb-6">
          <h3 class="text-lg font-medium text-sepia-800 dark:text-white mb-2 flex items-start gap-2">
            <span>{{ wallet.name }}</span>
            <span
              v-if="wallet.is_main_wallet"
              class="text-[9px] font-normal px-3 py-0 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full"
            >
              Main
            </span>
            <span
              v-if="wallet.hidden"
              class="text-[9px] font-normal px-3 py-0 bg-green-500/40 text-white rounded-full"
            >
              Excluded
            </span>
          </h3>
          <slot name="description" />
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
          <!-- <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500 dark:text-gray-400">Initial Balance</span>
            <span class="text-sm text-gray-600 dark:text-gray-400  font-medium">
              {{ configStore.formatCurrency(wallet.initial_balance) }}
            </span>
          </div> -->
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
import type { Wallet } from '@/types/wallet';
import { useConfigStore } from '@/stores/config';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-vue-next';

defineProps({
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
</script>
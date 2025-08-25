<template>
  <div>
    <div class="card px-6 py-4 hover:shadow-md transition-shadow relative group">
      <!-- Wallet Info -->
      <div>
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ wallet.name }}
          </h3>
          <slot name="description" />
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span
              class="text-sm font-medium font-mono"
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
            <span class="text-gray-600 dark:text-gray-400 font-mono font-medium flex items-center gap-2">
              <component
                :is="(wallet.current_balance || 0) >= wallet.initial_balance ? TrendingUp : TrendingDown"
                class="w-4 h-4"
                :class="(wallet.current_balance || 0) >= wallet.initial_balance 
                  ? 'text-success-500' 
                  : 'text-error-500'"
              />
              <span
                class="font-medium font-mono"
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
            <span class="text-sm text-gray-600 dark:text-gray-400 font-mono font-medium">
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

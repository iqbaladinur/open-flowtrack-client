<template>
  <div class="card p-6 hover:shadow-md transition-shadow relative group">
    <!-- Wallet Actions -->
    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <div class="flex items-center space-x-1">
        <button
          @click="$emit('edit', wallet)"
          class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
        >
          <Edit2 class="w-4 h-4" />
        </button>
        <button
          @click="$emit('delete', wallet.id)"
          class="p-1 text-gray-400 hover:text-error-600 dark:hover:text-error-400 rounded"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Wallet Icon -->
    <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mb-4">
      <WalletIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
    </div>

    <!-- Wallet Info -->
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ wallet.name }}
      </h3>
      
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500 dark:text-gray-400">Current Balance</span>
          <span
            class="text-xl font-bold"
            :class="wallet.balance >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'"
          >
            {{ formatCurrency(wallet.balance) }}
          </span>
        </div>
        
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500 dark:text-gray-400">Initial Balance</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ formatCurrency(wallet.initial_balance) }}
          </span>
        </div>
        
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500 dark:text-gray-400">Currency</span>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {{ wallet.currency }}
          </span>
        </div>
      </div>

      <!-- Balance Change Indicator -->
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2">
          <component
            :is="wallet.balance >= wallet.initial_balance ? TrendingUp : TrendingDown"
            class="w-4 h-4"
            :class="wallet.balance >= wallet.initial_balance 
              ? 'text-success-500' 
              : 'text-error-500'"
          />
          <span
            class="text-sm font-medium"
            :class="wallet.balance >= wallet.initial_balance 
              ? 'text-success-600 dark:text-success-400' 
              : 'text-error-600 dark:text-error-400'"
          >
            {{ wallet.balance >= wallet.initial_balance ? '+' : '' }}{{ formatCurrency(Math.abs(wallet.balance - wallet.initial_balance)) }}
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            from initial
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Wallet } from '@/types';
import { Wallet as WalletIcon, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-vue-next';

const props = defineProps({
  wallet: {
    type: Object as () => Wallet,
    required: true,
  },
});

defineEmits(['edit', 'delete']);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.wallet.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
</script>

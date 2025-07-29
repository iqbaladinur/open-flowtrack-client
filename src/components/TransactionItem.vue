<template>
  <div class="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-xs">
    <div class="flex items-start space-x-3">
      <!-- Category Icon -->
      <div
        v-if="transaction.category"
        class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
        :style="{ backgroundColor: transaction.category.color + '20', color: transaction.category.color }"
      >
        <component :is="icons[transaction.category.icon] || icons['Tag']" class="w-5 h-5" />
      </div>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <!-- Top Row: Details and Amount -->
        <div class="flex justify-between items-start">
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <p class="font-medium text-gray-900 dark:text-white truncate">
                {{ transaction.category?.name || 'Uncategorized' }}
              </p>
              <component
                v-if="showType"
                :is="transaction.type === 'income' ? TrendingUp : TrendingDown"
                class="w-4 h-4 ml-2 flex-shrink-0"
                :class="transaction.type === 'income' ? 'text-success-500' : 'text-error-500'"
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {{ transaction.wallet?.name }} • {{ formatDate(transaction.date) }}
            </p>
          </div>
          <div class="text-right ml-2 flex-shrink-0">
            <p
              class="font-medium font-mono"
              :class="transaction.type === 'income' 
                ? 'text-success-600 dark:text-success-400' 
                : 'text-error-600 dark:text-error-400'"
            >
              {{ transaction.type === 'income' ? '+' : '-' }}{{ configStore.formatCurrency(transaction.amount) }}
            </p>
          </div>
        </div>

        <!-- Bottom Row: Note and Actions -->
        <div class="flex justify-between items-end mt-1">
          <p v-if="transaction.note" class="text-xs text-gray-500 dark:text-gray-400 truncate flex-1 min-w-0 pr-2">
            {{ transaction.note }}
          </p>
          <div 
            v-if="showActions" 
            class="flex items-center space-x-1 flex-shrink-0"
            :class="{ 'ml-auto': !transaction.note }"
          >
            <button
              @click="$emit('edit', transaction)"
              class="p-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              @click="$emit('delete', transaction.id)"
              class="p-2 rounded-full text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-error-600 dark:hover:text-error-400 transition-colors"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '@/types';
import { useConfigStore } from '@/stores/config';
import * as icons from 'lucide-vue-next';
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-vue-next';

defineProps({
  transaction: {
    type: Object as () => Transaction,
    required: true,
  },
  showType: {
    type: Boolean,
    default: false,
  },
  showActions: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['edit', 'delete']);

const configStore = useConfigStore();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
</script>

<template>
  <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs">
    <div class="flex items-start space-x-3">
      <!-- Icon -->
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
        :class="transaction.type === 'income' 
          ? 'bg-success-100 dark:bg-success-900' 
          : 'bg-error-100 dark:bg-error-900'"
      >
        <component
          :is="transaction.type === 'income' ? TrendingUp : TrendingDown"
          class="w-5 h-5"
          :class="transaction.type === 'income' 
            ? 'text-success-600 dark:text-success-400' 
            : 'text-error-600 dark:text-error-400'"
        />
      </div>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <!-- Top Row: Details and Amount -->
        <div class="flex justify-between items-start">
          <div class="flex-1 min-w-0">
            <div class="flex items-center">
              <p class="font-medium text-gray-900 dark:text-white truncate">
                {{ transaction.category?.name }}
              </p>
              <span
                v-if="showType"
                class="ml-2 flex-shrink-0 inline-flex items-center px-2 py-[2px] rounded-full text-xs font-medium"
                :class="transaction.type === 'income' 
                  ? 'bg-success-100 text-success-800 dark:bg-success-800 dark:text-success-200' 
                  : 'bg-error-100 text-error-800 dark:bg-error-800 dark:text-error-200'"
              >
                {{ transaction.type }}
              </span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
              {{ transaction.wallet?.name }} • {{ formatDate(transaction.date) }}
            </p>
          </div>
          <div class="text-right ml-2 flex-shrink-0">
            <p
              class="font-semibold"
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
          <p v-if="transaction.note" class="text-sm text-gray-500 dark:text-gray-400 truncate flex-1 min-w-0 pr-2">
            {{ transaction.note }}
          </p>
          <div 
            v-if="showActions" 
            class="flex items-center space-x-1 flex-shrink-0"
            :class="{ 'ml-auto': !transaction.note }"
          >
            <button
              @click="$emit('edit', transaction)"
              class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Edit2 class="w-4 h-4" />
            </button>
            <button
              @click="$emit('delete', transaction.id)"
              class="p-1 text-gray-400 hover:text-error-600 dark:hover:text-error-400"
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
import { TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-vue-next';

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
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script>

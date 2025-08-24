<template>
  <Modal v-model="show" title="Filter Categories">
    <div class="p-4 space-y-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Select categories to exclude from the transaction list and calculations.
      </p>
      <div class="max-h-72 overflow-y-auto">
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="category in categories"
            :key="category.id"
            @click="toggleCategory(category.id)"
            class="relative card p-3 flex flex-col items-center justify-center text-center h-28 cursor-pointer border-2 transition-all"
            :class="category.id && internalExcludedCategories.includes(category.id) ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            <!-- Income/Expense Icon -->
            <div class="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-600/20">
              <TrendingUp v-if="category.type === 'income'" class="w-3 h-3 text-success-600 dark:text-success-400" />
              <TrendingDown v-else-if="category.type === 'expense'" class="w-3 h-3 text-error-600 dark:text-error-400" />
            </div>

            <!-- Selected Check Icon -->
            <div v-if="category.id && internalExcludedCategories.includes(category.id)" class="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white">
              <Check class="w-3 h-3" />
            </div>

            <!-- Category Icon -->
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center mb-2"
              :style="{ backgroundColor: category.color + '20' }"
            >
              <component :is="getIcon(category.icon)" class="w-4 h-4" :style="{ color: category.color }" />
            </div>
            <p class="text-xs text-gray-800 dark:text-gray-200 leading-tight">
              {{ category.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-between items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800/50">
        <button 
          @click="clearSelection" 
          class="btn btn-ghost text-error-600 dark:text-error-400"
          :disabled="internalExcludedCategories.length === 0"
        >
          Clear Selection
        </button>
        <div class="flex gap-2">
          <button @click="closeModal" class="btn btn-secondary">Cancel</button>
          <button @click="applyFilter" class="btn btn-primary">Apply</button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue';
import Modal from '@/components/ui/Modal.vue';
import type { Category } from '@/types/category';
import { getIcon } from '@/utils/icons';
import { Check, TrendingUp, TrendingDown } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: boolean;
  categories: Category[];
  excludedCategories: string[];
}>();

const emit = defineEmits(['update:modelValue', 'update:excludedCategories']);

const { modelValue, excludedCategories } = toRefs(props);

const show = ref(modelValue.value);
const internalExcludedCategories = ref<string[]>([...excludedCategories.value]);

watch(modelValue, (newValue) => {
  show.value = newValue;
  if (newValue) {
    // Reset internal state when modal is opened
    internalExcludedCategories.value = [...excludedCategories.value];
  }
});

watch(show, (newValue) => {
  if (!newValue) {
    emit('update:modelValue', false);
  }
});

const toggleCategory = (categoryId?: string) => {
  if (!categoryId) {
    return;
  }
  const index = internalExcludedCategories.value.indexOf(categoryId);
  if (index > -1) {
    internalExcludedCategories.value.splice(index, 1);
  } else {
    internalExcludedCategories.value.push(categoryId);
  }
};

const clearSelection = () => {
  internalExcludedCategories.value = [];
};

const closeModal = () => {
  show.value = false;
};

const applyFilter = () => {
  emit('update:excludedCategories', internalExcludedCategories.value);
  closeModal();
};
</script>
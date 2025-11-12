<template>
  <Modal v-model="show" :title="$t('categoryFilterModal.title')">
    <div class="p-0 space-y-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ $t('categoryFilterModal.description') }}
      </p>

      <!-- Search Input -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('categoryFilterModal.searchPlaceholder')"
          class="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary-400"
        />
      </div>

      <div class="max-h-72 overflow-y-auto">
        <!-- Empty State -->
        <div v-if="sortedCategories.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
          <Search class="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            {{ $t('categoryFilterModal.noResults') }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ $t('categoryFilterModal.tryDifferentSearch') }}
          </p>
        </div>

        <!-- Categories Grid -->
        <div v-else class="grid grid-cols-3 gap-2">
          <button
            v-for="category in sortedCategories"
            :key="category.id"
            @click="toggleCategory(category.id)"
            class="relative flex flex-col items-center justify-center gap-2 rounded-lg border bg-white p-3 text-center transition-all h-28 cursor-pointer"
            :class="category.id && internalExcludedCategories.includes(category.id)
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400'
              : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800'"
          >
            <!-- Type Indicator Badge -->
            <div class="absolute left-2 top-2">
              <div
                class="flex items-center justify-center rounded-md p-1"
                :class="
                  category.type === 'income'
                    ? 'bg-success-100 dark:bg-success-900/30'
                    : 'bg-error-100 dark:bg-error-900/30'
                "
              >
                <component
                  :is="category.type === 'income' ? TrendingUp : TrendingDown"
                  class="h-3 w-3"
                  :class="
                    category.type === 'income'
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-error-600 dark:text-error-400'
                  "
                />
              </div>
            </div>

            <!-- Selected Check Icon -->
            <div
              v-if="category.id && internalExcludedCategories.includes(category.id)"
              class="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white"
            >
              <Check class="h-3 w-3" />
            </div>

            <!-- Category Icon -->
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg"
              :style="{ backgroundColor: category.color + '15' }"
            >
              <component :is="getIcon(category.icon)" class="h-5 w-5" :style="{ color: category.color }" />
            </div>

            <!-- Category Name -->
            <p class="w-full truncate text-xs font-medium text-gray-900 dark:text-gray-100">
              {{ category.name }}
            </p>
          </button>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-between items-center gap-2 p-0 bg-gray-50 dark:bg-gray-800/50">
        <button
          @click="toggleSelectAll"
          class="btn-ghost btn-borderless"
          :class="{
            'text-error-600 dark:text-error-400': allCategoriesSelected,
            'text-primary-600 dark:text-primary-400': !allCategoriesSelected,
          }"
        >
          {{ allCategoriesSelected ? $t('categoryFilterModal.clearSelection') : $t('categoryFilterModal.selectAll') }}
        </button>
        <div class="flex gap-2">
          <button @click="closeModal" class="btn btn-secondary">{{ $t('categoryFilterModal.cancel') }}</button>
          <button @click="applyFilter" class="btn btn-primary">{{ $t('categoryFilterModal.apply') }}</button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, toRefs, computed } from 'vue';
import Modal from '@/components/ui/Modal.vue';
import type { Category } from '@/types/category';
import { getIcon } from '@/utils/icons';
import { Check, TrendingUp, TrendingDown, Search } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: boolean;
  categories: Category[];
  excludedCategories: string[];
}>();

const emit = defineEmits(['update:modelValue', 'update:excludedCategories']);

const { modelValue, categories, excludedCategories } = toRefs(props);

const show = ref(modelValue.value);
const internalExcludedCategories = ref<string[]>([...excludedCategories.value]);
const searchQuery = ref('');

const sortedCategories = computed(() => {
  return [...categories.value]
    .filter(category => {
      // Filter by search query
      if (!searchQuery.value.trim()) return true;
      return category.name.toLowerCase().includes(searchQuery.value.toLowerCase().trim());
    })
    .sort((a, b) => {
      // First sort by type: income first, then expense
      if (a.type !== b.type) {
        return a.type === 'income' ? -1 : 1;
      }
      // Then sort alphabetically by name
      return a.name.localeCompare(b.name);
    });
});

const allCategoriesSelected = computed(() => {
  return internalExcludedCategories.value.length === categories.value.length;
});

watch(modelValue, (newValue) => {
  show.value = newValue;
  if (newValue) {
    // Reset internal state when modal is opened
    internalExcludedCategories.value = [...excludedCategories.value];
    searchQuery.value = '';
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

const toggleSelectAll = () => {
  if (allCategoriesSelected.value) {
    internalExcludedCategories.value = [];
  } else {
    internalExcludedCategories.value = categories.value.map((c) => c.id).filter((id): id is string => !!id);
  }
};

const closeModal = () => {
  show.value = false;
};

const applyFilter = () => {
  emit('update:excludedCategories', internalExcludedCategories.value);
  closeModal();
};
</script>
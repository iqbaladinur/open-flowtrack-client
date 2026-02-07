<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl lg:text-3xl font-bold text-sepia-900 dark:text-neon">{{ $t('categories.title') }}</h1>
          <p class="text-sepia-600 dark:text-gray-400 mt-1 text-sm">
            {{ $t('categories.subtitle') }}
          </p>
        </div>

        <div class="flex items-center gap-2 justify-end">
          <div class="flex items-center gap-2 justify-end">
            <button @click="filterType = ''" :class="['btn', filterType === '' ? 'text-sepia-700 dark:text-neon' : 'btn-secondary']" class="p-2">
              <LayoutGrid class="size-4" />
            </button>
            <button @click="filterType = 'income'" :class="['btn', filterType === 'income' ? 'text-sepia-700 dark:text-neon' : 'btn-secondary']" class="flex items-center gap-2 text-xs p-2">
              <TrendingUp class="size-4" />
            </button>
            <button @click="filterType = 'expense'" :class="['btn', filterType === 'expense' ? 'text-sepia-700 dark:text-neon' : 'btn-secondary']" class="flex items-center gap-2 text-xs p-2">
              <TrendingDown class="size-4" />
            </button>
          </div>
          <button @click="showAddModal = true" class="btn-primary hidden sm:flex p-2">
            <Plus class="size-4" />
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="relative w-full md:w-[360px]">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="size-4 text-sepia-400 dark:text-gray-500" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('categories.searchPlaceholder')"
          class="input pl-10 pr-10 w-full rounded-xl"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X class="size-4 text-sepia-400 dark:text-gray-500 hover:text-sepia-600 dark:hover:text-gray-300" />
        </button>
      </div>

      <!-- Categories List -->
      <div v-if="categoriesStore.loading && categories.length === 0" class="card p-8">
        <LoadingSpinner fullHeight />
      </div>

      <div v-else-if="categories.length === 0 && !categoriesStore.loading" class="card p-12 text-center">
        <div class="w-16 h-16 bg-sepia-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag class="w-8 h-8 text-sepia-400 dark:text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-sepia-900 dark:text-white mb-2">{{ $t('categories.noCategoriesFound') }}</h3>
        <p class="text-sepia-500 dark:text-gray-400 mb-6">
          {{ $t('categories.createFirstCategory') }}
        </p>
        <button @click="showAddModal = true" class="btn-primary">
          <Plus class="size-4 mr-2" />
          {{ $t('categories.addCategory') }}
        </button>
      </div>

      <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
        <CategoryCard
          v-for="category in categories"
          :key="category.id"
          :category="category"
          @edit="editCategory"
          @delete="deleteCategory"
        />
      </div>
    </div>

    <!-- Floating Add Button for Mobile -->
    <button @click="showAddModal = true" class="sm:hidden fixed bottom-[70px] right-6 z-[20] btn-primary rounded-xl p-3 shadow-lg flex items-center justify-center">
      <Plus class="w-6 h-6" />
      <span class="sr-only">{{ $t('categories.addCategory') }}</span>
    </button>

    <!-- Add/Edit Category Modal -->
    <CategoryModal
      v-model="showAddModal"
      :category="selectedCategory"
      @success="handleCategorySaved"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCategoriesStore } from '@/stores/categories';
import AppLayout from '@/components/layouts/AppLayout.vue';
import CategoryModal from '@/components/category/CategoryModal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import CategoryCard from '@/components/category/CategoryCard.vue';
import type { Category } from '@/types/category';
import { Plus, Tag, TrendingUp, TrendingDown, LayoutGrid, Search, X } from 'lucide-vue-next';

const { t } = useI18n();
const categoriesStore = useCategoriesStore();

const showAddModal = ref(false);
const selectedCategory = ref<Category | null>(null);
const filterType = ref<'income' | 'expense' | ''>('');
const searchQuery = ref('');

const categories = computed(() => {
  return categoriesStore.categories
    .filter(category => {
      // Filter by type
      if (filterType.value && category.type !== filterType.value) {
        return false;
      }
      // Filter by search query
      if (searchQuery.value) {
        return category.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      }
      return true;
    })
    .slice()
    .sort((a, b) => {
      // First sort by type: income first, then expense
      if (a.type !== b.type) {
        return a.type === 'income' ? -1 : 1;
      }
      // Then sort alphabetically by name
      return a.name.localeCompare(b.name);
    });
});

const editCategory = (category: Category) => {
  selectedCategory.value = category;
  showAddModal.value = true;
};

const deleteCategory = async (id: string) => {
  if (confirm(t('categories.deleteConfirm'))) {
    const result = await categoriesStore.deleteCategory(id);
    if (!result.success && result.error) {
      alert(result.error);
    }
  }
};

const handleCategorySaved = () => {
  showAddModal.value = false;
  categoriesStore.fetchCategories();
};

watch(showAddModal, (isShowing) => {
  if (!isShowing) {
    selectedCategory.value = null;
  }
});

onMounted(() => {
  categoriesStore.fetchCategories();
});
</script>

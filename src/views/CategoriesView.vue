<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-neon">Categories</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Organize your transactions by category
          </p>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      <!-- Filters -->
      <div class="card p-4">
        <div>
          <label class="label mb-2">Filter by Type</label>
          <div class="flex items-center space-x-2">
            <button @click="filterType = ''" :class="['btn', filterType === '' ? 'btn-primary' : 'btn-secondary']">
              <LayoutGrid class="w-4 h-4 mr-1.5" />
              All
            </button>
            <button @click="filterType = 'income'" :class="['btn', filterType === 'income' ? 'btn-primary' : 'btn-secondary']">
              <TrendingUp class="w-4 h-4 mr-1.5" />
              Income
            </button>
            <button @click="filterType = 'expense'" :class="['btn', filterType === 'expense' ? 'btn-primary' : 'btn-secondary']">
              <TrendingDown class="w-4 h-4 mr-1.5" />
              Expense
            </button>
          </div>
        </div>
      </div>

      <!-- Categories List -->
      <div v-if="categoriesStore.loading" class="card p-8">
        <LoadingSpinner fullHeight />
      </div>

      <div v-else-if="categories.length === 0" class="card p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Create your first category to start organizing your finances.
        </p>
        <button @click="showAddModal = true" class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        <CategoryCard
          v-for="category in categories"
          :key="category.id"
          :category="category"
          @edit="editCategory"
          @delete="deleteCategory"
        />
      </div>
    </div>

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
import { useCategoriesStore } from '@/stores/categories';
import AppLayout from '@/components/layouts/AppLayout.vue';
import CategoryModal from '@/components/CategoryModal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import CategoryCard from '@/components/CategoryCard.vue';
import type { Category } from '@/types';
import { Plus, Tag, TrendingUp, TrendingDown, LayoutGrid } from 'lucide-vue-next';

const categoriesStore = useCategoriesStore();

const showAddModal = ref(false);
const selectedCategory = ref<Category | null>(null);
const filterType = ref<'income' | 'expense' | ''>('');

const categories = computed(() => {
  return categoriesStore.categories
    .filter(category => {
      if (!filterType.value) return true;
      return category.type === filterType.value;
    })
    .slice()
    // @ts-ignore
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
});

const editCategory = (category: Category) => {
  selectedCategory.value = category;
  showAddModal.value = true;
};

const deleteCategory = async (id: string) => {
  if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
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

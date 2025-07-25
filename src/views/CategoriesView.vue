<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">Type</label>
            <select v-model="filterType" class="input">
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
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
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories yet</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Create your first category to start organizing your finances
        </p>
        <button @click="showAddModal = true" class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
import { Plus, Tag } from 'lucide-vue-next';

const categoriesStore = useCategoriesStore();

const showAddModal = ref(false);
const selectedCategory = ref<Category | null>(null);
const filterType = ref<'income' | 'expense' | ''>('');

const categories = computed(() => {
  return categoriesStore.categories
    .slice()
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
  selectedCategory.value = null;
  categoriesStore.fetchCategories(filterType.value || undefined);
};

watch(filterType, (newType) => {
  categoriesStore.fetchCategories(newType || undefined);
});

onMounted(() => {
  categoriesStore.fetchCategories();
});
</script>

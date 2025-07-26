<template>
  <Modal v-model="isModalOpen" :title="category ? 'Edit Category' : 'Add Category'">
    <form @submit.prevent="handleSubmit" id="category-form" class="space-y-4">
      <!-- Category Name -->
      <div>
        <label for="name" class="label">Category Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="input"
          placeholder="e.g., Groceries, Salary"
          :disabled="loading"
        />
      </div>

      <!-- Type -->
      <div>
        <label class="label">Type</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="form.type = 'income'"
            class="p-3 rounded-lg border-2 transition-all"
            :class="form.type === 'income' 
              ? 'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
          >
            <TrendingUp class="w-5 h-5 mx-auto mb-1" />
            <span class="text-sm font-medium">Income</span>
          </button>
          <button
            type="button"
            @click="form.type = 'expense'"
            class="p-3 rounded-lg border-2 transition-all"
            :class="form.type === 'expense' 
              ? 'border-error-500 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
          >
            <TrendingDown class="w-5 h-5 mx-auto mb-1" />
            <span class="text-sm font-medium">Expense</span>
          </button>
        </div>
      </div>

      <!-- Preview -->
      <div>
        <label class="label">Preview</label>
        <div class="card p-4 flex items-center space-x-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="{ backgroundColor: form.color + '20' }">
            <component :is="icons[form.icon] || icons['Tag']" class="w-6 h-6" :style="{ color: form.color }" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ form.name || 'Category Name' }}
            </h3>
            <span 
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="form.type === 'income' ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200' : 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200'"
            >
              {{ form.type }}
            </span>
          </div>
        </div>
      </div>

      <!-- Icon -->
      <div>
        <label class="label">Icon</label>
        <div class="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <button
            v-for="icon in iconList"
            :key="icon"
            type="button"
            @click="form.icon = icon"
            class="h-10 w-10 flex items-center justify-center rounded-lg transition-all"
            :class="form.icon === icon
              ? 'bg-primary-500 text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-primary-500'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'"
          >
            <component :is="icons[icon]" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Color -->
      <div>
        <label for="color" class="label">Color</label>
        <div class="relative">
          <input id="color" v-model="form.color" type="color" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <div 
            class="w-full h-10 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center px-3"
            :style="{ backgroundColor: form.color + '33' }"
          >
            <div class="w-full h-4 rounded" :style="{ backgroundColor: form.color }"></div>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
        <p class="text-sm text-error-700 dark:text-error-300">{{ error }}</p>
      </div>
    </form>
    <template #footer>
      <div class="flex space-x-3">
        <button
          type="button"
          @click="$emit('update:modelValue', false)"
          class="flex-1 btn-secondary"
          :disabled="loading"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="category-form"
          class="flex-1 btn-primary"
          :disabled="loading || !isFormValid"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>{{ category ? 'Update' : 'Create' }} Category</span>
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useCategoriesStore } from '@/stores/categories';
import Modal from '@/components/ui/Modal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import type { Category } from '@/types';
import * as icons from 'lucide-vue-next';
import { TrendingUp, TrendingDown } from 'lucide-vue-next';

const iconList = [
  'Tag', 'Home', 'Car', 'UtensilsCrossed', 'ShoppingBag', 'HeartPulse', 
  'GraduationCap', 'Briefcase', 'Gift', 'Film', 'Plane', 'Phone', 
  'Bolt', 'PawPrint', 'Landmark', 'Shirt', 'Book', 'Coffee', 
  'Dumbbell', 'Wrench', 'Baby', 'Pizza', 'Gamepad2', 'Music', 'Receipt',
  'DollarSign', 'CreditCard', 'PiggyBank', 'Bus', 'Train',
  'Building', 'Hospital', 'Droplets', 'Wind', 'Sun', 'Moon', 'Cloud',
  'Laptop', 'Smartphone', 'Tablet', 'Headphones', 'Watch', 'MousePointer',
  'ShoppingCart', 'Ticket', 'Trophy', 'Users', 'User', 'Key'
];

interface Props {
  modelValue: boolean;
  category?: Category | null;
}

const props = withDefaults(defineProps<Props>(), {
  category: null,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'success': [];
}>();

const categoriesStore = useCategoriesStore();

const loading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
  type: 'expense' as 'income' | 'expense',
  icon: 'Tag',
  color: '#888888',
});

const isFormValid = computed(() => {
  return form.name.trim() && form.type && form.icon && form.color;
});

const handleSubmit = async () => {
  if (!isFormValid.value || loading.value) return;

  loading.value = true;
  error.value = '';

  try {
    const categoryData = {
      name: form.name.trim(),
      type: form.type,
      icon: form.icon,
      color: form.color,
    };

    let result;
    if (props.category) {
      result = await categoriesStore.updateCategory(props.category.id, categoryData);
    } else {
      result = await categoriesStore.createCategory(categoryData);
    }

    if (result.success) {
      emit('success');
      resetForm();
    } else {
      error.value = result.error || 'Failed to save category. Please try again.';
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const resetForm = () => {
  Object.assign(form, {
    name: '',
    type: 'expense' as 'income' | 'expense',
    icon: 'Tag',
    color: '#888888',
  });
};

// Watch for category changes to populate form
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    Object.assign(form, {
      name: newCategory.name,
      type: newCategory.type,
      icon: newCategory.icon,
      color: newCategory.color,
    });
  } else {
    resetForm();
  }
}, { immediate: true });
</script>

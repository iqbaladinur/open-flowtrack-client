<template>
  <Modal v-model="isModalOpen" :title="category ? 'Edit Category' : 'Add Category'">
    <form @submit.prevent="handleSubmit" class="space-y-4">
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

      <!-- Icon -->
      <div>
        <label for="icon" class="label">Icon</label>
        <select id="icon" v-model="form.icon" class="input">
          <option v-for="icon in iconList" :key="icon" :value="icon">{{ icon }}</option>
        </select>
      </div>

      <!-- Color -->
      <div>
        <label for="color" class="label">Color</label>
        <input id="color" v-model="form.color" type="color" class="input h-10" />
      </div>

      <!-- Error Display -->
      <div v-if="error" class="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
        <p class="text-sm text-error-700 dark:text-error-300">{{ error }}</p>
      </div>

      <!-- Form Actions -->
      <div class="flex space-x-3 pt-4">
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
          class="flex-1 btn-primary"
          :disabled="loading || !isFormValid"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>{{ category ? 'Update' : 'Create' }} Category</span>
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useCategoriesStore } from '@/stores/categories';
import Modal from '@/components/ui/Modal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import type { Category } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-vue-next';

const iconList = [
  'Tag', 'Home', 'Car', 'UtensilsCrossed', 'ShoppingBag', 'HeartPulse', 
  'GraduationCap', 'Briefcase', 'Gift', 'Film', 'Plane', 'Phone', 
  'Bolt', 'PawPrint', 'Landmark', 'Shirt', 'Book', 'Coffee', 
  'Dumbbell', 'Wrench', 'Baby', 'Pizza', 'Gamepad2', 'Music', 'Receipt',
  'DollarSign', 'CreditCard', 'PiggyBank'
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

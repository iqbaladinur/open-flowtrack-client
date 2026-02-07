<template>
  <Modal v-model="isModalOpen" :title="category ? $t('categoryModal.editCategory') : $t('categoryModal.addCategory')">
    <form @submit.prevent="handleSubmit" id="category-form" class="space-y-4">
      <!-- Category Name -->
      <div>
        <label for="name" class="label">{{ $t('categoryModal.categoryName') }}</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="input"
          :placeholder="$t('categoryModal.categoryNamePlaceholder')"
          :disabled="loading"
        />
      </div>

      <!-- Type -->
      <div>
        <label class="label">{{ $t('categoryModal.type') }}</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="form.type = 'income'"
            class="py-2 rounded-lg border-2 transition-all text-success-700 dark:text-success-300"
            :class="form.type === 'income'
              ? 'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300'
              : 'border-sepia-300 dark:border-gray-600 hover:border-sepia-400 dark:hover:border-gray-500'"
          >
            <TrendingUp class="size-4 mx-auto" />
            <span class="text-xs font-medium">{{ $t('categoryModal.income') }}</span>
          </button>
          <button
            type="button"
            @click="form.type = 'expense'"
            class="py-2 rounded-lg border-2 transition-all text-error-700 dark:text-error-300"
            :class="form.type === 'expense'
              ? 'border-error-500 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300'
              : 'border-sepia-300 dark:border-gray-600 hover:border-sepia-400 dark:hover:border-gray-500'"
          >
            <TrendingDown class="size-4 mx-auto" />
            <span class="text-xs font-medium">{{ $t('categoryModal.expense') }}</span>
          </button>
        </div>
      </div>

      <!-- Preview & Color -->
      <div class="flex items-start gap-4">
        <!-- Preview -->
        <div class="flex-shrink-0">
          <label class="label">{{ $t('categoryModal.preview') }}</label>
          <div class="w-20">
            <div class="card p-2.5 aspect-square flex flex-col items-center justify-center text-center relative">
              <!-- Type Indicator -->
              <div class="absolute top-1 left-1">
                <component
                  :is="form.type === 'income' ? TrendingUp : TrendingDown"
                  class="w-3 h-3"
                  :class="form.type === 'income' ? 'text-success-500' : 'text-error-500'"
                />
              </div>

              <!-- Category Icon -->
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5"
                :style="{ backgroundColor: form.color + '20' }"
              >
                <!-- @vue-ignore -->
                <component :is="getIcon(form.icon)" class="w-4 h-4" :style="{ color: form.color }" />
              </div>

              <!-- Category Info -->
              <h3 class="text-[10px] font-medium text-gray-700 dark:text-gray-300 truncate w-full">
                {{ form.name || $t('categoryModal.category') }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Color -->
        <div class="flex-1">
          <label for="color" class="label">{{ $t('categoryModal.color') }}</label>
          <div class="relative h-20">
            <input id="color" v-model="form.color" type="color" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div
              class="w-full h-full rounded-lg border-2 border-sepia-200 dark:border-gray-700 flex items-center justify-center"
              :style="{ backgroundColor: form.color + '20' }"
            >
              <div class="flex flex-col items-center gap-1">
                <div class="w-10 h-10 rounded-lg shadow-sm" :style="{ backgroundColor: form.color }"></div>
                <span class="text-xs font-mono text-sepia-600 dark:text-gray-400">{{ form.color }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Icon -->
      <div>
        <label class="label">{{ $t('categoryModal.icon') }}</label>
        <div class="max-h-52 sm:max-h-44 overflow-y-auto rounded-lg bg-sepia-50 dark:bg-gray-800 p-3">
          <div class="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 gap-2.5 sm:gap-2">
            <button
              v-for="icon in iconList"
              :key="icon"
              type="button"
              @click="form.icon = icon"
              class="h-11 w-11 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg transition-all active:scale-95"
              :class="form.icon === icon
                ? 'bg-sepia-500 dark:bg-primary-500 text-white ring-2 ring-sepia-500 dark:ring-primary-500'
                : 'bg-sepia-200 dark:bg-gray-700 text-sepia-600 dark:text-gray-300 hover:bg-sepia-300 dark:hover:bg-gray-600'"
            >
              <!-- @vue-ignore -->
              <component :is="getIcon(icon)" class="w-5 h-5 sm:w-4.5 sm:h-4.5" />
            </button>
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
          {{ $t('categoryModal.cancel') }}
        </button>
        <button
          type="submit"
          form="category-form"
          class="flex-1 btn-primary"
          :disabled="loading || !isFormValid"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>{{ category ? $t('categoryModal.update') : $t('categoryModal.create') }} {{ $t('categoryModal.category') }}</span>
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCategoriesStore } from '@/stores/categories';
import Modal from '@/components/ui/Modal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import type { Category } from '@/types/category';
import { getIcon, iconList } from '@/utils/icons';
import { TrendingUp, TrendingDown } from 'lucide-vue-next';

interface Props {
  modelValue: boolean;
  category?: Category | null;
}

const props = withDefaults(defineProps<Props>(), {
  category: null,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'success': [value?: Category];
}>();

const { t } = useI18n();
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
      result = await categoriesStore.updateCategory(props.category.id!, categoryData);
    } else {
      result = await categoriesStore.createCategory(categoryData);
    }

    if (result.success) {
      emit('success', result.data);
      resetForm();
    } else {
      error.value = result.error || t('categoryModal.saveFailed');
    }
  } catch (err) {
    error.value = t('categoryModal.unexpectedError');
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

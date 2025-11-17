<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- 2 Card Layout: Desktop side-by-side, Mobile stacked -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Card 1: Milestone Information -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Milestone Information
        </h3>

        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label for="name" class="label">
              Name <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              maxlength="200"
              placeholder="e.g., Emergency Fund - 30 Juta"
              class="input"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="label">
              Description
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="2"
              maxlength="1000"
              placeholder="Describe your milestone..."
              class="input"
            />
          </div>

          <!-- Target Date -->
          <div>
            <label for="target_date" class="label">
              Target Date <span class="text-red-500">*</span>
            </label>
            <input
              id="target_date"
              v-model="formData.target_date"
              type="date"
              required
              class="input"
            />
          </div>

          <!-- Appearance -->
          <div>
            <label class="label mb-2">Appearance</label>

            <div class="flex gap-3">
              <!-- Icon Picker Button (Square) -->
              <div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">Icon</p>
                <button
                  type="button"
                  @click="showIconPicker = true"
                  class="w-14 h-14 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all flex items-center justify-center flex-shrink-0"
                >
                  <component :is="getIcon(formData.icon)" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              <!-- Color Picker (Flex-1) -->
              <div class="flex-1">
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">Color</p>
                <div class="relative h-14">
                  <input
                    v-model="formData.color"
                    type="color"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    class="w-full h-full border-2 border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                  >
                    <div class="w-8 h-8 rounded-md" :style="{ backgroundColor: formData.color }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Color Presets -->
            <div class="mt-3">
              <div class="flex items-center gap-1.5">
                <button
                  v-for="color in colorPalette"
                  :key="color"
                  type="button"
                  @click="formData.color = color"
                  class="w-6 h-6 rounded-md transition-all border-2 flex-shrink-0"
                  :class="formData.color === color
                    ? 'border-gray-900 dark:border-white scale-110'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'"
                  :style="{ backgroundColor: color }"
                  :title="color"
                >
                  <span class="sr-only">{{ color }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Conditions -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Conditions <span class="text-red-500">*</span>
          </h3>
          <button
            v-if="formData.conditions.length < 10"
            type="button"
            @click="addCondition"
            class="btn btn-sm btn-primary"
          >
            <Plus class="w-4 h-4 mr-1" />
            Add
          </button>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Add 1-10 conditions to track your milestone progress
        </p>

        <!-- Conditions List -->
        <div v-if="formData.conditions.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          No conditions yet. Click "Add" to get started.
        </div>

        <div v-else class="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          <div
            v-for="(condition, index) in formData.conditions"
            :key="index"
            class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div class="flex items-start justify-between mb-3">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Condition {{ index + 1 }}
              </span>
              <button
                type="button"
                @click="removeCondition(index)"
                class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>

            <!-- Condition Type Selection -->
            <div class="mb-3">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Type
              </label>
              <select
                v-model="condition.type"
                @change="resetConditionConfig(index)"
                required
                class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select condition type...</option>
                <option v-for="template in conditionTemplates" :key="template.value" :value="template.value">
                  {{ template.label }}
                </option>
              </select>
            </div>

            <!-- Dynamic Condition Config Fields -->
            <ConditionFormFields
              v-if="condition.type"
              v-model="condition.config"
              :condition-type="condition.type"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message & Form Actions -->
    <div class="card p-6 space-y-4">
      <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <div class="flex items-center justify-end gap-3">
        <button
          type="button"
          @click="$emit('cancel')"
          class="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="btn btn-primary"
          :class="{ 'opacity-50 cursor-not-allowed': loading || !isFormValid }"
        >
          <LoadingSpinner v-if="loading" size="sm" class="mr-2" />
          {{ submitLabel }}
        </button>
      </div>
    </div>

    <!-- Icon Picker Modal -->
    <Modal v-model="showIconPicker" title="Select Icon">
      <div class="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2">
        <button
          v-for="iconName in iconList"
          :key="iconName"
          type="button"
          @click="selectIcon(iconName)"
          class="aspect-square flex items-center justify-center rounded-lg transition-all"
          :class="formData.icon === iconName
            ? 'bg-primary-500 text-white ring-2 ring-primary-500'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
        >
          <component :is="getIcon(iconName)" class="w-5 h-5" />
        </button>
      </div>
    </Modal>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { CreateMilestoneDto, ConditionDto, MilestoneFormState } from '@/types/milestone';
import { conditionTemplates } from '@/utils/milestoneHelpers';
import { getIcon, iconList } from '@/utils/icons';
import ConditionFormFields from './ConditionFormFields.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import Modal from '@/components/ui/Modal.vue';
import { Plus, Trash2 } from 'lucide-vue-next';

// Color palette options (8 most common colors)
const colorPalette = [
  '#26de81', // Green
  '#3498db', // Blue
  '#ff6b6b', // Red
  '#ffa502', // Orange
  '#a55eea', // Purple
  '#fd79a8', // Pink
  '#fdcb6e', // Yellow
  '#6c5ce7', // Indigo
];

interface Props {
  initialData?: Partial<MilestoneFormState>;
  loading?: boolean;
  error?: string;
  submitLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  submitLabel: 'Create Milestone',
  loading: false,
});

const emit = defineEmits<{
  submit: [data: CreateMilestoneDto];
  cancel: [];
}>();

// State
const showIconPicker = ref(false);

// Form data
const formData = ref<MilestoneFormState>({
  name: props.initialData?.name || '',
  description: props.initialData?.description || '',
  icon: props.initialData?.icon || 'Trophy',
  color: props.initialData?.color || '#26de81',
  target_date: props.initialData?.target_date || '',
  conditions: props.initialData?.conditions || [],
});

// Methods
const selectIcon = (iconName: string) => {
  formData.value.icon = iconName;
  showIconPicker.value = false;
};

// Watch for initialData changes (for edit mode)
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = {
        name: newData.name || '',
        description: newData.description || '',
        icon: newData.icon || 'Trophy',
        color: newData.color || '#26de81',
        target_date: newData.target_date || '',
        conditions: newData.conditions || [],
      };
    }
  },
  { deep: true }
);

// Form validation
const isFormValid = computed(() => {
  return (
    formData.value.name.trim().length > 0 &&
    formData.value.target_date.length > 0 &&
    formData.value.conditions.length > 0 &&
    formData.value.conditions.length <= 10 &&
    formData.value.conditions.every((c) => c.type && c.config)
  );
});

// Add condition
const addCondition = () => {
  if (formData.value.conditions.length < 10) {
    formData.value.conditions.push({
      type: '' as any,
      config: {},
    });
  }
};

// Remove condition
const removeCondition = (index: number) => {
  formData.value.conditions.splice(index, 1);
};

// Reset condition config when type changes
const resetConditionConfig = (index: number) => {
  formData.value.conditions[index].config = {};
};

// Handle submit
const handleSubmit = () => {
  if (!isFormValid.value) return;

  const payload: CreateMilestoneDto = {
    name: formData.value.name.trim(),
    description: formData.value.description?.trim() || undefined,
    icon: formData.value.icon || undefined,
    color: formData.value.color || undefined,
    target_date: formData.value.target_date,
    conditions: formData.value.conditions,
  };

  emit('submit', payload);
};
</script>

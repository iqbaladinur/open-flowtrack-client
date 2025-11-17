<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Name -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Milestone Name <span class="text-red-500">*</span>
      </label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
        maxlength="200"
        placeholder="e.g., Emergency Fund - 30 Juta"
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Description
      </label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="3"
        maxlength="1000"
        placeholder="Describe your milestone..."
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>

    <!-- Icon & Color Row -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Icon Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Icon
        </label>
        <select
          v-model="formData.icon"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">No Icon</option>
          <option value="wallet">💰 Wallet</option>
          <option value="shield-check">🛡️ Shield</option>
          <option value="banknote">💵 Banknote</option>
          <option value="calendar">📅 Calendar</option>
          <option value="trending-up">📈 Trending Up</option>
          <option value="tag">🏷️ Tag</option>
          <option value="trophy">🏆 Trophy</option>
        </select>
      </div>

      <!-- Color Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color
        </label>
        <div class="flex gap-2">
          <input
            v-model="formData.color"
            type="color"
            class="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
          />
          <select
            v-model="formData.color"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="#26de81">🟢 Green</option>
            <option value="#3498db">🔵 Blue</option>
            <option value="#ff6b6b">🔴 Red</option>
            <option value="#ffa502">🟠 Orange</option>
            <option value="#45aaf2">🔵 Light Blue</option>
            <option value="#2ed573">🟢 Light Green</option>
            <option value="#a55eea">🟣 Purple</option>
            <option value="#fd79a8">🌸 Pink</option>
            <option value="#fdcb6e">🟡 Yellow</option>
            <option value="#6c5ce7">💜 Indigo</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Target Date -->
    <div>
      <label for="target_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Target Date <span class="text-red-500">*</span>
      </label>
      <input
        id="target_date"
        v-model="formData.target_date"
        type="date"
        required
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>

    <!-- Conditions Section -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Conditions <span class="text-red-500">*</span>
          <span class="text-xs font-normal text-gray-500">(min 1, max 10)</span>
        </label>
        <button
          v-if="formData.conditions.length < 10"
          type="button"
          @click="addCondition"
          class="btn btn-sm btn-primary"
        >
          <Plus class="w-4 h-4 mr-1" />
          Add Condition
        </button>
      </div>

      <!-- Conditions List -->
      <div v-if="formData.conditions.length === 0" class="text-center py-8 text-gray-500">
        No conditions added yet. Click "Add Condition" to get started.
      </div>

      <div v-else class="space-y-4">
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
              class="text-red-500 hover:text-red-700"
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

    <!-- Error Message -->
    <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Form Actions -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { CreateMilestoneDto, ConditionDto, MilestoneFormState } from '@/types/milestone';
import { conditionTemplates } from '@/utils/milestoneHelpers';
import ConditionFormFields from './ConditionFormFields.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import { Plus, Trash2 } from 'lucide-vue-next';

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

// Form data
const formData = ref<MilestoneFormState>({
  name: props.initialData?.name || '',
  description: props.initialData?.description || '',
  icon: props.initialData?.icon || 'wallet',
  color: props.initialData?.color || '#26de81',
  target_date: props.initialData?.target_date || '',
  conditions: props.initialData?.conditions || [],
});

// Watch for initialData changes (for edit mode)
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = {
        name: newData.name || '',
        description: newData.description || '',
        icon: newData.icon || 'wallet',
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

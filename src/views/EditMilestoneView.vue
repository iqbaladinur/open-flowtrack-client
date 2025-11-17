<template>
  <AppLayout>
    <div class="pt-3.5 pb-2 px-4 lg:p-8 mb-20 lg:mb-0">
      <!-- Loading State -->
      <div v-if="loading && !milestone" class="card p-8">
        <LoadingSpinner fullHeight />
      </div>

      <!-- Error State -->
      <div v-else-if="!milestone" class="card p-12 text-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('milestones.milestoneNotFound') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          {{ $t('milestones.milestoneNotFoundEdit') }}
        </p>
        <router-link to="/milestones" class="btn-primary">
          {{ $t('milestones.backToMilestones') }}
        </router-link>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Header -->
        <div class="flex items-center gap-4 justify-between mb-6 mt-1.5">
          <router-link :to="`/milestones/${milestoneId}`" class="btn-icon flex gap-4 items-center">
            <ArrowLeft class="w-5 h-5" />
            <div>
              <h1 class="text-sm font-medium text-gray-800 dark:text-neon">{{ $t('milestones.back') }}</h1>
            </div>
          </router-link>
        </div>

        <!-- Cancelled/Achieved Milestone Message -->
        <div v-if="milestone.status === 'cancelled'" class="space-y-6">
          <div class="card p-6">
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center"
                :class="milestone.status === 'cancelled'
                  ? 'bg-orange-100 dark:bg-orange-900/20'
                  : 'bg-green-100 dark:bg-green-900/20'"
              >
                <component
                  :is="milestone.status === 'cancelled' ? Ban : CheckCircle"
                  class="w-6 h-6"
                  :class="milestone.status === 'cancelled'
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-green-600 dark:text-green-400'"
                />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ milestone.status === 'cancelled' ? $t('milestones.cancelledMilestoneTitle') : $t('milestones.achievedMilestoneTitle') }}
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ milestone.status === 'cancelled' ? $t('milestones.cancelledMilestoneMessage') : $t('milestones.achievedMilestoneMessage') }}
                </p>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div class="space-y-2">
                <div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('milestones.name') }}:</span>
                  <span class="text-sm text-gray-900 dark:text-white ml-2">{{ milestone.name }}</span>
                </div>
                <div v-if="milestone.description">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('milestones.description') }}:</span>
                  <span class="text-sm text-gray-900 dark:text-white ml-2">{{ milestone.description }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('milestones.targetDate') }}:</span>
                  <span class="text-sm text-gray-900 dark:text-white ml-2">{{ formatDate(milestone.target_date) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">{{ $t('milestones.deleteThisMilestone') }}</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ $t('milestones.deleteDescription') }}</p>
              </div>
              <button @click="confirmDelete" class="btn bg-red-600 hover:bg-red-700 text-white">
                <Trash2 class="w-4 h-4 mr-2" />
                {{ $t('milestones.delete') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Edit Form (only if not cancelled) -->
        <MilestoneForm
          v-else
          :initial-data="milestoneFormData"
          :loading="formLoading"
          :error="formError"
          :submit-label="$t('milestones.updateMilestone')"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </template>

      <!-- Delete Confirmation Modal -->
      <Modal v-model="showDeleteConfirm" :title="$t('milestones.deleteMilestone')">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('milestones.deleteConfirmation') }}
        </p>
        <div class="flex items-center justify-end gap-3">
          <button @click="showDeleteConfirm = false" class="btn btn-secondary">{{ $t('milestones.cancel') }}</button>
          <button @click="handleDelete" class="btn bg-red-600 hover:bg-red-700 text-white">
            {{ $t('milestones.delete') }}
          </button>
        </div>
      </Modal>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMilestonesStore } from '@/stores/milestones';
import type { CreateMilestoneDto, MilestoneFormState } from '@/types/milestone';
import { formatDate } from '@/utils/milestoneHelpers';
import AppLayout from '@/components/layouts/AppLayout.vue';
import MilestoneForm from '@/components/milestone/MilestoneForm.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import Modal from '@/components/ui/Modal.vue';
import { ArrowLeft, Ban, Trash2, CheckCircle } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const milestonesStore = useMilestonesStore();
const { t } = useI18n();

// State
const milestoneId = ref(route.params.id as string);
const loading = ref(true);
const formLoading = ref(false);
const formError = ref<string | null>(null);
const showDeleteConfirm = ref(false);

// Computed
const milestone = computed(() => milestonesStore.currentMilestone);

const milestoneFormData = computed<Partial<MilestoneFormState>>(() => {
  if (!milestone.value) return {};

  return {
    name: milestone.value.name,
    description: milestone.value.description || '',
    icon: milestone.value.icon || 'Trophy',
    color: milestone.value.color || '#26de81',
    target_date: milestone.value.target_date.split('T')[0], // Convert ISO to yyyy-MM-dd
    conditions: milestone.value.conditions.map(c => {
      // Parse custom dates in config if they exist
      const config: any = { ...c.config };
      if (config.start_date) {
        config.start_date = config.start_date.split('T')[0];
      }
      if (config.end_date) {
        config.end_date = config.end_date.split('T')[0];
      }

      return {
        type: c.type,
        config: config,
      };
    }),
  };
});

// Methods
const fetchMilestone = async () => {
  loading.value = true;
  try {
    await milestonesStore.fetchMilestoneById(milestoneId.value);
  } catch (error) {
    console.error('Failed to fetch milestone:', error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async (data: CreateMilestoneDto) => {
  formLoading.value = true;
  formError.value = null;

  try {
    const result = await milestonesStore.updateMilestone(milestoneId.value, data);

    if (result.success) {
      // Redirect back to detail view
      router.push(`/milestones/${milestoneId.value}`);
    } else {
      formError.value = result.error || t('milestones.failedToUpdate');
    }
  } catch (error: any) {
    formError.value = error.message || t('milestones.errorOccurred');
  } finally {
    formLoading.value = false;
  }
};

const handleCancel = () => {
  router.push(`/milestones/${milestoneId.value}`);
};

const confirmDelete = () => {
  showDeleteConfirm.value = true;
};

const handleDelete = async () => {
  if (!milestone.value) return;

  const result = await milestonesStore.deleteMilestone(milestone.value.id);

  if (result.success) {
    router.push('/milestones');
  } else {
    alert(result.error || t('milestones.failedToDelete'));
  }
};

// Lifecycle
onMounted(() => {
  fetchMilestone();
});
</script>

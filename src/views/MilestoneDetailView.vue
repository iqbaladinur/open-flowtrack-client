<template>
  <AppLayout>
    <div class="pt-3.5 pb-2 px-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Loading State -->
      <div v-if="milestonesStore.loading" class="card p-8">
        <LoadingSpinner fullHeight />
      </div>

      <!-- Error State -->
      <div v-else-if="!milestone" class="card p-12 text-center">
        <div
          class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <AlertCircle class="w-8 h-8 text-red-500" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ $t('milestones.milestoneNotFound') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          {{ $t('milestones.milestoneNotFoundDescription') }}
        </p>
        <button @click="router.push('/milestones')" class="btn-primary">
          <ArrowLeft class="w-4 h-4 mr-2" />
          {{ $t('milestones.backToMilestones') }}
        </button>
      </div>

      <!-- Milestone Content -->
      <template v-else>
        <!-- Header -->
        <div class="flex items-center gap-4 justify-between">
          <router-link to="/milestones" class="btn-icon flex gap-4 items-center">
            <ArrowLeft class="w-5 h-5" />
            <div>
              <h1 class="text-sm font-medium text-gray-800 dark:text-neon">{{ $t('milestones.back') }}</h1>
            </div>
          </router-link>
          <div class="flex items-center space-x-2 justify-center">
            <!-- Refresh Progress - always visible -->
            <button
              @click="refreshProgress"
              class="p-2 text-gray-600 dark:text-white rounded-full"
              :title="$t('milestones.refreshProgress')"
            >
              <RefreshCw class="w-4 h-4" />
            </button>

            <!-- Cancel - only for pending/in_progress/failed -->
            <button
              v-if="milestone.status !== 'cancelled' && milestone.status !== 'achieved'"
              @click="confirmCancelMilestone"
              class="p-2 text-gray-600 dark:text-white rounded-full"
              :title="$t('milestones.cancelMilestone')"
            >
              <Ban class="w-4 h-4" />
            </button>

            <!-- Edit - only for pending/in_progress/failed -->
            <button
              v-if="milestone.status !== 'cancelled'"
              @click="goToEdit"
              class="p-2 text-gray-600 dark:text-white rounded-full"
              :title="$t('milestones.edit')"
            >
              <Edit class="w-4 h-4" />
            </button>

            <!-- Delete - always visible -->
            <button
              @click="confirmDelete"
              class="p-2 text-gray-600 dark:text-white rounded-full"
              :title="$t('milestones.delete')"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Milestone Info Card -->
        <div class="card p-4">
          <div class="flex items-start gap-3 mb-4">
            <!-- Icon -->
            <div
              v-if="milestone.icon"
              class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              :style="{
                backgroundColor: milestone.color ? `${milestone.color}15` : '#f3f4f6',
                color: milestone.color || '#6b7280'
              }"
            >
              <component :is="getIcon(milestone.icon)" class="w-6 h-6" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1">
                  <h1 class="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-0.5">
                    {{ milestone.name }}
                  </h1>
                  <p v-if="milestone.description" class="text-xs text-gray-600 dark:text-gray-400">
                    {{ milestone.description }}
                  </p>
                </div>

                <!-- Status Icon -->
                <div :title="getStatusLabel(milestone.status)" class="flex-shrink-0">
                  <component
                    :is="getStatusIcon(milestone.status)"
                    class="w-5 h-5"
                    :class="getStatusIconClass(milestone.status)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Section -->
          <div class="mb-3">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('milestones.progress') }}</span>
              <span
                class="text-sm font-bold"
                :style="{ color: getProgressColor(milestone.overall_progress || 0) }"
              >
                {{ configStore.formatProsentase(milestone.overall_progress || 0) }}
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :style="{
                  width: `${Math.min(milestone.overall_progress || 0, 100)}%`,
                  backgroundColor: getProgressColor(milestone.overall_progress || 0),
                }"
              />
            </div>
          </div>

          <!-- Date Info -->
          <div class="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5" />
              <span>{{ formatDate(milestone.target_date) }}</span>
            </div>
            <div v-if="milestone.achieved_at" class="flex items-center gap-1.5 text-green-600 dark:text-green-400">
              <Trophy class="w-3.5 h-3.5" />
              <span>{{ formatDate(milestone.achieved_at) }}</span>
            </div>
            <div v-else class="flex items-center gap-1.5">
              <span>{{ getTranslatedTimeRemaining(milestone.target_date) }}</span>
            </div>
          </div>
        </div>

        <!-- Conditions Section -->
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ $t('milestones.conditions') }}
            </h2>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ $t('milestones.conditionsMet', { count: metConditionsCount, total: milestone.conditions.length }) }}
            </span>
          </div>

          <div class="space-y-2">
            <ConditionItem
              v-for="condition in milestone.conditions"
              :key="condition.id"
              :condition="condition"
            />
          </div>
        </div>
      </template>

      <!-- Cancel Milestone Confirmation Modal -->
      <Modal v-model="showCancelConfirm" :title="$t('milestones.cancelMilestoneTitle')">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('milestones.cancelMilestoneConfirmation') }}
        </p>
        <div class="flex items-center justify-end gap-3">
          <button @click="showCancelConfirm = false" class="btn btn-secondary">{{ $t('milestones.cancel') }}</button>
          <button @click="handleCancelMilestone" class="btn bg-orange-600 hover:bg-orange-700 text-white">
            {{ $t('milestones.cancelMilestone') }}
          </button>
        </div>
      </Modal>

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
import {
  getStatusLabel,
  getStatusIconClass,
  getProgressColor,
  formatDate,
  getTimeRemaining,
} from '@/utils/milestoneHelpers';
import { getIcon } from '@/utils/icons';
import AppLayout from '@/components/layouts/AppLayout.vue';
import ConditionItem from '@/components/milestone/ConditionItem.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import Modal from '@/components/ui/Modal.vue';
import {
  ArrowLeft,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  Trophy,
  AlertCircle,
  Calendar,
  Circle,
  Loader,
  XCircle,
  Ban,
} from 'lucide-vue-next';
import { useConfigStore } from '@/stores/config';

const router = useRouter();
const route = useRoute();
const milestonesStore = useMilestonesStore();
const { t } = useI18n();
const configStore = useConfigStore();

// State
const showCancelConfirm = ref(false);
const showDeleteConfirm = ref(false);

// Computed
const milestone = computed(() => milestonesStore.currentMilestone);

const metConditionsCount = computed(() => {
  if (!milestone.value) return 0;
  return milestone.value.conditions.filter((c) => c.is_met).length;
});

// Status icon mapping
const statusIconMap: Record<string, any> = {
  pending: Circle,
  in_progress: Loader,
  achieved: CheckCircle,
  failed: XCircle,
  cancelled: Ban,
};

const getStatusIcon = (status: string) => {
  return statusIconMap[status] || Circle;
};

// Methods
const getTranslatedTimeRemaining = (targetDate: string): string => {
  const timeData = getTimeRemaining(targetDate);
  return t(timeData.key, timeData.params || {});
};

const fetchMilestone = async () => {
  const id = route.params.id as string;
  await milestonesStore.fetchMilestoneById(id);
};

const refreshProgress = async () => {
  if (!milestone.value) return;
  await milestonesStore.refreshMilestoneProgress(milestone.value.id);
};

const confirmCancelMilestone = () => {
  showCancelConfirm.value = true;
};

const handleCancelMilestone = async () => {
  if (!milestone.value) return;

  showCancelConfirm.value = false;

  const result = await milestonesStore.updateMilestoneStatus(milestone.value.id, {
    status: 'cancelled',
  });

  if (!result.success) {
    alert(result.error || t('milestones.failedToUpdateStatus'));
  }
};

const goToEdit = () => {
  if (!milestone.value) return;
  router.push(`/milestones/${milestone.value.id}/edit`);
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
    alert(result.error || 'Failed to delete milestone');
  }
};


// Lifecycle
onMounted(() => {
  fetchMilestone();
});
</script>

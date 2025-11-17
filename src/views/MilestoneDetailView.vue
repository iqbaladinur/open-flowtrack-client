<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
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
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Milestone Not Found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          The milestone you're looking for doesn't exist or has been deleted.
        </p>
        <button @click="router.push('/milestones')" class="btn-primary">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Milestones
        </button>
      </div>

      <!-- Milestone Content -->
      <template v-else>
        <!-- Header -->
        <div class="flex items-start justify-between gap-4">
          <button
            @click="router.push('/milestones')"
            class="btn btn-secondary p-2 flex-shrink-0"
          >
            <ArrowLeft class="w-4 h-4" />
          </button>

          <div class="flex-1 min-w-0">
            <div class="flex items-start gap-3 mb-2">
              <!-- Icon -->
              <div
                v-if="milestone.icon"
                class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                :style="{
                  backgroundColor: milestone.color ? `${milestone.color}15` : '#f3f4f6',
                  color: milestone.color || '#6b7280'
                }"
              >
                <component :is="getIcon(milestone.icon)" class="w-7 h-7" />
              </div>

              <div class="flex-1 min-w-0">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ milestone.name }}
                </h1>
                <p v-if="milestone.description" class="text-gray-600 dark:text-gray-400">
                  {{ milestone.description }}
                </p>
              </div>

              <!-- Status Badge -->
              <span
                class="px-3 py-1 text-sm font-medium rounded-full border flex-shrink-0"
                :class="getStatusBadgeClass(milestone.status)"
              >
                {{ getStatusLabel(milestone.status) }}
              </span>
            </div>
          </div>

          <!-- Actions Dropdown -->
          <div class="relative">
            <button
              @click="showActions = !showActions"
              class="btn btn-secondary p-2"
            >
              <MoreVertical class="w-4 h-4" />
            </button>

            <!-- Actions Menu -->
            <div
              v-if="showActions"
              v-click-outside="() => (showActions = false)"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
            >
              <button
                @click="refreshProgress"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <RefreshCw class="w-4 h-4" />
                Refresh Progress
              </button>
              <button
                @click="showEditModal = true"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Edit class="w-4 h-4" />
                Edit Milestone
              </button>
              <button
                v-if="milestone.status !== 'achieved'"
                @click="markAsAchieved"
                class="w-full px-4 py-2 text-left text-sm text-green-700 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <CheckCircle class="w-4 h-4" />
                Mark as Achieved
              </button>
              <button
                @click="confirmDelete"
                class="w-full px-4 py-2 text-left text-sm text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Trash2 class="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Progress Section -->
        <div class="card p-6">
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Overall Progress</h2>
              <span
                class="text-2xl font-bold"
                :style="{ color: getProgressColor(milestone.overall_progress || 0) }"
              >
                {{ (milestone.overall_progress || 0).toFixed(1) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                class="h-3 rounded-full transition-all duration-500"
                :style="{
                  width: `${Math.min(milestone.overall_progress || 0, 100)}%`,
                  backgroundColor: getProgressColor(milestone.overall_progress || 0),
                }"
              />
            </div>
          </div>

          <!-- Date Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Target Date</p>
              <p class="text-base font-semibold text-gray-900 dark:text-white">
                {{ formatDate(milestone.target_date) }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ getTimeRemaining(milestone.target_date) }}
              </p>
            </div>
            <div v-if="milestone.achieved_at">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Achieved Date</p>
              <p class="text-base font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                <Trophy class="w-5 h-5" />
                {{ formatDate(milestone.achieved_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Conditions Section -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Conditions
              <span class="text-sm font-normal text-gray-500 ml-2">
                ({{ metConditionsCount }} / {{ milestone.conditions.length }} met)
              </span>
            </h2>
          </div>

          <div class="space-y-4">
            <ConditionItem
              v-for="condition in milestone.conditions"
              :key="condition.id"
              :condition="condition"
              :show-details="true"
            />
          </div>
        </div>

        <!-- Metadata -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Information</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-600 dark:text-gray-400 mb-1">Created</p>
              <p class="text-gray-900 dark:text-white font-medium">
                {{ formatDate(milestone.created_at) }}
              </p>
            </div>
            <div>
              <p class="text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
              <p class="text-gray-900 dark:text-white font-medium">
                {{ formatDate(milestone.updated_at) }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- Edit Modal -->
      <Modal v-model="showEditModal" title="Edit Milestone">
        <MilestoneForm
          v-if="milestone"
          :initial-data="milestoneFormData"
          :loading="formLoading"
          :error="formError"
          submit-label="Update Milestone"
          @submit="handleUpdate"
          @cancel="closeEditModal"
        />
      </Modal>

      <!-- Delete Confirmation Modal -->
      <Modal v-model="showDeleteConfirm" title="Delete Milestone">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to delete this milestone? This action cannot be undone.
        </p>
        <div class="flex items-center justify-end gap-3">
          <button @click="showDeleteConfirm = false" class="btn btn-secondary">Cancel</button>
          <button @click="handleDelete" class="btn bg-red-600 hover:bg-red-700 text-white">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMilestonesStore } from '@/stores/milestones';
import type { CreateMilestoneDto } from '@/types/milestone';
import {
  getStatusBadgeClass,
  getStatusLabel,
  getProgressColor,
  formatDate,
  getTimeRemaining,
} from '@/utils/milestoneHelpers';
import AppLayout from '@/components/layouts/AppLayout.vue';
import ConditionItem from '@/components/milestone/ConditionItem.vue';
import MilestoneForm from '@/components/milestone/MilestoneForm.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import Modal from '@/components/ui/Modal.vue';
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  Trophy,
  AlertCircle,
  Wallet,
  ShieldCheck,
  Banknote,
  Calendar,
  TrendingUp,
  Tag,
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const milestonesStore = useMilestonesStore();

// State
const showActions = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const formLoading = ref(false);
const formError = ref<string | null>(null);

// Computed
const milestone = computed(() => milestonesStore.currentMilestone);

const metConditionsCount = computed(() => {
  if (!milestone.value) return 0;
  return milestone.value.conditions.filter((c) => c.is_met).length;
});

const milestoneFormData = computed(() => {
  if (!milestone.value) return undefined;
  return {
    name: milestone.value.name,
    description: milestone.value.description,
    icon: milestone.value.icon,
    color: milestone.value.color,
    target_date: milestone.value.target_date.split('T')[0], // Convert to YYYY-MM-DD
    conditions: milestone.value.conditions.map((c) => ({
      type: c.type,
      config: c.config,
    })),
  };
});

// Icon mapping
const iconMap: Record<string, any> = {
  wallet: Wallet,
  'shield-check': ShieldCheck,
  banknote: Banknote,
  calendar: Calendar,
  'trending-up': TrendingUp,
  tag: Tag,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Wallet;
};

// Methods
const fetchMilestone = async () => {
  const id = route.params.id as string;
  await milestonesStore.fetchMilestoneById(id);
};

const refreshProgress = async () => {
  if (!milestone.value) return;
  showActions.value = false;
  await milestonesStore.refreshMilestoneProgress(milestone.value.id);
};

const markAsAchieved = async () => {
  if (!milestone.value) return;
  showActions.value = false;

  const result = await milestonesStore.updateMilestoneStatus(milestone.value.id, {
    status: 'achieved',
  });

  if (!result.success) {
    alert(result.error || 'Failed to update status');
  }
};

const handleUpdate = async (data: CreateMilestoneDto) => {
  if (!milestone.value) return;

  formLoading.value = true;
  formError.value = null;

  try {
    const result = await milestonesStore.updateMilestone(milestone.value.id, data);

    if (result.success) {
      closeEditModal();
    } else {
      formError.value = result.error || 'Failed to update milestone';
    }
  } catch (error: any) {
    formError.value = error.message || 'An error occurred';
  } finally {
    formLoading.value = false;
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
  formError.value = null;
};

const confirmDelete = () => {
  showActions.value = false;
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

// Click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};

// Lifecycle
onMounted(() => {
  fetchMilestone();
});
</script>

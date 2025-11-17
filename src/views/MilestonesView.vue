<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">Milestones</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm">
              Track your financial journey timeline
            </p>
          </div>
          <button
            @click="refreshMilestones"
            class="btn btn-secondary flex items-center p-2 sm:hidden"
            :disabled="milestonesStore.loading"
          >
            <RefreshCw class="size-4" :class="{ 'animate-spin': milestonesStore.loading }" />
          </button>
        </div>
        <div class="flex items-center gap-2 justify-end">
          <button
            @click="refreshMilestones"
            class="btn btn-secondary hidden sm:flex items-center p-2"
            :disabled="milestonesStore.loading"
          >
            <RefreshCw class="size-4" :class="{ 'animate-spin': milestonesStore.loading }" />
          </button>
          <button @click="goToCreate" class="btn-primary hidden sm:flex items-center p-2">
            <Plus class="size-4" />
          </button>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="card p-3 sm:p-4">
        <!-- Mobile: 2x2 Grid -->
        <div class="grid grid-cols-2 gap-3 sm:hidden">
          <div class="text-center">
            <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Total</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {{ milestonesStore.totalMilestones }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Achieved</p>
            <p class="text-lg font-bold text-green-600 dark:text-green-400">
              {{ milestonesStore.achievedMilestones.length }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">In Progress</p>
            <p class="text-lg font-bold text-blue-600 dark:text-blue-400">
              {{ milestonesStore.inProgressMilestones.length }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Completion</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {{ milestonesStore.completionRate.toFixed(0) }}%
            </p>
          </div>
        </div>

        <!-- Desktop: Horizontal with dividers -->
        <div class="hidden sm:flex items-center justify-between gap-6">
          <div class="text-center flex-1">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">
              {{ milestonesStore.totalMilestones }}
            </p>
          </div>
          <div class="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div class="text-center flex-1">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Achieved</p>
            <p class="text-xl font-bold text-green-600 dark:text-green-400">
              {{ milestonesStore.achievedMilestones.length }}
            </p>
          </div>
          <div class="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div class="text-center flex-1">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">In Progress</p>
            <p class="text-xl font-bold text-blue-600 dark:text-blue-400">
              {{ milestonesStore.inProgressMilestones.length }}
            </p>
          </div>
          <div class="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div class="text-center flex-1">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Completion</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">
              {{ milestonesStore.completionRate.toFixed(0) }}%
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="milestonesStore.loading" class="card p-8">
        <LoadingSpinner fullHeight />
      </div>

      <!-- Empty State -->
      <div v-else-if="sortedMilestones.length === 0" class="card p-12 text-center">
        <div
          class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Target class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Milestones Yet
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Create your first milestone to start tracking your financial journey
        </p>
        <button @click="goToCreate" class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          Create Milestone
        </button>
      </div>

      <!-- Timeline View -->
      <div v-else class="relative max-w-6xl mx-auto">
        <!-- Timeline Line (Centered) -->
        <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2" />

        <!-- Timeline Items -->
        <div class="space-y-6 sm:space-y-8 md:space-y-12">
          <div
            v-for="(milestone, index) in sortedMilestones"
            :key="milestone.id"
            class="relative"
          >
            <!-- Timeline Dot (Centered) -->
            <div class="absolute left-1/2 top-4 sm:top-5 md:top-6 flex items-center justify-center -translate-x-1/2 z-10">
              <div
                class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white dark:border-gray-900"
                :class="getTimelineDotClass(milestone.status)"
              />
            </div>

            <!-- Timeline Content (Zigzag: even=left, odd=right) -->
            <div
              class="w-[calc(50%-1rem)] sm:w-[calc(50%-1.5rem)] md:w-[calc(50%-2rem)]"
              :class="index % 2 === 0 ? 'mr-auto pr-4 sm:pr-6 md:pr-8' : 'ml-auto pl-4 sm:pl-6 md:pl-8'"
            >
              <div
                class="card p-2 sm:p-3 md:p-4 transition-all cursor-pointer hover:shadow-lg"
                :class="getTimelineCardClass(milestone.status)"
                @click="goToDetail(milestone.id)"
              >
                <!-- Header -->
                <div class="flex items-start gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2">
                  <!-- Icon -->
                  <div
                    v-if="milestone.icon"
                    class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    :style="{
                      backgroundColor: milestone.color ? `${milestone.color}15` : '#f3f4f6',
                      color: milestone.color || '#6b7280'
                    }"
                  >
                    <component :is="getIcon(milestone.icon)" class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>

                  <!-- Title & Status -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                      <h3 class="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {{ milestone.name }}
                      </h3>
                      <span
                        class="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium rounded-full border whitespace-nowrap flex-shrink-0"
                        :class="getStatusBadgeClass(milestone.status)"
                      >
                        {{ getStatusLabel(milestone.status) }}
                      </span>
                    </div>

                    <!-- Date Info -->
                    <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 text-[9px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                      <div class="flex items-center gap-0.5 sm:gap-1">
                        <Calendar class="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{{ formatDateShort(milestone.target_date) }}</span>
                      </div>
                      <div v-if="milestone.achieved_at" class="flex items-center gap-0.5 sm:gap-1 text-green-600 dark:text-green-400">
                        <Trophy class="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{{ formatDateShort(milestone.achieved_at) }}</span>
                      </div>
                      <div v-else-if="!isMilestoneOverdue(milestone.target_date, milestone.status)" class="flex items-center gap-0.5 sm:gap-1">
                        <Clock class="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{{ getTimeRemaining(milestone.target_date) }}</span>
                      </div>
                      <div v-else class="flex items-center gap-0.5 sm:gap-1 text-red-600 dark:text-red-400">
                        <AlertCircle class="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>Overdue</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="mb-1.5 sm:mb-2">
                  <div class="flex items-center justify-between mb-0.5 sm:mb-1">
                    <span class="text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-700 dark:text-gray-300">Progress</span>
                    <span class="text-[10px] sm:text-xs md:text-sm font-semibold" :style="{ color: getProgressColor(milestone.overall_progress || 0) }">
                      {{ (milestone.overall_progress || 0).toFixed(1) }}%
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 sm:h-1.5 md:h-2 overflow-hidden">
                    <div
                      class="h-1 sm:h-1.5 md:h-2 rounded-full transition-all duration-500"
                      :style="{
                        width: `${Math.min(milestone.overall_progress || 0, 100)}%`,
                        backgroundColor: getProgressColor(milestone.overall_progress || 0),
                      }"
                    />
                  </div>
                </div>

                <!-- Conditions Summary -->
                <div class="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] md:text-xs">
                  <CheckCircle2
                    :class="metConditionsCount(milestone) === milestone.conditions.length
                      ? 'text-green-500'
                      : 'text-gray-400'"
                    class="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0"
                  />
                  <span class="text-gray-600 dark:text-gray-400">
                    {{ metConditionsCount(milestone) }}/{{ milestone.conditions.length }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Floating Add Button for Mobile -->
    <button @click="goToCreate" class="sm:hidden fixed bottom-[70px] right-6 z-[20] btn-primary rounded-xl p-3 shadow-lg flex items-center justify-center">
      <Plus class="w-6 h-6" />
      <span class="sr-only">New Milestone</span>
    </button>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMilestonesStore } from '@/stores/milestones';
import type { Milestone } from '@/types/milestone';
import {
  getStatusBadgeClass,
  getStatusLabel,
  getProgressColor,
  formatDateShort,
  getTimeRemaining,
  isMilestoneOverdue,
} from '@/utils/milestoneHelpers';
import AppLayout from '@/components/layouts/AppLayout.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import {
  Plus,
  RefreshCw,
  Target,
  Trophy,
  TrendingUp,
  PieChart,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Wallet,
  ShieldCheck,
  Banknote,
  Tag,
} from 'lucide-vue-next';

const router = useRouter();
const milestonesStore = useMilestonesStore();

// Sort milestones by target date (descending - furthest first)
const sortedMilestones = computed(() => {
  return [...milestonesStore.milestones].sort((a, b) => {
    const dateA = new Date(a.target_date).getTime();
    const dateB = new Date(b.target_date).getTime();
    return dateB - dateA;
  });
});

// Helper to count met conditions
const metConditionsCount = (milestone: Milestone) => {
  return milestone.conditions.filter((c) => c.is_met).length;
};

// Get timeline dot class based on status
const getTimelineDotClass = (status: string) => {
  const classes: Record<string, string> = {
    achieved: 'bg-green-500',
    in_progress: 'bg-blue-500',
    pending: 'bg-gray-400',
    failed: 'bg-red-500',
    cancelled: 'bg-gray-500',
  };
  return classes[status] || 'bg-gray-400';
};

// Get timeline card class based on status
const getTimelineCardClass = (status: string) => {
  if (status === 'achieved') {
    return 'border-l-4 border-green-500 bg-green-50/50 dark:bg-green-900/10';
  }
  return 'border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10';
};

// Icon mapping
const iconMap: Record<string, any> = {
  wallet: Wallet,
  'shield-check': ShieldCheck,
  banknote: Banknote,
  calendar: Calendar,
  'trending-up': TrendingUp,
  tag: Tag,
  trophy: Trophy,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Wallet;
};

// Methods
const fetchMilestones = async () => {
  await milestonesStore.fetchMilestones({ sort_by: 'target_date', order: 'ASC' });
};

const refreshMilestones = async () => {
  await fetchMilestones();
};

const goToCreate = () => {
  router.push('/milestones/create');
};

const goToDetail = (id: string) => {
  router.push(`/milestones/${id}`);
};

// Lifecycle
onMounted(() => {
  fetchMilestones();
});
</script>

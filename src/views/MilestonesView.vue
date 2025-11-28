<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl lg:text-3xl font-bold">{{ $t('milestones.title') }}</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm">
              {{ $t('milestones.subtitle') }}
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

      <!-- Stats Badges -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ $t('milestones.total') }}</span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ milestonesStore.totalMilestones }}
          </span>
        </div>

        <div class="px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center gap-2">
          <span class="text-xs text-green-700 dark:text-green-400">{{ $t('milestones.achieved') }}</span>
          <span class="text-sm font-semibold text-green-900 dark:text-green-300">
            {{ milestonesStore.achievedMilestones.length }}
          </span>
        </div>

        <div class="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center gap-2">
          <span class="text-xs text-blue-700 dark:text-blue-400">{{ $t('milestones.inProgress') }}</span>
          <span class="text-sm font-semibold text-blue-900 dark:text-blue-300">
            {{ milestonesStore.inProgressMilestones.length }}
          </span>
        </div>

        <div class="px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 flex items-center gap-2">
          <span class="text-xs text-purple-700 dark:text-purple-400">{{ $t('milestones.completion') }}</span>
          <span class="text-sm font-semibold text-purple-900 dark:text-purple-300">
            {{ milestonesStore.completionRate.toFixed(0) }}%
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="milestonesStore.loading && sortedMilestones.length === 0" class="card p-8">
        <LoadingSpinner fullHeight />
      </div>

      <!-- Empty State -->
      <div v-else-if="!milestonesStore.loading && sortedMilestones.length === 0" class="card p-12 text-center">
        <div
          class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Flame class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ $t('milestones.noMilestonesYet') }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          {{ $t('milestones.noMilestonesDescription') }}
        </p>
        <button @click="goToCreate" class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          {{ $t('milestones.createMilestone') }}
        </button>
      </div>

      <!-- Timeline View -->
      <div v-else class="relative max-w-6xl mx-auto">
        <!-- Timeline Line (Centered) -->
        <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2" />

        <!-- Timeline Start Circle -->
        <div class="absolute left-1/2 top-0 -translate-x-1/2 z-10">
          <div class="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-white dark:border-gray-900" />
        </div>

        <!-- Timeline End Circle -->
        <div class="absolute left-1/2 bottom-0 -translate-x-1/2 z-10">
          <div class="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-white dark:border-gray-900" />
        </div>

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
              <MilestoneTimelineCard
                :milestone="milestone"
                @click="goToDetail(milestone.id)"
              />
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Floating Add Button for Mobile -->
    <button @click="goToCreate" class="sm:hidden fixed bottom-[70px] right-6 z-[20] btn-primary rounded-xl p-3 shadow-lg flex items-center justify-center">
      <Plus class="w-6 h-6" />
      <span class="sr-only">{{ $t('milestones.newMilestone') }}</span>
    </button>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMilestonesStore } from '@/stores/milestones';
import AppLayout from '@/components/layouts/AppLayout.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import MilestoneTimelineCard from '@/components/milestone/MilestoneTimelineCard.vue';
import { Plus, RefreshCw, Flame } from 'lucide-vue-next';

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

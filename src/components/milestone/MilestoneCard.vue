<template>
  <div
    class="card p-4 transition-all relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg"
    :class="{ 'opacity-70': milestone.status === 'cancelled' }"
    @click="$emit('click', milestone)"
  >
    <!-- Background color overlay -->
    <div
      v-if="milestone.color"
      class="absolute top-0 left-0 w-full h-1"
      :style="{ backgroundColor: milestone.color }"
    />

    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-start gap-3 flex-1">
        <!-- Icon -->
        <div
          v-if="milestone.icon"
          class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          :style="{
            backgroundColor: milestone.color ? `${milestone.color}15` : '#f3f4f6',
            color: milestone.color || '#6b7280'
          }"
        >
          <component :is="getIcon(milestone.icon)" class="w-6 h-6" />
        </div>

        <!-- Title & Description -->
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
            {{ milestone.name }}
          </h3>
          <p v-if="milestone.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {{ milestone.description }}
          </p>
        </div>
      </div>

      <!-- Status Icon -->
      <div :title="getStatusLabel(milestone.status)">
        <component
          :is="getStatusIcon(milestone.status)"
          class="w-5 h-5"
          :class="getStatusIconClass(milestone.status)"
        />
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
        <span class="text-sm font-semibold" :style="{ color: getProgressColor(milestone.overall_progress || 0) }">
          {{ (milestone.overall_progress || 0).toFixed(1) }}%
        </span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          class="h-2.5 rounded-full transition-all duration-500"
          :style="{
            width: `${Math.min(milestone.overall_progress || 0, 100)}%`,
            backgroundColor: getProgressColor(milestone.overall_progress || 0),
          }"
        />
      </div>
    </div>

    <!-- Conditions Summary -->
    <div class="mb-4">
      <div class="flex items-center gap-2 text-sm">
        <CheckCircle2 class="w-4 h-4 text-green-500" />
        <span class="text-gray-600 dark:text-gray-400">
          {{ metConditionsCount }} / {{ milestone.conditions.length }} conditions met
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
      <!-- Target Date -->
      <div class="flex items-center gap-2 text-sm">
        <Calendar class="w-4 h-4 text-gray-400" />
        <span class="text-gray-600 dark:text-gray-400">
          {{ formatDateShort(milestone.target_date) }}
        </span>
        <span
          v-if="!milestone.achieved_at"
          class="text-xs px-2 py-0.5 rounded-full"
          :class="isOverdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'"
        >
          {{ $t(timeRemainingData.key, timeRemainingData.params) }}
        </span>
      </div>

      <!-- Achieved Date -->
      <div v-if="milestone.achieved_at" class="flex items-center gap-2 text-sm">
        <Trophy class="w-4 h-4 text-yellow-500" />
        <span class="text-gray-600 dark:text-gray-400">
          {{ formatDateShort(milestone.achieved_at) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Milestone } from '@/types/milestone';
import {
  getStatusBadgeClass,
  getStatusLabel,
  getStatusIconClass,
  getProgressColor,
  formatDateShort,
  getTimeRemaining,
  isMilestoneOverdue,
} from '@/utils/milestoneHelpers';
import {
  Wallet,
  ShieldCheck,
  Banknote,
  Calendar,
  TrendingUp,
  Tag,
  CheckCircle2,
  Trophy,
  Circle,
  Loader,
  CheckCircle,
  XCircle,
  Ban,
} from 'lucide-vue-next';

interface Props {
  milestone: Milestone;
}

const props = defineProps<Props>();
defineEmits(['click']);

const metConditionsCount = computed(() => {
  return props.milestone.conditions.filter((c) => c.is_met).length;
});

const isOverdue = computed(() => {
  return isMilestoneOverdue(props.milestone.target_date, props.milestone.status);
});

const timeRemainingData = computed(() => {
  return getTimeRemaining(props.milestone.target_date);
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
</script>

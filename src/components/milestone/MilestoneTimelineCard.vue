<template>
  <div
    class="card p-2 sm:p-3 md:p-4 transition-all cursor-pointer hover:shadow-lg"
    :class="[cardClass, { 'opacity-60': milestone.status === 'cancelled' }]"
    @click="$emit('click')"
  >
    <!-- Header -->
    <div class="flex items-start gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2">
      <!-- Icon -->
      <div
        v-if="milestone.icon"
        class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
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
          <div :title="getStatusLabel(milestone.status)" class="flex-shrink-0">
            <component
              :is="getStatusIcon(milestone.status)"
              class="w-3.5 h-3.5 sm:w-4 sm:h-4"
              :class="getStatusIconClass(milestone.status)"
            />
          </div>
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
          <div v-else-if="!isOverdue" class="flex items-center gap-0.5 sm:gap-1">
            <Clock class="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>{{ timeRemainingText }}</span>
          </div>
          <div v-else class="flex items-center gap-0.5 sm:gap-1 text-red-600 dark:text-red-400">
            <AlertCircle class="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>{{ $t('milestones.timeRemaining.overdue') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-1.5 sm:mb-2">
      <div class="flex items-center justify-between mb-0.5 sm:mb-1">
        <span class="text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-700 dark:text-gray-300">{{ $t('milestones.progress') }}</span>
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
        :class="metConditionsCount === milestone.conditions.length
          ? 'text-green-500'
          : 'text-gray-400'"
        class="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0"
      />
      <span class="text-gray-600 dark:text-gray-400">
        {{ metConditionsCount }}/{{ milestone.conditions.length }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Milestone } from '@/types/milestone';
import {
  getStatusLabel,
  getStatusIconClass,
  getProgressColor,
  formatDateShort,
  getTimeRemaining,
  isMilestoneOverdue,
} from '@/utils/milestoneHelpers';
import { getIcon } from '@/utils/icons';
import {
  Calendar,
  Clock,
  AlertCircle,
  Trophy,
  CheckCircle2,
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

const { t } = useI18n();

// Computed
const metConditionsCount = computed(() => {
  return props.milestone.conditions.filter((c) => c.is_met).length;
});

const isOverdue = computed(() => {
  return isMilestoneOverdue(props.milestone.target_date, props.milestone.status);
});

const timeRemainingText = computed(() => {
  const timeData = getTimeRemaining(props.milestone.target_date);
  return t(timeData.key, timeData.params || {});
});

const cardClass = computed(() => {
  if (props.milestone.status === 'achieved') {
    return 'border-l-4 border-green-500 bg-green-50/50 dark:bg-green-900/10';
  }
  if (props.milestone.status === 'in_progress') {
    return 'border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10';
  }
  if (props.milestone.status === 'failed') {
    return 'border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/10';
  }
  return 'border-l-4 bg-gray-50/50 dark:bg-gray-900/10';
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
</script>

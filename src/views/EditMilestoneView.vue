<template>
  <AppLayout>
    <div class="pt-0 pb-2 px-4 lg:p-8 mb-20 lg:mb-0">
      <!-- Loading State -->
      <div v-if="loading && !milestone" class="card p-8">
        <LoadingSpinner fullHeight />
      </div>

      <!-- Error State -->
      <div v-else-if="!milestone" class="card p-12 text-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Milestone Not Found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          The milestone you're trying to edit doesn't exist or has been deleted.
        </p>
        <router-link to="/milestones" class="btn-primary">
          Back to Milestones
        </router-link>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Header -->
        <div class="flex items-center gap-4 justify-between mb-6">
          <router-link :to="`/milestones/${milestoneId}`" class="btn-icon flex gap-4 items-center">
            <ArrowLeft class="w-5 h-5" />
            <div>
              <h1 class="text-sm font-medium text-gray-800 dark:text-neon">Back</h1>
            </div>
          </router-link>
        </div>

        <!-- Form -->
        <MilestoneForm
          :initial-data="milestoneFormData"
          :loading="formLoading"
          :error="formError"
          submit-label="Update Milestone"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </template>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMilestonesStore } from '@/stores/milestones';
import type { CreateMilestoneDto, MilestoneFormState } from '@/types/milestone';
import AppLayout from '@/components/layouts/AppLayout.vue';
import MilestoneForm from '@/components/milestone/MilestoneForm.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import { ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const milestonesStore = useMilestonesStore();

// State
const milestoneId = ref(route.params.id as string);
const loading = ref(true);
const formLoading = ref(false);
const formError = ref<string | null>(null);

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
      const config = { ...c.config };
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
      formError.value = result.error || 'Failed to update milestone';
    }
  } catch (error: any) {
    formError.value = error.message || 'An error occurred';
  } finally {
    formLoading.value = false;
  }
};

const handleCancel = () => {
  router.push(`/milestones/${milestoneId.value}`);
};

// Lifecycle
onMounted(() => {
  fetchMilestone();
});
</script>

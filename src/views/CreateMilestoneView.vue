<template>
  <AppLayout>
    <div class="pt-0 pb-2 px-4 lg:p-8 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex items-center gap-4 justify-between mb-6">
        <router-link to="/milestones" class="btn-icon flex gap-4 items-center">
          <ArrowLeft class="w-5 h-5" />
          <div>
            <h1 class="text-sm font-medium text-gray-800 dark:text-neon">Back</h1>
          </div>
        </router-link>
      </div>

      <!-- Form -->
      <MilestoneForm
        :loading="formLoading"
        :error="formError"
        submit-label="Create Milestone"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMilestonesStore } from '@/stores/milestones';
import type { CreateMilestoneDto } from '@/types/milestone';
import AppLayout from '@/components/layouts/AppLayout.vue';
import MilestoneForm from '@/components/milestone/MilestoneForm.vue';
import { ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
const milestonesStore = useMilestonesStore();

// State
const formLoading = ref(false);
const formError = ref<string | null>(null);

// Methods
const handleSubmit = async (data: CreateMilestoneDto) => {
  formLoading.value = true;
  formError.value = null;

  try {
    const result = await milestonesStore.createMilestone(data);

    if (result.success) {
      // Redirect to milestones list
      router.push('/milestones');
    } else {
      formError.value = result.error || 'Failed to create milestone';
    }
  } catch (error: any) {
    formError.value = error.message || 'An error occurred';
  } finally {
    formLoading.value = false;
  }
};

const handleCancel = () => {
  router.push('/milestones');
};
</script>

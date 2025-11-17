import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApi } from '@/composables/useApi';
import type {
  Milestone,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  UpdateStatusDto,
  GetMilestonesParams,
} from '@/types/milestone';

export const useMilestonesStore = defineStore('milestones', () => {
  // ============================================================================
  // State
  // ============================================================================

  const milestones = ref<Milestone[]>([]);
  const currentMilestone = ref<Milestone | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const api = useApi();

  // ============================================================================
  // Computed
  // ============================================================================

  const achievedMilestones = computed(() =>
    milestones.value.filter((m) => m.status === 'achieved')
  );

  const inProgressMilestones = computed(() =>
    milestones.value.filter((m) => m.status === 'in_progress')
  );

  const pendingMilestones = computed(() =>
    milestones.value.filter((m) => m.status === 'pending')
  );

  const failedMilestones = computed(() =>
    milestones.value.filter((m) => m.status === 'failed')
  );

  const totalMilestones = computed(() => milestones.value.length);

  const completionRate = computed(() => {
    if (milestones.value.length === 0) return 0;
    return (achievedMilestones.value.length / milestones.value.length) * 100;
  });

  // ============================================================================
  // Actions
  // ============================================================================

  /**
   * Fetch all milestones with optional filters
   */
  const fetchMilestones = async (params?: GetMilestonesParams) => {
    loading.value = true;
    error.value = null;

    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params?.order) queryParams.append('order', params.order);

      const url = `/milestones${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<Milestone[]>(url);

      if (response.data) {
        milestones.value = response.data;
        return { success: true, data: response.data };
      }

      error.value = response.error || 'Failed to fetch milestones';
      return { success: false, error: error.value };
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch milestones';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch a single milestone by ID
   */
  const fetchMilestoneById = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get<Milestone>(`/milestones/${id}`);

      if (response.data) {
        currentMilestone.value = response.data;

        // Also update in the list if it exists
        const index = milestones.value.findIndex((m) => m.id === id);
        if (index !== -1) {
          milestones.value[index] = response.data;
        }

        return { success: true, data: response.data };
      }

      error.value = response.error || 'Failed to fetch milestone';
      return { success: false, error: error.value };
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch milestone';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create a new milestone
   */
  const createMilestone = async (data: CreateMilestoneDto) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<Milestone>('/milestones', data);

      if (response.data) {
        milestones.value.unshift(response.data);
        currentMilestone.value = response.data;
        return { success: true, data: response.data };
      }

      error.value = response.error || 'Failed to create milestone';
      return { success: false, error: error.value };
    } catch (err: any) {
      error.value = err.message || 'Failed to create milestone';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update an existing milestone
   */
  const updateMilestone = async (id: string, data: UpdateMilestoneDto) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.patch<Milestone>(`/milestones/${id}`, data);

      if (response.data) {
        const index = milestones.value.findIndex((m) => m.id === id);
        if (index !== -1) {
          milestones.value[index] = response.data;
        }

        if (currentMilestone.value?.id === id) {
          currentMilestone.value = response.data;
        }

        return { success: true, data: response.data };
      }

      error.value = response.error || 'Failed to update milestone';
      return { success: false, error: error.value };
    } catch (err: any) {
      error.value = err.message || 'Failed to update milestone';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete a milestone
   */
  const deleteMilestone = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.delete(`/milestones/${id}`);

      if (!response.error) {
        milestones.value = milestones.value.filter((m) => m.id !== id);

        if (currentMilestone.value?.id === id) {
          currentMilestone.value = null;
        }

        return { success: true };
      }

      error.value = response.error || 'Failed to delete milestone';
      return { success: false, error: error.value };
    } catch (err: any) {
      error.value = err.message || 'Failed to delete milestone';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Manually update milestone status
   */
  const updateMilestoneStatus = async (id: string, status: UpdateStatusDto) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.patch<Milestone>(`/milestones/${id}/status`, status);

      if (response.data) {
        const index = milestones.value.findIndex((m) => m.id === id);
        if (index !== -1) {
          milestones.value[index] = response.data;
        }

        if (currentMilestone.value?.id === id) {
          currentMilestone.value = response.data;
        }

        return { success: true, data: response.data };
      }

      error.value = response.error || 'Failed to update status';
      return { success: false, error: error.value };
    } catch (err: any) {
      error.value = err.message || 'Failed to update status';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Force refresh milestone progress
   */
  const refreshMilestoneProgress = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get<Milestone>(`/milestones/${id}/check-progress`);

      if (response.data) {
        const index = milestones.value.findIndex((m) => m.id === id);
        if (index !== -1) {
          milestones.value[index] = response.data;
        }

        if (currentMilestone.value?.id === id) {
          currentMilestone.value = response.data;
        }

        return { success: true, data: response.data };
      }

      error.value = response.error || 'Failed to refresh progress';
      return { success: false, error: error.value };
    } catch (err: any) {
      error.value = err.message || 'Failed to refresh progress';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Clear current milestone
   */
  const clearCurrentMilestone = () => {
    currentMilestone.value = null;
  };

  /**
   * Clear error
   */
  const clearError = () => {
    error.value = null;
  };

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State
    milestones,
    currentMilestone,
    loading,
    error,

    // Computed
    achievedMilestones,
    inProgressMilestones,
    pendingMilestones,
    failedMilestones,
    totalMilestones,
    completionRate,

    // Actions
    fetchMilestones,
    fetchMilestoneById,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    updateMilestoneStatus,
    refreshMilestoneProgress,
    clearCurrentMilestone,
    clearError,
  };
});

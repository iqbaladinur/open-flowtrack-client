import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';
import type { AnalyticsResponse } from '@/types';

export const useAnalyticsStore = defineStore('analytics', () => {
  const analyticsSugestion = ref<string[]>([]);
  const loading = ref(false);
  const api = useApi();

  const fetchAnalyticsSugestion = async ({ start_date, end_date}: { start_date: string, end_date: string }) => {
    loading.value = true;
    try {
      const response = await api.post<AnalyticsResponse>(`/analytics/generate`, { start_date, end_date });
      if (response.data) {
        analyticsSugestion.value = response.data.analytics.split('|')?.map(item => item.trim()) || [];
      }
    } catch (error) {
      console.error('Error fetching analytics sugestion:', error);
    } finally {
      loading.value = false;
    }
  }

  return {
    analyticsSugestion,
    loading,
    fetchAnalyticsSugestion,
  }
});
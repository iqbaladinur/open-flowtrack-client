import { defineStore } from 'pinia';
import { useApi } from '@/composables/useApi';

export const useReportsStore = defineStore('reports', () => {
  const api = useApi();
  const getSummary = async (query: {
    startDate?: string,
    endDate?:string,
    includeHidden?: boolean
  }) => {
    return await api.get<{
        totalIncome: number;
        totalExpense: number;
        net: number;
        totalTransfer: number;
    }>(`reports/summary`, {
      params: {
        startDate: query.startDate || undefined,
        endDate: query.endDate || undefined,
        includeHidden: query.includeHidden || undefined,
      }
    })
  }

  return {
    getSummary
  }
});

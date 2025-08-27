import { defineStore } from 'pinia';
import { useApi } from '@/composables/useApi';

export const useBackupStore = defineStore('backups', {
  actions: {
    async createBackup(): Promise<Blob> {
      const api = useApi();
      try {
        const response = await api.get('/backup', { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/json' });
        return blob;
      } catch (error) {
        console.error('Error creating backup:', error);
        throw error;
      }
    },
    async restoreBackup(file: File) {
      const api = useApi();
      const formData = new FormData();
      formData.append('file', file);
      try {
        await api.post('/backup/restore', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (error) {
        console.error('Error restoring backup:', error);
        throw error;
      }
    },
  },
});

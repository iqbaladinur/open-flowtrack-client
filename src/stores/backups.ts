import { defineStore } from 'pinia';
import { useApi } from '@/composables/useApi';

export const useBackupStore = defineStore('backups', {
  actions: {
    async createBackup() {
      const api = useApi();
      try {
        const response = await api.get('/backup', { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `flowtrack_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
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

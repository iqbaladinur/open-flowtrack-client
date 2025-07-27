<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Backup & Restore</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your application data backups.
        </p>
      </div>

      <!-- Create Backup -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Backup</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Download a backup of all your data. Keep this file in a safe place.
        </p>
        <button @click="createBackup" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="flex items-center">
            <LoadingSpinner class="w-5 h-5 mr-2" />
            Creating...
          </span>
          <span v-else class="flex items-center">
            <Download class="w-5 h-5 mr-2" />
            Download Backup
          </span>
        </button>
      </div>

      <!-- Restore Backup -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Restore from Backup</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Restore your data from a backup file. This will overwrite all existing data.
        </p>
        <div class="flex items-center space-x-4">
          <input type="file" @change="handleFileChange" ref="fileInput" class="hidden" accept=".json">
          <button @click="triggerFileInput" class="btn btn-secondary">
            <Upload class="w-5 h-5 mr-2" />
            Choose File
          </button>
          <span v-if="selectedFile" class="text-gray-600 dark:text-gray-400">{{ selectedFile.name }}</span>
        </div>
        <button @click="restoreBackup" class="btn btn-danger mt-4" :disabled="!selectedFile || loading">
           <span v-if="loading" class="flex items-center">
            <LoadingSpinner class="w-5 h-5 mr-2" />
            Restoring...
          </span>
          <span v-else class="flex items-center">
            <UploadCloud class="w-5 h-5 mr-2" />
            Restore Data
          </span>
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBackupStore } from '@/stores/backups';
import AppLayout from '@/components/layouts/AppLayout.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import { Download, Upload, UploadCloud } from 'lucide-vue-next';

const backupStore = useBackupStore();
const loading = ref(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const createBackup = async () => {
  loading.value = true;
  try {
    await backupStore.createBackup();
  } catch (error) {
    console.error('Failed to create backup:', error);
    // You might want to show a user-friendly error message here
  } finally {
    loading.value = false;
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const restoreBackup = async () => {
  if (!selectedFile.value) return;
  loading.value = true;
  try {
    await backupStore.restoreBackup(selectedFile.value);
    // You might want to show a success message here
  } catch (error) {
    console.error('Failed to restore backup:', error);
    // You might want to show a user-friendly error message here
  } finally {
    loading.value = false;
    selectedFile.value = null;
  }
};
</script>

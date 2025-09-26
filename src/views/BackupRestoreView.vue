<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div>
        <h1 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-neon">Backup & Restore</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage your application data backups.
        </p>
      </div>

      <!-- Create Backup -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-neon mb-4">Create Backup</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Download a backup of all your data. Keep this file in a safe place.
        </p>
        <div class="grid grid-cols-2 gap-4">
          <button @click="createBackup" class="btn btn-primary lg:w-[200px] text-xs" :disabled="loadingDownload">
            <span v-if="loadingDownload" class="flex items-center gap-2">
              <LoadingSpinner size="size-5"/>
              Creating...
            </span>
            <span v-else class="flex items-center gap-2">
              <Download class="w-5 h-5" />
              Download
            </span>
          </button>
          <button @click="shareBackup" class="btn btn-secondary lg:hidden text-xs" :disabled="loadingShare">
            <span v-if="loadingShare" class="flex items-center gap-2">
              <LoadingSpinner size="size-5"/>
              Preparing...
            </span>
            <span v-else class="flex items-center gap-2">
              <Share2 class="w-5 h-5" />
              Share
            </span>
          </button>
        </div>
      </div>

      <!-- Restore Backup -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-neon mb-4">Restore from Backup</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Restore your data from a backup file. This will overwrite all existing data.
        </p>
        <div class="flex items-center gap-2">
          <input type="file" @change="handleFileChange" ref="fileInput" class="hidden" accept=".json">
          <button @click="triggerFileInput" class="btn btn-secondary text-xs">
            <Upload class="w-5 h-5 mr-2" />
            Choose File
          </button>
          <span v-if="selectedFile" class="text-gray-600 dark:text-gray-400">{{ selectedFile.name }}</span>
        </div>
        <button @click="restoreBackup" class="mt-4 btn btn-error w-full lg:w-auto text-xs" :disabled="!selectedFile || loading">
           <span v-if="loading" class="flex items-center gap-2">
            <LoadingSpinner size="sm"/>
            Restoring...
          </span>
          <span v-else class="flex items-center gap-2">
            <UploadCloud class="w-5 h-5" />
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
import { Download, Upload, UploadCloud, Share2 } from 'lucide-vue-next';

const backupStore = useBackupStore();
const loading = ref(false);
const loadingDownload = ref(false);
const loadingShare = ref(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const createBackup = async () => {
  loadingDownload.value = true;
  try {
    const blob = await backupStore.createBackup();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `flowtrack_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Failed to create backup:', error);
    // You might want to show a user-friendly error message here
  } finally {
    loadingDownload.value = false;
  }
};

const shareBackup = async () => {
  loadingShare.value = true;
  try {
    const blob = await backupStore.createBackup();
    const date = new Date().toISOString().split('T')[0];
    const file = new File([blob], `flowtrack_backup_${date}.json.txt`, {
      type: 'text/plain',
    });

    const shareData = {
      title: `FlowTrack_Backup_${date}.json`,
      text: 'Here is your FlowTrack data backup.',
      files: [file],
    }

    if (navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      throw new Error("File not supported!");
    }
  } catch (error: any) {
    alert('Failed to share:' + error?.message)
  } finally {
    loadingShare.value = false;
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

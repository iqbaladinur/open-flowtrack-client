<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div>
        <h1 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-neon">
          {{ $t("backup.title") }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t("backup.subtitle") }}
        </p>
      </div>

      <!-- Create Backup -->
      <div class="card p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-neon mb-1">
            {{ $t("backup.createBackup") }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t("backup.createBackupDesc") }}
          </p>
        </div>
        <!-- Desktop: Direct download button -->
        <div class="hidden lg:flex gap-3">
          <button
            @click="createBackup"
            class="btn btn-primary w-auto"
            :disabled="loadingDownload"
          >
            <span
              v-if="loadingDownload"
              class="flex items-center justify-center gap-2"
            >
              <LoadingSpinner size="sm" />
              {{ $t("common.creating") }}
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Download class="size-5" />
              {{ $t("backup.download") }}
            </span>
          </button>
        </div>

        <!-- Mobile: Step-by-step flow -->
        <div class="lg:hidden">
          <!-- Step 1: Create Backup button (shown when no backup created yet) -->
          <div v-if="!createdBackupBlob">
            <button
              @click="createBackupForMobile"
              class="btn btn-primary w-full"
              :disabled="loadingCreateBackup"
            >
              <span
                v-if="loadingCreateBackup"
                class="flex items-center justify-center gap-2"
              >
                <LoadingSpinner size="sm" />
                {{ $t("common.creating") }}
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <DatabaseBackup class="size-5" />
                {{ $t("backup.createBackup") }}
              </span>
            </button>
          </div>

          <!-- Step 2: Download and Share buttons (shown after backup is created) -->
          <div v-else class="space-y-3">
            <div
              class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <p class="text-sm text-green-800 dark:text-green-200">
                {{ $t("backup.backupReady") }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button
                @click="downloadCreatedBackup"
                class="btn btn-primary"
                :disabled="loadingDownload"
              >
                <span
                  v-if="loadingDownload"
                  class="flex items-center justify-center gap-2"
                >
                  <LoadingSpinner size="sm" />
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <Download class="size-5" />
                  {{ $t("backup.download") }}
                </span>
              </button>
              <button
                @click="shareBackup"
                class="btn btn-secondary"
                :disabled="loadingShare"
              >
                <span
                  v-if="loadingShare"
                  class="flex items-center justify-center gap-2"
                >
                  <LoadingSpinner size="sm" />
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <Share2 class="size-5" />
                  {{ $t("backup.share") }}
                </span>
              </button>
            </div>

            <!-- Reset button to create new backup -->
            <button
              @click="createdBackupBlob = null"
              class="btn btn-secondary w-full"
            >
              {{ $t("backup.createNewBackup") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Restore Backup -->
      <div class="card p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-neon mb-1">
            {{ $t("backup.restoreFromBackup") }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t("backup.restoreFromBackupDesc") }}
          </p>
        </div>

        <div class="flex flex-col lg:flex-row gap-3">
          <input
            type="file"
            @change="handleFileChange"
            ref="fileInput"
            class="hidden"
            accept=".json"
          />

          <!-- File picker button or selected file display -->
          <div v-if="!selectedFile">
            <button
              @click="triggerFileInput"
              class="btn btn-secondary w-full lg:w-auto"
            >
              <Upload class="size-5 mr-2" />
              {{ $t("common.chooseFile") }}
            </button>
          </div>
          <div
            v-else
            class="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-full lg:w-auto lg:min-w-[300px] lg:max-w-md"
          >
            <FileJson
              class="size-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
            />
            <span class="text-sm text-gray-900 dark:text-white truncate flex-1">
              {{ selectedFile.name }}
            </span>
            <button
              @click="clearSelectedFile"
              class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
            >
              <X class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <!-- Restore button -->
          <button
            @click="showConfirmModal = true"
            class="btn btn-error w-full lg:w-auto"
            :disabled="!selectedFile || loading"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              {{ $t("common.restoring") }}
            </span>
            <span v-else class="flex items-center gap-2">
              <RotateCcw class="size-5" />
              {{ $t("backup.restoreData") }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <Modal v-model="showConfirmModal" :title="$t('backup.confirmRestoreTitle')">
      <div class="space-y-4">
        <div
          class="flex items-start gap-3 p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg"
        >
          <AlertTriangle
            class="size-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5"
          />
          <div class="flex-1">
            <p
              class="text-sm font-medium text-warning-800 dark:text-warning-200 mb-1"
            >
              {{ $t("backup.confirmRestoreMessage") }}
            </p>
            <p class="text-xs text-warning-700 dark:text-warning-300">
              {{ $t("backup.confirmRestoreWarning") }}
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 w-full">
          <button
            @click="showConfirmModal = false"
            class="btn btn-secondary flex-1"
            :disabled="loading"
          >
            {{ $t("backup.cancel") }}
          </button>
          <button
            @click="confirmRestore"
            class="btn btn-error flex-1"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              {{ $t("common.restoring") }}
            </span>
            <span v-else>{{ $t("backup.confirm") }}</span>
          </button>
        </div>
      </template>
    </Modal>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useBackupStore } from "@/stores/backups";
import AppLayout from "@/components/layouts/AppLayout.vue";
import Modal from "@/components/ui/Modal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import {
  Download,
  Upload,
  Share2,
  RotateCcw,
  AlertTriangle,
  FileJson,
  X,
  DatabaseBackup,
} from "lucide-vue-next";

const { t } = useI18n();
const backupStore = useBackupStore();
const loading = ref(false);
const loadingDownload = ref(false);
const loadingShare = ref(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const showConfirmModal = ref(false);

// State for storing created backup
const createdBackupBlob = ref<Blob | null>(null);
const createdBackupDate = ref<string>("");
const loadingCreateBackup = ref(false);

// Step 1: Create backup (for mobile)
const createBackupForMobile = async () => {
  loadingCreateBackup.value = true;
  try {
    const blob = await backupStore.createBackup();
    createdBackupBlob.value = blob;
    createdBackupDate.value = new Date().toISOString().split("T")[0];
  } catch (error) {
    console.error("Failed to create backup:", error);
    alert(t("backup.createBackupError"));
  } finally {
    loadingCreateBackup.value = false;
  }
};

// Desktop: Direct download
const createBackup = async () => {
  loadingDownload.value = true;
  try {
    const blob = await backupStore.createBackup();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `flowtrack_backup_${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(link.href);

    // Show success notification
    alert(t("backup.createBackupSuccess"));
  } catch (error) {
    console.error("Failed to create backup:", error);
    alert(t("backup.createBackupError"));
  } finally {
    loadingDownload.value = false;
  }
};

// Mobile: Download from created backup
const downloadCreatedBackup = () => {
  if (!createdBackupBlob.value) return;

  loadingDownload.value = true;
  try {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(createdBackupBlob.value);
    link.download = `flowtrack_backup_${createdBackupDate.value}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Failed to download backup:", error);
    alert(t("backup.createBackupError"));
  } finally {
    loadingDownload.value = false;
  }
};

// Mobile: Share from created backup
const shareBackup = async () => {
  if (!createdBackupBlob.value) return;

  loadingShare.value = true;
  try {
    const file = new File(
      [createdBackupBlob.value],
      `flowtrack_backup_${createdBackupDate.value}.json.txt`,
      {
        type: "text/plain",
      }
    );

    const shareData = {
      title: `FlowTrack_Backup_${createdBackupDate.value}.json`,
      text: t("backup.shareText"),
      files: [file],
    };

    if (navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      throw new Error(t("backup.fileNotSupported"));
    }
  } catch (error: any) {
    alert(t("backup.failedToShare") + " " + error?.message);
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

const clearSelectedFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const confirmRestore = async () => {
  if (!selectedFile.value) {
    alert(t("backup.noFileSelected"));
    return;
  }

  loading.value = true;
  try {
    await backupStore.restoreBackup(selectedFile.value);

    // Show success notification
    alert(t("backup.restoreSuccess"));

    // Close modal
    showConfirmModal.value = false;

    // Reload page to apply changes after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error("Failed to restore backup:", error);
    alert(t("backup.restoreError"));
  } finally {
    loading.value = false;
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }
};
</script>

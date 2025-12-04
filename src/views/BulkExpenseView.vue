<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex justify-between gap-4">
        <div>
          <h1 class="text-xl lg:text-3xl font-bold text-gray-900 dark:text-neon">
            {{ $t('bulkExpense.title') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            {{ $t('bulkExpense.subtitle') }}
          </p>
        </div>
      </div>

      <!-- Step 1: Image Upload -->
      <div v-if="currentStep === 1" class="card bg-base-100 shadow p-2 lg:p-6">
        <div class="card-body">
          <h2 class="card-title">{{ $t('bulkExpense.step1') }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t('bulkExpense.step1Desc') }}
          </p>

          <div v-if="!selectedImage">
            <div @click="triggerFileInput" @dragover.prevent @dragleave.prevent @drop.prevent="handleDrop"
              class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-6 py-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div class="text-center">
                <UploadCloud class="mx-auto h-12 w-12 text-gray-400" />
                <div class="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                  <label for="file-upload"
                    class="relative cursor-pointer rounded-md font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500">
                    <span>{{ $t('common.uploadFile') }}</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleImageUpload"/>
                  </label>
                  <p class="pl-1">{{ $t('common.dragAndDrop') }}</p>
                </div>
                <p class="text-xs leading-5 text-gray-500 dark:text-gray-500">
                  {{ $t('bulkExpense.fileTypes') }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="selectedImage" class="mt-4">
            <div class="flex items-center justify-between p-2 border rounded-md bg-gray-50 dark:bg-gray-800/50">
              <div class="flex items-center gap-3 truncate">
                <img :src="imagePreviewUrl" alt="Preview" class="h-12 w-12 rounded-md object-cover flex-shrink-0" />
                <div class="text-sm font-medium truncate">
                  <p class="truncate">{{ selectedImage.name }} {{ $t('bulkExpense.cropped') }}</p>
                  <p class="text-xs text-gray-500">
                    {{ (selectedImage.size / 1024).toFixed(2) }} KB
                  </p>
                </div>
              </div>
              <button @click="removeImage" class="btn btn-sm btn-ghost btn-circle">
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="card-actions justify-end mt-4 flex items-center">
            <button @click="processImage" class="btn btn-primary flex items-center gap-2"
              :disabled="!selectedImage || ocrLoading">
              <LoadingSpinner v-if="ocrLoading" size="sm" />
              {{ $t('bulkExpense.processImage') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Cropper Modal -->
      <Modal v-model="isCropModalOpen" :title="$t('bulkExpense.cropImage')">
        <div class="w-full h-[50vh]">
          <VueCropper
            v-if="rawImageForCropper"
            ref="cropper"
            :src="rawImageForCropper"
            alt="Image to crop"
            :aspect-ratio="0"
            :guides="true"
            :view-mode="2"
            :auto-crop-area="0.8"
            :background="false"
          />
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <button @click="cancelCrop" class="btn btn-ghost">{{ $t('common.cancel') }}</button>
            <button @click="cropImage" class="btn btn-primary">{{ $t('bulkExpense.cropAndUse') }}</button>
          </div>
        </template>
      </Modal>

      <!-- Step 2: Review and Edit (Side-by-Side) -->
      <div v-if="currentStep === 2" class="card bg-base-100 shadow p-2 lg:p-6">
        <div class="card-body">
          <h2 class="card-title">{{ $t('bulkExpense.step2') }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t('bulkExpense.step2Desc') }}
          </p>

          <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Image Preview Column -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('bulkExpense.imagePreview') }}
              </h3>
              <div
                class="p-2 border rounded-md bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                <img v-if="imagePreviewUrl" :src="imagePreviewUrl" alt="Uploaded receipt"
                  class="h-auto lg:h-[48vh] object-contain rounded" />
              </div>
            </div>

            <!-- OCR Text Column -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('bulkExpense.extractedText') }}
              </h3>
              <div class="p-2 border rounded-md bg-gray-50 dark:bg-gray-800/50 h-[50vh]">
                <textarea v-model="ocrResultText"
                  class="textarea textarea-bordered w-full h-full min-h-[300px]  dark:bg-white dark:text-black p-4"
                  :placeholder="$t('bulkExpense.extractedTextPlaceholder')"></textarea>
              </div>
            </div>
          </div>

          <div class="card-actions justify-end mt-6 flex items-center gap-2">
            <button @click="currentStep = 1" class="btn btn-ghost">{{ $t('common.back') }}</button>
            <button @click="previewTransactions" class="btn btn-primary flex items-center gap-2"
              :disabled="!ocrResultText.trim() || previewLoading">
              <LoadingSpinner v-if="previewLoading" size="sm" />
              {{ $t('bulkExpense.previewTransactions') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Review and Save Transactions -->
      <div v-if="currentStep === 3" class="card bg-base-100 shadow p-2 lg:p-6">
        <div class="card-body">
          <h2 class="card-title">{{ $t('bulkExpense.step3') }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t('bulkExpense.step3Desc') }}
          </p>

          <!-- Mobile View: List of Cards -->
          <div class="mt-4 space-y-4 lg:hidden">
            <div class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent" :class="{ 'border-gray-400 dark:border-neon': isAllSelected }">
              <label class="flex items-center cursor-pointer w-full">
                <input ref="selectAllTrx" type="checkbox" @change="toggleSelectAll" :checked="isAllSelected"
                  class="checkbox checkbox-sm checkbox-primary hidden" />
                <button class="w-6 h-6 border-2 flex items-center justify-center rounded-md dark:border-neon border-primary-500" @click="($refs.selectAllTrx as HTMLInputElement)?.click()">
                  <Check v-if="isAllSelected" class="w-4 h-4 text-primary-500 dark:text-neon"></Check>
                </button>
                <span class="ml-3 text-sm font-medium">{{ $t('bulkExpense.selectAllTransactions') }}</span>
              </label>
            </div>
            <div v-for="(item, index) in previewedTransactions" :key="`mobile-${index}`"
              class="p-4 rounded-lg border-2 bg-gray-50 border-transparent dark:bg-gray-800/50 dark:border-gray-700 border-gray-700" :class="{ 'dark:border-neon border-gray-400': item.selected }"
            >
              <!-- Main content row -->
              <div class="flex items-center justify-between">
                <h1 class="text-md">
                  {{ $t('bulkExpense.expenseNumber') }} #{{ index + 1 }}
                </h1>
                <button class="w-6 h-6 border-2 flex items-center justify-center rounded-md dark:border-neon border-primary-500" @click="item.selected = !item.selected">
                  <Check v-if="item.selected" class="w-4 h-4 text-primary-500 dark:text-neon"></Check>
                </button>
              </div>
              <input type="checkbox" v-model="item.selected" class="hidden checkbox checkbox-sm checkbox-primary" />
              <!-- Details row -->
              <div class="w-full">
                <label class="text-xs font-medium text-gray-500">{{ $t('bulkExpense.date') }}</label>
                <input type="date" v-model="item.date" class="input input-sm input-bordered w-full" />
              </div>
              <div class="w-full">
                <label class="text-xs font-medium text-gray-500">{{ $t('bulkExpense.amount') }}</label>
                <input type="number" v-model="item.amount" class="input input-sm input-bordered w-full text-right"
                  placeholder="0.00" />
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500">{{ $t('bulkExpense.wallet') }}</label>
                <select v-model="item.wallet_id" class="select select-sm select-bordered w-full input">
                  <option disabled value="">{{ $t('bulkExpense.selectWallet') }}</option>
                  <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
                    {{ wallet.name }}
                  </option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label class="text-xs font-medium text-gray-500">{{ $t('bulkExpense.category') }}</label>
                <select v-model="item.category_id" class="select select-sm select-bordered w-full input">
                  <option disabled value="">{{ $t('bulkExpense.selectCategory') }}</option>
                  <option v-for="category in expenseCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label class="text-xs font-medium text-gray-500">{{ $t('bulkExpense.note') }}</label>
                <textarea type="text" v-model="item.note" class="input input-sm input-bordered w-full"
                  :placeholder="$t('bulkExpense.transactionNote')"></textarea>
              </div>
            </div>
          </div>

          <!-- Desktop View: Table -->
          <div class="hidden lg:block overflow-x-auto mt-4 border rounded-lg dark:border-gray-700">
            <table class="table w-full table-auto">
              <thead class="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th class="p-4 w-12 text-center">
                    <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected"
                      class="checkbox checkbox-sm checkbox-primary" />
                  </th>
                  <th
                    class="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-40">
                    {{ $t('bulkExpense.date') }}
                  </th>
                  <th
                    class="p-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-40">
                    {{ $t('bulkExpense.amount') }}
                  </th>
                  <th
                    class="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-48">
                    {{ $t('bulkExpense.wallet') }}
                  </th>
                  <th
                    class="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-48">
                    {{ $t('bulkExpense.category') }}
                  </th>
                  <th
                    class="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {{ $t('bulkExpense.note') }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in previewedTransactions" :key="index"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td class="p-4 text-center">
                    <input type="checkbox" v-model="item.selected" class="checkbox checkbox-sm checkbox-primary" />
                  </td>
                  <td class="p-2 align-middle">
                    <input type="date" v-model="item.date" class="input input-sm input-bordered w-full" />
                  </td>
                  <td class="p-2 align-middle">
                    <input type="number" v-model="item.amount" class="input input-sm input-bordered w-full text-right"
                      placeholder="0.00" />
                  </td>
                  <td class="p-2 align-middle">
                    <select v-model="item.wallet_id" class="select select-sm select-bordered w-full input">
                      <option disabled value="">{{ $t('bulkExpense.selectWallet') }}</option>
                      <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
                        {{ wallet.name }}
                      </option>
                    </select>
                  </td>
                  <td class="p-2 align-middle">
                    <select v-model="item.category_id" class="select select-sm select-bordered w-full input">
                      <option disabled value="">{{ $t('bulkExpense.selectCategory') }}</option>
                      <option v-for="category in expenseCategories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </td>
                  <td class="p-2 align-middle">
                    <input type="text" v-model="item.note" class="input input-sm input-bordered w-full"
                      :placeholder="$t('bulkExpense.transactionNote')" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-actions justify-end mt-4 flex items-center gap-2">
            <button @click="currentStep = 2" class="btn btn-ghost">{{ $t('common.back') }}</button>
            <button @click="saveTransactions" class="btn btn-primary flex items-center gap-2" :disabled="savingLoading">
              <LoadingSpinner v-if="savingLoading" size="sm" />
              {{ $t('bulkExpense.saveSelectedTransactions') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { createWorker } from "tesseract.js";
import { useWalletsStore } from "@/stores/wallets";
import { useCategoriesStore } from "@/stores/categories";
import { useTransactionsStore } from "@/stores/transactions";
import { storeToRefs } from "pinia";
import AppLayout from "@/components/layouts/AppLayout.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import Modal from "@/components/ui/Modal.vue";
import { UploadCloud, X, Check } from "lucide-vue-next";
import { format } from "date-fns";
import { useRouter } from "vue-router";
import VueCropper from "vue-cropperjs";
import "vue-cropperjs/node_modules/cropperjs/dist/cropper.css";

interface PreviewTransaction {
  date: string;
  note: string;
  amount: number;
  wallet_id: string;
  category_id: string;
  type: "expense";
  selected: boolean;
}

const { t } = useI18n();
const router = useRouter();
const walletsStore = useWalletsStore();
const categoriesStore = useCategoriesStore();
const transactionsStore = useTransactionsStore();

const { wallets } = storeToRefs(walletsStore);
const { categories } = storeToRefs(categoriesStore);

const currentStep = ref(1);
const selectedImage = ref<File | null>(null);
const imagePreviewUrl = ref<string | undefined>(undefined);
const rawImageForCropper = ref<string | undefined>(undefined);
const ocrResultText = ref("");
const previewedTransactions = ref<PreviewTransaction[]>([]);

const ocrLoading = ref(false);
const previewLoading = ref(false);
const savingLoading = ref(false);

const isCropModalOpen = ref(false);
const cropper = ref<typeof VueCropper | null>(null);
const originalFile = ref<File | null>(null);

const expenseCategories = computed(() =>
  categories.value.filter((c) => c.type === "expense")
);
const isAllSelected = computed(
  () =>
    previewedTransactions.value.length > 0 &&
    previewedTransactions.value.every((t) => t.selected)
);

onMounted(async () => {
  await walletsStore.fetchWallets();
  await categoriesStore.fetchCategories();
});

const triggerFileInput = () => {
  document.getElementById("file-upload")?.click();
};

const processFile = async (file: File) => {
  if (!file.type.startsWith("image/")) {
    alert(t('bulkExpense.uploadImageError'));
    return;
  }
  originalFile.value = file;
  rawImageForCropper.value = URL.createObjectURL(file);

  await nextTick();
  isCropModalOpen.value = true;
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    processFile(target.files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0]);
  }
};

const removeImage = () => {
  selectedImage.value = null;
  originalFile.value = null;

  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
    imagePreviewUrl.value = undefined;
  }
  if (rawImageForCropper.value) {
    URL.revokeObjectURL(rawImageForCropper.value);
    rawImageForCropper.value = undefined;
  }

  const fileInput = document.getElementById("file-upload") as HTMLInputElement;
  if (fileInput) {
    fileInput.value = "";
  }
};

const cropImage = () => {
  if (!cropper.value || !originalFile.value) return;
  // @ts-ignore
  const canvas = cropper.value.getCroppedCanvas();
  if (!canvas) return;
  // @ts-ignore
  canvas.toBlob((blob) => {
    if (blob) {
      const croppedFile = new File([blob], originalFile.value?.name || 'cropped.jpg', {
        type: blob.type,
      });
      selectedImage.value = croppedFile;
      if (imagePreviewUrl.value) {
        URL.revokeObjectURL(imagePreviewUrl.value);
      }
      imagePreviewUrl.value = URL.createObjectURL(croppedFile);
    }
    isCropModalOpen.value = false;
  });
};

const cancelCrop = () => {
  isCropModalOpen.value = false;
  removeImage();
};

const processImage = async () => {
  if (!selectedImage.value) return;

  ocrLoading.value = true;
  const worker = await createWorker("eng");

  try {
    const {
      data: { text },
    } = await worker.recognize(selectedImage.value);
    ocrResultText.value = text;
    currentStep.value = 2;
  } catch (error) {
    console.error("OCR Error:", error);
    alert(t('bulkExpense.ocrError'));
  } finally {
    await worker.terminate();
    ocrLoading.value = false;
  }
};

const previewTransactions = async () => {
  if (!ocrResultText.value.trim()) return;

  previewLoading.value = true;
  try {
    const response = await transactionsStore.mapExpenseTransaction(
      ocrResultText.value
    );

    if (response.data) {
      const defaultWalletId = wallets.value.find(w => w.is_main_wallet)?.id || wallets.value.length > 0 ? wallets.value[0].id : "";
      const defaultCategoryId = expenseCategories.value.length > 0 ? expenseCategories.value[0].id : "";
      const today = format(new Date(), "yyyy-MM-dd");
      previewedTransactions.value = <PreviewTransaction[]>response.data.map(
        (item) => ({
          date: today,
          note: item.note,
          amount: item.amount || 0,
          wallet_id: defaultWalletId,
          category_id: item.category_id || defaultCategoryId,
          type: "expense",
          selected: true,
        })
      );
      currentStep.value = 3;
    } else {
      console.error("Failed to parse transactions:", response.error);
      alert(t('bulkExpense.previewError'));
    }
  } catch (error) {
    console.error("API Error:", error);
    alert(t('bulkExpense.apiError'));
  } finally {
    previewLoading.value = false;
  }
};

const toggleSelectAll = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const isChecked = target.checked;
  previewedTransactions.value.forEach((t) => (t.selected = isChecked));
};

const saveTransactions = async () => {
  savingLoading.value = true;
  const transactionsToSave = previewedTransactions.value.filter(
    (t) => t.selected
  );

  const promises = transactionsToSave.map((t) =>
    transactionsStore.createTransaction({
      type: "expense",
      amount: t.amount,
      wallet_id: t.wallet_id,
      category_id: t.category_id,
      date: t.date,
      note: t.note,
    })
  );

  try {
    const results = await Promise.all(promises);
    const successfulCreations = results.filter(r => r.success).length;

    alert(`${successfulCreations} ${t('bulkExpense.saveSuccess')}`);

    currentStep.value = 1;
    removeImage();
    ocrResultText.value = '';
    previewedTransactions.value = [];
    router.push({
      name: 'transactions'
    });
  } catch (error) {
    console.error("Error saving transactions:", error);
    alert(t('bulkExpense.saveError'));
  } finally {
    savingLoading.value = false;
  }
};
</script>

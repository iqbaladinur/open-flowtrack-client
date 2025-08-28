<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex justify-between gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-neon">
            Bulk Expense
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Upload an image to extract transactions
          </p>
        </div>
      </div>

      <!-- Step 1: Image Upload -->
      <div v-if="currentStep === 1" class="card bg-base-100 shadow p-6">
        <div class="card-body">
          <h2 class="card-title">Step 1: Upload an Image</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Upload a clear image of a receipt or a list of expenses.
          </p>

          <div v-if="!selectedImage">
            <div @click="triggerFileInput" @dragover.prevent @dragleave.prevent @drop.prevent="handleDrop"
              class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-6 py-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div class="text-center">
                <UploadCloud class="mx-auto h-12 w-12 text-gray-400" />
                <div class="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                  <label for="file-upload"
                    class="relative cursor-pointer rounded-md font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleImageUpload"/>
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs leading-5 text-gray-500 dark:text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <div v-if="selectedImage" class="mt-4">
            <div class="flex items-center justify-between p-2 border rounded-md bg-gray-50 dark:bg-gray-800/50">
              <div class="flex items-center gap-3 truncate">
                <img :src="imagePreviewUrl" alt="Preview" class="h-12 w-12 rounded-md object-cover flex-shrink-0" />
                <div class="text-sm font-medium truncate">
                  <p class="truncate">{{ selectedImage.name }}</p>
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
              Process Image
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: Review and Edit (Side-by-Side) -->
      <div v-if="currentStep === 2" class="card bg-base-100 shadow p-6">
        <div class="card-body">
          <h2 class="card-title">Step 2: Review and Edit Extracted Text</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Correct any errors in the extracted text. This text will be sent to
            the server for processing.
          </p>

          <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Image Preview Column -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Image Preview
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
                Extracted Text (Editable)
              </h3>
              <div class="p-2 border rounded-md bg-gray-50 dark:bg-gray-800/50 h-[50vh]">
                <textarea v-model="ocrResultText"
                  class="textarea textarea-bordered w-full h-full min-h-[300px] font-mono dark:bg-white dark:text-black p-4"
                  placeholder="Extracted text will appear here..."></textarea>
              </div>
            </div>
          </div>

          <div class="card-actions justify-end mt-6 flex items-center gap-2">
            <button @click="currentStep = 1" class="btn btn-ghost">Back</button>
            <button @click="previewTransactions" class="btn btn-primary flex items-center gap-2"
              :disabled="!ocrResultText.trim() || previewLoading">
              <LoadingSpinner v-if="previewLoading" size="sm" />
              Preview Transactions
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Review and Save Transactions -->
      <div v-if="currentStep === 3" class="card bg-base-100 shadow p-6">
        <div class="card-body">
          <h2 class="card-title">Step 3: Review and Save Transactions</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Edit the details for each transaction below. Unchecked transactions
            will be ignored.
          </p>

          <!-- Mobile View: List of Cards -->
          <div class="mt-4 space-y-4 lg:hidden">
            <div class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <label class="flex items-center cursor-pointer w-full">
                <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected"
                  class="checkbox checkbox-sm checkbox-primary" />
                <span class="ml-3 text-sm font-medium">Select All Transactions</span>
              </label>
            </div>
            <div v-for="(item, index) in previewedTransactions" :key="`mobile-${index}`"
              class="p-4 rounded-lg border dark:border-gray-700 border-gray-700" :class="{ 'dark:border-neon border-primary-500': item.selected }"
            >
              <!-- Main content row -->
              <div class="flex items-center justify-between">
                <h1 class="text-md">
                  Expense #{{ index + 1 }}
                </h1>
                <button class="w-6 h-6 border flex items-center justify-center rounded-md dark:border-neon border-primary-500" @click="item.selected = !item.selected">
                  <Check v-if="item.selected" class="w-4 h-4"></Check>
                </button>
              </div>
              <input type="checkbox" v-model="item.selected" class="hidden checkbox checkbox-sm checkbox-primary" />
              <!-- Details row -->
              <div class="w-full">
                <label class="text-xs font-medium text-gray-500">Date</label>
                <input type="date" v-model="item.date" class="input input-sm input-bordered w-full" />
              </div>
              <div class="w-full">
                <label class="text-xs font-medium text-gray-500">Amount</label>
                <input type="number" v-model="item.amount" class="input input-sm input-bordered w-full text-right"
                  placeholder="0.00" />
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500">Wallet</label>
                <select v-model="item.wallet_id" class="select select-sm select-bordered w-full input">
                  <option disabled value="">Select Wallet</option>
                  <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
                    {{ wallet.name }}
                  </option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label class="text-xs font-medium text-gray-500">Category</label>
                <select v-model="item.category_id" class="select select-sm select-bordered w-full input">
                  <option disabled value="">Select Category</option>
                  <option v-for="category in expenseCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label class="text-xs font-medium text-gray-500">Note</label>
                <textarea type="text" v-model="item.note" class="input input-sm input-bordered w-full"
                  placeholder="Transaction note..."></textarea>
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
                    Date
                  </th>
                  <th
                    class="p-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-40">
                    Amount
                  </th>
                  <th
                    class="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-48">
                    Wallet
                  </th>
                  <th
                    class="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-48">
                    Category
                  </th>
                  <th
                    class="p-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Note
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
                      <option disabled value="">Select Wallet</option>
                      <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
                        {{ wallet.name }}
                      </option>
                    </select>
                  </td>
                  <td class="p-2 align-middle">
                    <select v-model="item.category_id" class="select select-sm select-bordered w-full input">
                      <option disabled value="">Select Category</option>
                      <option v-for="category in expenseCategories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </td>
                  <td class="p-2 align-middle">
                    <input type="text" v-model="item.note" class="input input-sm input-bordered w-full"
                      placeholder="Transaction note..." />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-actions justify-end mt-4 flex items-center gap-2">
            <button @click="currentStep = 2" class="btn btn-ghost">Back</button>
            <button @click="saveTransactions" class="btn btn-primary flex items-center gap-2" :disabled="savingLoading">
              <LoadingSpinner v-if="savingLoading" size="sm" />
              Save Selected Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { createWorker } from "tesseract.js";
import { useWalletsStore } from "@/stores/wallets";
import { useCategoriesStore } from "@/stores/categories";
import { useTransactionsStore } from "@/stores/transactions";
import { storeToRefs } from "pinia";
import AppLayout from "@/components/layouts/AppLayout.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { UploadCloud, X, Check } from "lucide-vue-next";
import { format } from "date-fns";
import { useRouter } from "vue-router";

interface PreviewTransaction {
  date: string;
  note: string;
  amount: number;
  wallet_id: string;
  category_id: string;
  type: "expense";
  selected: boolean;
}

const router = useRouter();
const walletsStore = useWalletsStore();
const categoriesStore = useCategoriesStore();
const transactionsStore = useTransactionsStore();

const { wallets } = storeToRefs(walletsStore);
const { categories } = storeToRefs(categoriesStore);

const currentStep = ref(1);
const selectedImage = ref<File | null>(null);
const imagePreviewUrl = ref<string | undefined>(undefined);
const ocrResultText = ref("");
const previewedTransactions = ref<PreviewTransaction[]>([]);

const ocrLoading = ref(false);
const previewLoading = ref(false);
const savingLoading = ref(false);

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

const processFile = (file: File) => {
  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file.");
    return;
  }
  selectedImage.value = file;
  imagePreviewUrl.value = URL.createObjectURL(file);
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
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
    imagePreviewUrl.value = undefined;
  }
  const fileInput = document.getElementById("file-upload") as HTMLInputElement;
  if (fileInput) {
    fileInput.value = "";
  }
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
    alert("An error occurred during OCR processing. Please check the console.");
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
      const defaultWalletId =
        wallets.value.length > 0 ? wallets.value[0].id : "";
      const defaultCategoryId =
        expenseCategories.value.length > 0 ? expenseCategories.value[0].id : "";
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
      alert("Failed to get transaction preview. Please check the console.");
    }
  } catch (error) {
    console.error("API Error:", error);
    alert("An API error occurred. Please check the console.");
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
    
    alert(`${successfulCreations} of ${transactionsToSave.length} transactions saved successfully!`);
    
    currentStep.value = 1;
    removeImage();
    ocrResultText.value = '';
    previewedTransactions.value = [];
    router.push({
      name: 'transactions'
    });
  } catch (error) {
    console.error("Error saving transactions:", error);
    alert(
      "An error occurred while saving transactions. Please check the console for details."
    );
  } finally {
    savingLoading.value = false;
  }
};
</script>

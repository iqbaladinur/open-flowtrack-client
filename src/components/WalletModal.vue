<template>
  <Modal v-model="isModalOpen" :title="wallet ? 'Edit Wallet' : 'Add Wallet'">
    <form @submit.prevent="handleSubmit" id="wallet-form" class="space-y-4">
      <!-- Wallet Name -->
      <div>
        <label for="name" class="label">Wallet Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="input"
          placeholder="e.g., Main Bank Account"
          :disabled="loading"
        />
      </div>

      <!-- Initial Balance -->
      <div>
        <label for="balance" class="label">Initial Balance</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {{ configStore.currency }}
          </span>
          <input
            id="balance"
            v-model.number="form.initial_balance"
            type="number"
            step="0.01"
            required
            class="input pl-12"
            placeholder="0.00"
            :disabled="loading"
          />
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          This will be your starting balance for this wallet.
        </p>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
        <p class="text-sm text-error-700 dark:text-error-300">{{ error }}</p>
      </div>
    </form>
    <template #footer>
      <div class="flex space-x-3">
        <button
          type="button"
          @click="$emit('update:modelValue', false)"
          class="flex-1 btn-secondary"
          :disabled="loading"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="wallet-form"
          class="flex-1 btn-primary"
          :disabled="loading || !isFormValid"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>{{ wallet ? 'Update' : 'Create' }} Wallet</span>
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useWalletsStore } from '@/stores/wallets';
import { useConfigStore } from '@/stores/config';
import Modal from '@/components/ui/Modal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import type { Wallet } from '@/types';

interface Props {
  modelValue: boolean;
  wallet?: Wallet | null;
}

const props = withDefaults(defineProps<Props>(), {
  wallet: null,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'success': [];
}>();

const walletsStore = useWalletsStore();
const configStore = useConfigStore();

const loading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
  initial_balance: 0,
});

const isFormValid = computed(() => {
  return form.name.trim() && form.initial_balance >= 0;
});

const handleSubmit = async () => {
  if (!isFormValid.value || loading.value) return;

  loading.value = true;
  error.value = '';

  try {
    const walletData = {
      name: form.name.trim(),
      initial_balance: form.initial_balance,
    };

    let result;
    if (props.wallet) {
      result = await walletsStore.updateWallet(props.wallet.id, walletData);
    } else {
      result = await walletsStore.createWallet(walletData);
    }

    if (result.success) {
      emit('success');
      resetForm();
    } else {
      error.value = result.error || 'Failed to save wallet. Please try again.';
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const resetForm = () => {
  Object.assign(form, {
    name: '',
    initial_balance: 0,
  });
};

// Watch for wallet changes to populate form
watch(() => props.wallet, (newWallet) => {
  if (newWallet) {
    Object.assign(form, {
      name: newWallet.name,
      initial_balance: Number(newWallet.initial_balance) || 0,
    });
  } else {
    resetForm();
  }
}, { immediate: true });
</script>

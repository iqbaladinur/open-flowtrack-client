<template>
  <Modal v-model="isModalOpen" :title="wallet ? $t('walletModal.editWallet') : $t('walletModal.addWallet')">
    <form @submit.prevent="handleSubmit" id="wallet-form" class="space-y-6 pt-4">
      <!-- Initial Balance -->
      <div class="text-center">
        <label for="balance" class="label sr-only">{{ $t('walletModal.initialBalance') }}</label>
        <CurrencyInput
          v-model="form.initial_balance"
          el-id="balance"
          :required="true"
          :disabled="loading"
          :placeholder="$t('walletModal.initialBalancePlaceholder')"
        />
        <p class="text-xs text-sepia-600 dark:text-gray-400 mt-2">
          {{ $t('walletModal.initialBalanceHint') }}
        </p>
      </div>

      <!-- Wallet Name -->
      <div>
        <label for="name" class="label">{{ $t('walletModal.walletName') }}</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="input"
          :placeholder="$t('walletModal.walletNamePlaceholder')"
          :disabled="loading"
          autocomplete="off"
        />
      </div>

      <!-- Hidden Wallet -->
      <div class="flex items-center justify-between rounded-lg p-3 border border-sepia-300 dark:border-gray-700 bg-sepia-100 dark:bg-gray-800/50">
        <div>
          <label for="hidden-toggle" class="font-medium text-sepia-900 dark:text-gray-100">
            {{ $t('walletModal.hideWallet') }}
          </label>
          <p class="text-xs text-sepia-600 dark:text-gray-400 mt-1">
            {{ $t('walletModal.hideWalletHint') }}
          </p>
        </div>
        <button
          type="button"
          @click="form.hidden = !form.hidden"
          :class="[
            form.hidden ? 'bg-sepia-700 dark:bg-neon' : 'bg-sepia-300 dark:bg-gray-700',
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sepia-500 dark:focus:ring-neon focus:ring-offset-2 dark:focus:ring-offset-gray-900'
          ]"
          role="switch"
          :aria-checked="form.hidden"
          id="hidden-toggle"
          :disabled="loading"
        >
          <span class="sr-only">{{ $t('walletModal.useSetting') }}</span>
          <span
            aria-hidden="true"
            :class="[
              form.hidden ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            ]"
          />
        </button>
      </div>

      <!-- Main Wallet -->
      <div class="flex items-center justify-between rounded-lg p-3 border border-sepia-300 dark:border-gray-700 bg-sepia-100 dark:bg-gray-800/50">
        <div>
          <label for="main-wallet-toggle" class="font-medium text-sepia-900 dark:text-gray-100">
            {{ $t('walletModal.setAsMain') }}
          </label>
          <p class="text-xs text-sepia-600 dark:text-gray-400 mt-1">
            {{ $t('walletModal.setAsMainHint') }}
          </p>
        </div>
        <button
          type="button"
          @click="form.is_main_wallet = !form.is_main_wallet"
          :class="[
            form.is_main_wallet ? 'bg-sepia-700 dark:bg-neon' : 'bg-sepia-300 dark:bg-gray-700',
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sepia-500 dark:focus:ring-neon focus:ring-offset-2 dark:focus:ring-offset-gray-900'
          ]"
          role="switch"
          :aria-checked="form.is_main_wallet"
          id="main-wallet-toggle"
          :disabled="loading"
        >
          <span class="sr-only">{{ $t('walletModal.useSetting') }}</span>
          <span
            aria-hidden="true"
            :class="[
              form.is_main_wallet ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            ]"
          />
        </button>
      </div>

      <!-- Error Display -->
      <div
        v-if="error"
        class="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800"
      >
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
          {{ $t('walletModal.cancel') }}
        </button>
        <button
          type="submit"
          form="wallet-form"
          class="flex-1 btn-primary"
          :disabled="loading || !isFormValid"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>{{ wallet ? $t('walletModal.update') : $t('walletModal.create') }} {{ $t('walletModal.wallet') }}</span>
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useWalletsStore } from '@/stores/wallets';
import Modal from '@/components/ui/Modal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import CurrencyInput from '@/components/ui/CurrencyInput.vue';
import type { Wallet } from '@/types/wallet';

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

const { t } = useI18n();
const walletsStore = useWalletsStore();

const loading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
  initial_balance: 0,
  hidden: false,
  is_main_wallet: false,
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
      hidden: form.hidden,
      is_main_wallet: form.is_main_wallet,
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
      error.value = result.error || t('walletModal.saveFailed');
    }
  } catch (err) {
    error.value = t('walletModal.unexpectedError');
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
    hidden: false,
    is_main_wallet: false,
  });
};

// Watch for wallet changes to populate form
watch(() => props.wallet, (newWallet) => {
  if (newWallet) {
    Object.assign(form, {
      name: newWallet.name,
      initial_balance: Number(newWallet.initial_balance) || 0,
      hidden: newWallet.hidden,
      is_main_wallet: newWallet.is_main_wallet || false
    });
  } else {
    resetForm();
  }
}, { immediate: true });
</script>
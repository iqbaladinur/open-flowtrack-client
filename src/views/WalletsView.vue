<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-neon">Wallets</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Manage your accounts and balances
          </p>
        </div>
        <button @click="showAddModal = true" class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          Add Wallet
        </button>
      </div>

      <!-- Wallets Grid -->
      <div v-if="walletsStore.loading" class="card p-8">
        <LoadingSpinner fullHeight />
      </div>

      <div v-else-if="wallets.length === 0" class="card p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <WalletIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No wallets yet</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Create your first wallet to start tracking your finances
        </p>
        <button @click="showAddModal = true" class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          Add Wallet
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="wallet in wallets"
          :key="wallet.id"
          class="cursor-pointer"
          @click="goToWalletDetail(wallet.id)"
        >
          <WalletCard
            :wallet="wallet"
            :enable-actions="false"
          />
        </div>
      </div>
    </div>

    <!-- Add/Edit Wallet Modal -->
    <WalletModal
      v-model="showAddModal"
      :wallet="selectedWallet"
      @success="handleWalletSaved"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletsStore } from '@/stores/wallets';
import AppLayout from '@/components/layouts/AppLayout.vue';
import WalletModal from '@/components/WalletModal.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import WalletCard from '@/components/WalletCard.vue';
import type { Wallet } from '@/types';
import {
  Plus,
  Wallet as WalletIcon,
} from 'lucide-vue-next';

const walletsStore = useWalletsStore();
const router = useRouter();

const showAddModal = ref(false);
const selectedWallet = ref<Wallet | null>(null);

const wallets = computed(() => {
  return walletsStore.wallets
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
});

const handleWalletSaved = () => {
  showAddModal.value = false;
};

const goToWalletDetail = (walletId: string) => {
  router.push(`/wallet/${walletId}`);
};

watch(showAddModal, (isShowing) => {
  if (!isShowing) {
    selectedWallet.value = null;
  }
});

onMounted(() => {
  walletsStore.fetchWallets(true);
});
</script>
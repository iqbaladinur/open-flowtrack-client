<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue";
import { RefreshCw, X, Wifi } from "lucide-vue-next";

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="fixed bottom-[76px] lg:bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-md z-50 animate-slide-up"
    role="alert"
  >
    <div class="card p-4 shadow-lg bg-primary-50 dark:bg-gray-900">
      <!-- Header with icon and close button -->
      <div class="flex items-start gap-3 mb-3">
        <div
          class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          :class="
            needRefresh
              ? 'bg-primary-100 dark:bg-neon/20'
              : 'bg-success-100 dark:bg-success-900/30'
          "
        >
          <RefreshCw
            v-if="needRefresh"
            class="w-5 h-5 text-primary-600 dark:text-neon"
          />
          <Wifi v-else class="w-5 h-5 text-success-600 dark:text-success-400" />
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            <span v-if="offlineReady && !needRefresh">
              Ready to Work Offline
            </span>
            <span v-else> Update Available </span>
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <span v-if="offlineReady && !needRefresh">
              App is now ready to work offline
            </span>
            <span v-else>
              New content is available. Click reload to update.
            </span>
          </p>
        </div>

        <button
          @click="close"
          class="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <X class="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </button>
      </div>

      <!-- Action buttons -->
      <div v-if="needRefresh" class="flex gap-2">
        <button @click="updateServiceWorker()" class="btn btn-primary flex-1">
          <RefreshCw class="w-4 h-4 mr-2" />
          Reload
        </button>
        <button @click="close" class="btn btn-secondary">Later</button>
      </div>
    </div>
  </div>
</template>

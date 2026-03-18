<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div>
        <h1 class="text-xl lg:text-3xl font-bold text-sepia-900 dark:text-neon">{{ $t('profile.title') }}</h1>
        <p class="text-sm text-sepia-700 dark:text-gray-400 mt-1">
          {{ $t('profile.subtitle') }}
        </p>
      </div>

      <!-- Profile Card -->
      <div class="card overflow-hidden">
        <!-- Avatar banner -->
        <div class="h-24 bg-gradient-to-r from-sepia-200 to-sepia-300 dark:from-gray-800 dark:to-gray-700" />
        <!-- Avatar + name -->
        <div class="px-6 pb-6">
          <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div class="flex items-end gap-4 -mt-10">
              <div class="w-20 h-20 bg-sepia-100 dark:bg-gray-900 border-4 border-white dark:border-gray-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <User class="w-9 h-9 text-sepia-600 dark:text-primary-400" />
              </div>
              <div class="mb-1">
                <h2 class="text-lg font-semibold text-sepia-900 dark:text-white leading-tight">
                  {{ authStore.user?.full_name || $t('common.user') }}
                </h2>
                <p class="text-sm text-sepia-600 dark:text-gray-400">
                  {{ authStore.user?.email }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Info -->
      <div class="card p-6">
        <h3 class="text-sm font-semibold text-sepia-900 dark:text-neon mb-4 uppercase tracking-wide">
          {{ $t('profile.accountInfo') }}
        </h3>
        <div class="space-y-0 divide-y divide-sepia-100 dark:divide-gray-700">
          <div class="flex justify-between items-center py-3">
            <span class="text-sm text-sepia-600 dark:text-gray-400">{{ $t('profile.email') }}</span>
            <span class="text-sm font-medium text-sepia-900 dark:text-white">{{ authStore.user?.email }}</span>
          </div>
          <div class="flex justify-between items-center py-3">
            <span class="text-sm text-sepia-600 dark:text-gray-400">{{ $t('profile.memberSince') }}</span>
            <span class="text-sm font-medium text-sepia-900 dark:text-white">{{ formatDate(authStore.user?.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Session -->
      <div class="card p-6">
        <h3 class="text-sm font-semibold text-sepia-900 dark:text-neon mb-4 uppercase tracking-wide">
          {{ $t('profile.session') }}
        </h3>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-sepia-50 dark:bg-gray-800/50 border border-sepia-200 dark:border-gray-700">
          <div>
            <p class="text-sm font-medium text-sepia-900 dark:text-white">{{ $t('profile.loggedInAs') }}</p>
            <p class="text-xs text-sepia-500 dark:text-gray-400 mt-0.5">{{ authStore.user?.email }}</p>
          </div>
          <button
            @click="confirmLogout"
            class="btn-secondary flex items-center justify-center gap-2 sm:w-auto w-full"
          >
            <LogOut class="w-4 h-4" />
            {{ $t('profile.logout') }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import AppLayout from '@/components/layouts/AppLayout.vue';
import { User, LogOut } from 'lucide-vue-next';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const confirmLogout = () => {
  if (confirm(t('profile.logoutConfirm'))) {
    authStore.logout();
    router.push('/login');
  }
};
</script>

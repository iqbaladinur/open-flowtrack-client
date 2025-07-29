<template>
  <AppLayout>
    <div class="p-4 lg:p-8 space-y-6 mb-20 lg:mb-0">
      <!-- Header -->
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <!-- Profile Information -->
      <div class="card p-6">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <User class="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ authStore.user?.full_name || 'User' }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              {{ authStore.user?.email }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Member since {{ formatDate(authStore.user?.created_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card p-6 border-error-200 dark:border-error-800">
        <h3 class="text-lg font-semibold text-error-700 dark:text-error-300 mb-4">
          Danger Zone
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          This action is irreversible. Please be certain before proceeding.
        </p>
        
        <button
          @click="confirmLogout"
          class="btn-error mr-4"
        >
          <LogOut class="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppLayout from '@/components/layouts/AppLayout.vue';
import { User, LogOut } from 'lucide-vue-next';

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
  if (confirm('Are you sure you want to logout?')) {
    authStore.logout();
    router.push('/login');
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <LoadingSpinner size="lg" />
      <p class="mt-4 text-lg text-gray-700 dark:text-gray-300">
        Authenticating, please wait...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import type { User } from '@/types';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  const token = route.query.token as string;
  let user: User | null = null;

  try {
    const userQuery = route.query.user;
    if (typeof userQuery === 'string') {
      user = JSON.parse(userQuery);
    }
  } catch (e) {
    console.error('Failed to parse user data from URL:', e);
    router.push('/login?error=google_auth_failed');
    return;
  }

  if (token && user) {
    authStore.handleGoogleLogin(token, user);
    router.push('/dashboard');
  } else {
    console.error('Missing token or user data in Google auth callback');
    router.push('/login?error=google_auth_failed');
  }
});
</script>

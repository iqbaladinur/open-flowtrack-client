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
import { useCategoriesStore } from '@/stores/categories';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const categoriesStore = useCategoriesStore();

onMounted(async () => {
  const token = route.query.token as string;
  const refreshToken = route.query.refresh_token as string; 

  if (token && refreshToken) {
    await authStore.handleGoogleLogin(token, refreshToken);
    if (authStore.isAuthenticated) {
      await categoriesStore.fetchCategories(true); // Force refresh
      if (categoriesStore.categories.length === 0) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/login?error=google_auth_failed');
    }
  } else {
    console.error('Missing token in Google auth callback');
    router.push('/login?error=google_auth_failed');
  }
});
</script>

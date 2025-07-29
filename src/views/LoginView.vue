<template>
  <div class="min-h-[100dvh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 bg-green-600/30 rounded-2xl flex items-center justify-center mb-6">
          <TrendingUpDown class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sign in to your account to continue
        </p>
      </div>

      <div class="mt-8 space-y-6">
        <a :href="googleAuthUrl" class="w-full btn-secondary py-3 text-base flex items-center justify-center">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5 mr-2">
          Sign in with Google
        </a>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div class="relative flex justify-center text-sm">
            <button @click="showEmailForm = true" class="btn-link px-2 bg-gray-50 dark:bg-gray-900">
              Or sign in with email
            </button>
          </div>
        </div>

        <transition
          enter-active-class="transition-all duration-500 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <form v-if="showEmailForm" @submit.prevent="handleLogin" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label for="email" class="label">Email address</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="input"
                  placeholder="Enter your email"
                  :disabled="loading"
                />
              </div>
              
              <div>
                <label for="password" class="label">Password</label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  class="input"
                  placeholder="Enter your password"
                  :disabled="loading"
                />
              </div>
            </div>

            <div v-if="error" class="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
              <p class="text-sm text-error-700 dark:text-error-300">{{ error }}</p>
            </div>

            <button
              type="submit"
              class="w-full btn-primary py-3 text-base"
              :disabled="loading"
            >
              <LoadingSpinner v-if="loading" size="sm" />
              <span v-else>Sign in</span>
            </button>

            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?
                <router-link
                  to="/register"
                  class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Sign up
                </router-link>
              </p>
            </div>
          </form>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { TrendingUpDown } from 'lucide-vue-next';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref('');
const showEmailForm = ref(false);

const googleAuthUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  return `${baseUrl}/v1/auth/google`;
});

const handleLogin = async () => {
  if (loading.value) return;
  
  loading.value = true;
  error.value = '';

  try {
    const result = await authStore.login(form.email, form.password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      error.value = result.error || 'Login failed. Please try again.';
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}
.input {
  @apply appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white;
}
.btn-link {
  @apply text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none;
}
</style>

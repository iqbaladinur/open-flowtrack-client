<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-6">
          <DollarSign class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Create account</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Start managing your finances today
        </p>
      </div>

      <div class="mt-8 space-y-6">
        <a :href="googleAuthUrl" class="w-full btn-secondary py-3 text-base flex items-center justify-center">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5 mr-2">
          Sign up with Google
        </a>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">OR</span>
          </div>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div class="space-y-4">
            <div>
              <label for="fullName" class="label">Full name</label>
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                class="input"
                placeholder="Enter your full name"
                :disabled="loading"
              />
            </div>

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

            <div>
              <label for="confirmPassword" class="label">Confirm password</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="input"
                placeholder="Confirm your password"
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
            :disabled="loading || !isFormValid"
          >
            <LoadingSpinner v-if="loading" size="sm" />
            <span v-else>Create account</span>
          </button>

          <div class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?
              <router-link
                to="/login"
                class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign in
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { DollarSign } from 'lucide-vue-next';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const loading = ref(false);
const error = ref('');

const googleAuthUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  return `${baseUrl}/auth/google`;
});

const isFormValid = computed(() => {
  return form.email && 
         form.password && 
         form.confirmPassword && 
         form.password === form.confirmPassword &&
         form.password.length >= 6;
});

const handleRegister = async () => {
  if (loading.value || !isFormValid.value) return;
  
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match';
    return;
  }

  if (form.password.length < 6) {
    error.value = 'Password must be at least 6 characters long';
    return;
  }
  
  loading.value = true;
  error.value = '';

  try {
    const result = await authStore.register(
      form.email, 
      form.password, 
      form.fullName || undefined
    );
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      error.value = result.error || 'Registration failed. Please try again.';
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
</style>

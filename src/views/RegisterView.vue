<template>
  <div class="min-h-[100dvh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto w-8 h-8 bg-[#16a34a] rounded-lg flex items-center justify-center mb-6">
          <TrendingUp class="w-5 h-5 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-neon">{{ $t('register.title') }}</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ $t('register.subtitle') }}
        </p>
      </div>

      <div class="mt-8 space-y-6">
        <a :href="googleAuthUrl" class="w-full btn-secondary py-3 text-base flex items-center justify-center">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5 mr-2">
          {{ $t('register.signUpWithGoogle') }}
        </a>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div class="relative flex justify-center text-sm">
            <button @click="showEmailForm = true" class="btn-link px-2 bg-gray-50 dark:bg-gray-900">
              {{ $t('register.orSignUpWithEmail') }}
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
          <form v-if="showEmailForm" @submit.prevent="handleRegister" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label for="fullName" class="label">{{ $t('register.fullName') }}</label>
                <input
                  id="fullName"
                  v-model="form.fullName"
                  type="text"
                  class="input"
                  :placeholder="$t('register.enterFullName')"
                  :disabled="loading"
                />
              </div>

              <div>
                <label for="email" class="label">{{ $t('register.emailAddress') }}</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="input"
                  :placeholder="$t('register.enterEmail')"
                  :disabled="loading"
                />
              </div>
              
              <div>
                <label for="password" class="label">{{ $t('register.password') }}</label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  class="input"
                  :placeholder="$t('register.enterPassword')"
                  :disabled="loading"
                />
              </div>

              <div>
                <label for="confirmPassword" class="label">{{ $t('register.confirmPassword') }}</label>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  type="password"
                  required
                  class="input"
                  :placeholder="$t('register.confirmYourPassword')"
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
              <span v-else>{{ $t('register.createAccount') }}</span>
            </button>

            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('register.alreadyHaveAccount') }}
                <router-link
                  to="/login"
                  class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  {{ $t('register.signIn') }}
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
import { TrendingUp } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const loading = ref(false);
const error = ref('');
const showEmailForm = ref(false);

const googleAuthUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  return `${baseUrl}/v1/auth/google`;
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
    error.value = t('register.passwordsDoNotMatch');
    return;
  }
  
  if (form.password.length < 6) {
    error.value = t('register.passwordTooShort');
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
      router.push('/login');
    } else {
      error.value = result.error || t('register.registrationFailed');
    }
  } catch (err) {
    error.value = t('register.unexpectedError');
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

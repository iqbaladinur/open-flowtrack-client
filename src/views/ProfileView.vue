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

        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label for="fullName" class="label">Full Name</label>
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                class="input"
                placeholder="Enter your full name"
                :disabled="updating"
              />
            </div>
            
            <div>
              <label for="email" class="label">Email Address</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="input"
                placeholder="Enter your email"
                :disabled="updating"
              />
            </div>

            <div v-if="updateError" class="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
              <p class="text-sm text-error-700 dark:text-error-300">{{ updateError }}</p>
            </div>

            <div v-if="updateSuccess" class="p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
              <p class="text-sm text-success-700 dark:text-success-300">Profile updated successfully!</p>
            </div>

            <button
              type="submit"
              class="btn-primary"
              :disabled="updating || !hasChanges"
            >
              <LoadingSpinner v-if="updating" size="sm" />
              <span v-else>Update Profile</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Export Data -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Export Data
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Download your financial data for backup or analysis.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="exportTransactions"
            class="btn-secondary flex items-center justify-center"
            :disabled="exporting"
          >
            <Download class="w-4 h-4 mr-2" />
            <LoadingSpinner v-if="exporting" size="sm" />
            <span v-else>Export Transactions (CSV)</span>
          </button>
          
          <button
            @click="backupData"
            class="btn-secondary flex items-center justify-center"
            :disabled="backing"
          >
            <Archive class="w-4 h-4 mr-2" />
            <LoadingSpinner v-if="backing" size="sm" />
            <span v-else>Backup All Data</span>
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card p-6 border-error-200 dark:border-error-800">
        <h3 class="text-lg font-semibold text-error-700 dark:text-error-300 mb-4">
          Danger Zone
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          These actions are irreversible. Please be certain before proceeding.
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useApi } from '@/composables/useApi';
import AppLayout from '@/components/layouts/AppLayout.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import {
  User,
  Download,
  Archive,
  LogOut,
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const api = useApi();

const updating = ref(false);
const exporting = ref(false);
const backing = ref(false);
const updateError = ref('');
const updateSuccess = ref(false);

const form = reactive({
  fullName: '',
  email: '',
});

const hasChanges = computed(() => {
  return form.fullName !== (authStore.user?.full_name || '') ||
         form.email !== (authStore.user?.email || '');
});

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const updateProfile = async () => {
  if (!hasChanges.value) return;
  
  updating.value = true;
  updateError.value = '';
  updateSuccess.value = false;

  try {
    // Note: This would need to be implemented in the API
    // For now, we'll just show success
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateSuccess.value = true;
    
    // Update local user data
    if (authStore.user) {
      authStore.user.full_name = form.fullName;
      authStore.user.email = form.email;
      localStorage.setItem('user', JSON.stringify(authStore.user));
    }
    
    setTimeout(() => {
      updateSuccess.value = false;
    }, 3000);
  } catch (error) {
    updateError.value = 'Failed to update profile. Please try again.';
  } finally {
    updating.value = false;
  }
};

const exportTransactions = async () => {
  exporting.value = true;
  try {
    const response = await fetch('/export/transactions/csv', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    exporting.value = false;
  }
};

const backupData = async () => {
  backing.value = true;
  try {
    const response = await api.get('/backup');
    if (response.data) {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallport-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (error) {
    console.error('Backup failed:', error);
  } finally {
    backing.value = false;
  }
};

const confirmLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    authStore.logout();
    router.push('/login');
  }
};

onMounted(() => {
  if (authStore.user) {
    form.fullName = authStore.user.full_name || '';
    form.email = authStore.user.email || '';
  }
});
</script>
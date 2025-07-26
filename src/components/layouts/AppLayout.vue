<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Mobile Header -->
    <header class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 safe-area-top">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <DollarSign class="w-5 h-5 text-white" />
          </div>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Wallport</h1>
        </div>
        
        <button @click="showProfileMenu = !showProfileMenu" class="relative">
          <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <User class="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </div>
        </button>
      </div>

      <!-- Profile Menu -->
      <div v-if="showProfileMenu" class="absolute right-4 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
        <router-link to="/profile" @click="showProfileMenu = false" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <User class="w-4 h-4 mr-3" />
          Profile
        </router-link>
        <button @click="logout" class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <LogOut class="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </header>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:overflow-y-auto lg:bg-white lg:dark:bg-gray-800 lg:border-r lg:border-gray-200 lg:dark:border-gray-700">
      <div class="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <DollarSign class="w-5 h-5 text-white" />
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Wallport</h1>
        </div>
      </div>
      
      <nav class="flex-1 px-4 py-6 space-y-2">
        <router-link 
          v-for="item in navigation" 
          :key="item.name"
          :to="item.to"
          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="$route.name === item.name 
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>

      <div class="border-t border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <User class="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ authStore.user?.full_name || authStore.user?.email }}
            </p>
          </div>
        </div>
        <button @click="logout" class="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <LogOut class="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="lg:pl-64">
      <div class="pt-16 lg:pt-0">
        <slot />
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
      <div class="grid grid-cols-5">
        <router-link 
          v-for="item in bottomNavigation" 
          :key="item.name"
          :to="item.to"
          class="flex flex-col items-center justify-center py-2 transition-colors"
          :class="$route.name === item.name 
            ? 'text-primary-600 dark:text-primary-400' 
            : 'text-gray-500 dark:text-gray-400'"
        >
          <component :is="item.icon" class="w-5 h-5 my-1" />
          <!-- <span class="text-xs font-medium text-center">{{ item.name }}</span> -->
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { 
  DollarSign, 
  User, 
  LogOut, 
  Home, 
  ArrowUpDown, 
  Wallet, 
  Target, 
  Tag,
  BarChart3 
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const showProfileMenu = ref(false);

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: Home },
  { name: 'Transactions', to: '/transactions', icon: ArrowUpDown },
  { name: 'Wallets', to: '/wallets', icon: Wallet },
  { name: 'Categories', to: '/categories', icon: Tag },
  { name: 'Budgets', to: '/budgets', icon: Target },
  { name: 'Reports', to: '/reports', icon: BarChart3 },
];

const bottomNavigation = [
  { name: 'Dashboard', to: '/dashboard', icon: Home },
  { name: 'Transactions', to: '/transactions', icon: ArrowUpDown },
  { name: 'Wallets', to: '/wallets', icon: Wallet },
  { name: 'Categories', to: '/categories', icon: Tag },
  { name: 'Budgets', to: '/budgets', icon: Target },
  { name: 'Reports', to: '/reports', icon: BarChart3 },
];

const logout = () => {
  authStore.logout();
  router.push('/login');
};

const handleClickOutside = (event: Event) => {
  const target = event.target as Element;
  if (!target.closest('.relative')) {
    showProfileMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
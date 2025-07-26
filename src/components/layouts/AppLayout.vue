<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Mobile Header -->
    <header class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 safe-area-top">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <TrendingUpDown class="w-5 h-5 text-white" />
          </div>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">FlowTrack</h1>
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
      <div class="pt-16 pb-24 lg:pt-0 lg:pb-0">
        <slot />
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
      <div class="grid grid-cols-5">
        <router-link 
          v-for="item in mainBottomNav" 
          :key="item.name"
          :to="item.to"
          class="flex flex-col items-center justify-center text-center py-2 transition-colors"
          :class="$route.name === item.name 
            ? 'text-primary-600 dark:text-primary-400' 
            : 'text-gray-500 dark:text-gray-400'"
        >
          <component :is="item.icon" class="w-5 h-5 mb-1" />
          <span class="text-[10px] font-medium">{{ item.name }}</span>
        </router-link>
        <button 
          @click="showMoreMenu = true"
          class="flex flex-col items-center justify-center text-center py-2 transition-colors"
          :class="isMoreMenuActive
            ? 'text-primary-600 dark:text-primary-400' 
            : 'text-gray-500 dark:text-gray-400'"
        >
          <Ellipsis class="w-5 h-5 mb-1" />
          <span class="text-[10px] font-medium">More</span>
        </button>
      </div>
    </nav>

    <!-- More Menu Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="showMoreMenu" @click="showMoreMenu = false" class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"></div>
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        leave-active-class="transition-transform duration-300 ease-in"
        enter-from-class="translate-y-full"
        leave-to-class="translate-y-full"
      >
        <div v-if="showMoreMenu" class="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-area-bottom">
          <div class="bg-white dark:bg-gray-800 rounded-t-2xl p-4">
            <div class="grid grid-cols-4 gap-4">
                <router-link
                  v-for="item in moreMenuNav"
                  :key="item.name"
                  :to="item.to"
                  @click="showMoreMenu = false"
                  class="flex flex-col items-center justify-center text-center py-2 transition-colors"
                  :class="$route.name === item.name ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'"
                >
                  <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
                    <component :is="item.icon" class="w-6 h-6" />
                  </div>
                  <span class="text-[10px] font-medium">{{ item.name }}</span>
                </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
  BarChart3,
  Ellipsis,
  TrendingUpDown
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const showProfileMenu = ref(false);
const showMoreMenu = ref(false);

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: Home },
  { name: 'Transactions', to: '/transactions', icon: ArrowUpDown },
  { name: 'Wallets', to: '/wallets', icon: Wallet },
  { name: 'Categories', to: '/categories', icon: Tag },
  { name: 'Budgets', to: '/budgets', icon: Target },
  { name: 'Reports', to: '/reports', icon: BarChart3 },
];

const mainBottomNav = navigation.slice(0, 4);
const moreMenuNav = navigation.slice(4);

const isMoreMenuActive = computed(() => {
  return moreMenuNav.some(item => item.name === route.name);
});

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
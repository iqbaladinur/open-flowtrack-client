<template>
  <div class="min-h-screen bg-sepia-50 dark:bg-[#020617]">
    <!-- Mobile Header -->
    <header class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-sepia-50 dark:bg-[#020617] border-b border-sepia-300 dark:border-gray-800 safe-area-top">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-[#16a34a] rounded-lg flex items-center justify-center">
            <TrendingUp class="w-5 h-5 text-white" />
          </div>
          <h1 class="text-lg font-semibold text-sepia-900 dark:text-neon">FlowTrack</h1>
        </div>

        <button @click="showProfileMenu = !showProfileMenu" class="relative">
          <div class="w-8 h-8 bg-sepia-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <User class="w-4 h-4 text-sepia-700 dark:text-gray-300" />
          </div>
        </button>
      </div>

      <!-- Profile Menu -->
      <div v-if="showProfileMenu" class="absolute right-4 top-full mt-2 w-56 bg-sepia-50 dark:bg-gray-800 rounded-lg shadow-lg border border-sepia-300 dark:border-gray-700 py-2">
        <div class="px-4 py-2 border-b border-sepia-300 dark:border-gray-700">
          <p class="text-sm font-medium text-sepia-900 dark:text-white truncate">
            {{ authStore.user?.full_name || authStore.user?.email }}
          </p>
        </div>
        <div class="py-2">
          <router-link to="/profile" @click="showProfileMenu = false" class="flex items-center px-4 py-2 text-sm text-sepia-800 dark:text-gray-300 hover:bg-sepia-200 dark:hover:bg-gray-700">
            <User class="w-4 h-4 mr-3" />
            {{ $t('layout.profile') }}
          </router-link>
          <button @click="logout" class="w-full flex items-center px-4 py-2 text-sm text-sepia-800 dark:text-gray-300 hover:bg-sepia-200 dark:hover:bg-gray-700">
            <LogOut class="w-4 h-4 mr-3" />
            {{ $t('layout.logout') }}
          </button>
        </div>
        <div class="border-t border-sepia-300 dark:border-gray-700 pt-2 pb-1">
          <div class="flex items-center justify-between px-4 py-1">
            <p class="text-xs font-semibold text-sepia-600 dark:text-gray-400">{{ $t('layout.theme') }}</p>
            <div class="flex items-center gap-0.5 bg-sepia-200 dark:bg-gray-700 rounded-lg p-0.5">
              <button
                @click="themeStore.setTheme('light')"
                class="p-1.5 rounded transition-all"
                :class="themeStore.theme === 'light' ? 'bg-sepia-100 dark:bg-gray-600 shadow-sm' : 'hover:bg-sepia-300 dark:hover:bg-gray-600'"
                :title="'Light'"
              >
                <Sun class="w-3.5 h-3.5 text-sepia-800 dark:text-gray-300" />
              </button>
              <button
                @click="themeStore.setTheme('dark')"
                class="p-1.5 rounded transition-all"
                :class="themeStore.theme === 'dark' ? 'bg-sepia-100 dark:bg-gray-600 shadow-sm' : 'hover:bg-sepia-300 dark:hover:bg-gray-600'"
                :title="'Dark'"
              >
                <Moon class="w-3.5 h-3.5 text-sepia-800 dark:text-gray-300" />
              </button>
              <button
                @click="themeStore.setTheme('system')"
                class="p-1.5 rounded transition-all"
                :class="themeStore.theme === 'system' ? 'bg-sepia-100 dark:bg-gray-600 shadow-sm' : 'hover:bg-sepia-300 dark:hover:bg-gray-600'"
                :title="'System'"
              >
                <Laptop class="w-3.5 h-3.5 text-sepia-800 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Warning Banner -->
    <div v-if="showWarning" class="fixed top-16 lg:top-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-96 z-50 bg-amber-50 dark:bg-amber-900 border border-amber-300 dark:border-amber-700 rounded-lg shadow-lg p-4">
      <div class="flex items-start gap-3">
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
            {{ $t('warning.freeTierTitle') }}
          </h3>
          <p class="text-xs text-amber-800 dark:text-amber-300 mb-3">
            {{ $t('warning.freeTierMessage') }}
          </p>
          <a
            href="https://ftracks.my.id/#support"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-600 text-white text-xs font-medium rounded-md transition-colors"
          >
            {{ $t('warning.supportLink') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
        <button @click="dismissWarning" class="shrink-0 p-1 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-700 dark:text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out" :class="uiStore.isSidebarMinimized ? 'lg:w-20' : 'lg:w-64'">
      <button @click="uiStore.toggleSidebar" class="absolute top-6 -right-3 z-10 bg-sepia-50 dark:bg-gray-700 border border-sepia-300 dark:border-gray-600 rounded-full p-1 text-sepia-600 hover:text-sepia-900 dark:text-gray-400 dark:hover:text-white">
        <ChevronsLeft class="w-4 h-4 transition-transform duration-300" :class="uiStore.isSidebarMinimized && 'rotate-180'" />
      </button>
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-sepia-100 dark:bg-gray-800 border-r border-sepia-300 dark:border-gray-700 px-6">
        <div class="flex h-16 shrink-0 items-center" :class="uiStore.isSidebarMinimized && 'justify-center'">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-[#16a34a] rounded-lg flex items-center justify-center shrink-0">
              <TrendingUp class="w-5 h-5 text-white" />
            </div>
            <h1 v-show="!uiStore.isSidebarMinimized" class="text-xl font-bold text-sepia-800 dark:text-neon">FlowTrack</h1>
          </div>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name" :title="item.name">
                  <router-link :to="item.to" class="group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold" :class="[
                    $route.name?.toString()?.toLocaleLowerCase() === item.routeName?.toLocaleLowerCase() ? 'bg-sepia-200 dark:bg-gray-700 text-sepia-900 dark:text-neon' : 'text-sepia-800 dark:text-gray-400 dark:hover:text-white hover:bg-sepia-200 dark:hover:bg-gray-700',
                    uiStore.isSidebarMinimized && 'justify-center'
                  ]">
                    <component :is="item.icon" class="h-5 w-5 shrink-0" :class="[$route.name?.toString()?.toLocaleLowerCase() === item.routeName?.toLocaleLowerCase() ? 'fill-[#16a34a]/50 text-[#16a34a] dark:fill-none dark:text-inherit' : '']" />
                    <span v-show="!uiStore.isSidebarMinimized" class="truncate">{{ item.name }}</span>
                  </router-link>
                </li>
              </ul>
            </li>
            
            <li class="-mx-6 mt-auto">
              <div class="border-t border-sepia-300 dark:border-gray-700 py-3" :class="uiStore.isSidebarMinimized ? 'px-3' : 'px-6'">
                <div class="flex items-center gap-2" :class="uiStore.isSidebarMinimized ? 'flex-col' : 'justify-between'">
                  <p v-show="!uiStore.isSidebarMinimized" class="text-xs font-semibold text-sepia-600 dark:text-gray-400">{{ $t('layout.theme') }}</p>
                  <div class="flex items-center gap-0.5 bg-sepia-200 dark:bg-gray-700/50 rounded-lg p-0.5" :class="uiStore.isSidebarMinimized && 'flex-col'">
                    <button
                      @click="themeStore.setTheme('light')"
                      class="p-1.5 rounded transition-all"
                      :class="themeStore.theme === 'light' ? 'bg-sepia-100 dark:bg-gray-600 shadow' : 'hover:bg-sepia-300 dark:hover:bg-gray-600'"
                      :title="'Light'"
                    >
                      <Sun class="w-3.5 h-3.5 text-sepia-800 dark:text-gray-300" />
                    </button>
                    <button
                      @click="themeStore.setTheme('dark')"
                      class="p-1.5 rounded transition-all"
                      :class="themeStore.theme === 'dark' ? 'bg-sepia-100 dark:bg-gray-600 shadow' : 'hover:bg-sepia-300 dark:hover:bg-gray-600'"
                      :title="'Dark'"
                    >
                      <Moon class="w-3.5 h-3.5 text-sepia-800 dark:text-gray-300" />
                    </button>
                    <button
                      @click="themeStore.setTheme('system')"
                      class="p-1.5 rounded transition-all"
                      :class="themeStore.theme === 'system' ? 'bg-sepia-100 dark:bg-gray-600 shadow' : 'hover:bg-sepia-300 dark:hover:bg-gray-600'"
                      :title="'System'"
                    >
                      <Laptop class="w-3.5 h-3.5 text-sepia-800 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>
              <div
                class="flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-sepia-900 dark:text-white border-t border-sepia-300 dark:border-gray-700"
                :class="uiStore.isSidebarMinimized ? 'justify-center px-2 flex-col items-center' : 'px-6'">
                <div v-show="!uiStore.isSidebarMinimized" class="w-8 h-8 bg-sepia-300 dark:bg-gray-600 rounded-full flex items-center justify-center shrink-0">
                  <User class="w-4 h-4 text-sepia-700 dark:text-gray-300" />
                </div>
                <div v-show="!uiStore.isSidebarMinimized" class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-sepia-900 dark:text-white truncate">
                    {{ authStore.user?.full_name || authStore.user?.email }}
                  </p>
                </div>
                <button @click="logout" :class="{ '-mr-2': !uiStore.isSidebarMinimized }" class="p-2 rounded-full text-sepia-600 dark:text-white hover:bg-sepia-200 dark:hover:bg-gray-700 hover:text-sepia-700 dark:hover:text-gray-300 transition-colors">
                  <LogOut class="w-5 h-5" />
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="transition-all duration-300 ease-in-out" :class="uiStore.isSidebarMinimized ? 'lg:pl-20' : 'lg:pl-64'">
      <div class="pt-16 pb-24 lg:pt-0 lg:pb-0">
        <slot />
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-sepia-200 dark:bg-gray-800 border-t border-sepia-300 dark:border-gray-700 safe-area-bottom">
      <div class="grid grid-cols-5">
        <router-link
          v-for="item in mainBottomNav"
          :key="item.name"
          :to="item.to"
          class="flex flex-col items-center justify-center text-center py-2 transition-colors"
          :class="$route.name?.toString()?.toLowerCase() === item.routeName?.toLowerCase()
            ? 'text-sepia-900 dark:text-neon'
            : 'text-sepia-600 dark:text-gray-400'"
        >
          <component :is="item.icon" class="w-5 h-5 mb-1" :class="[$route.name?.toString()?.toLocaleLowerCase() === item.routeName?.toLocaleLowerCase() ? 'fill-[#16a34a]/50 text-[#16a34a] dark:fill-none dark:text-inherit' : '']" />
          <span class="text-[10px] font-medium">{{ item.name }}</span>
        </router-link>
        <button
          @click="showMoreMenu = true"
          class="flex flex-col items-center justify-center text-center py-2 transition-colors"
          :class="isMoreMenuActive
            ? 'text-sepia-900 dark:text-neon'
            : 'text-sepia-600 dark:text-gray-400'"
        >
          <Ellipsis class="w-5 h-5 mb-1" :class="[isMoreMenuActive ? 'fill-[#16a34a]/50 text-[#16a34a] dark:fill-none dark:text-inherit' : '']" />
          <span class="text-[10px] font-medium">{{ $t('nav.more') }}</span>
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
          <div class="bg-sepia-100 dark:bg-gray-800 rounded-t-2xl p-4">
            <div class="flex flex-col space-y-1">
                <router-link
                  v-for="item in moreMenuNav"
                  :key="item.name"
                  :to="item.to"
                  @click="showMoreMenu = false"
                  class="flex items-center gap-x-3 px-4 py-3 rounded-lg transition-colors"
                  :class="$route.name?.toString()?.toLowerCase() === item.routeName?.toLowerCase()
                    ? 'bg-sepia-200 dark:bg-gray-700 text-sepia-900 dark:text-neon'
                    : 'text-sepia-800 dark:text-gray-300 hover:bg-sepia-200 dark:hover:bg-gray-700'"
                >
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    :class="$route.name?.toString()?.toLowerCase() === item.routeName?.toLowerCase()
                      ? 'bg-sepia-200 dark:bg-gray-600'
                      : 'bg-sepia-200 dark:bg-gray-700'"
                  >
                    <component :is="item.icon" class="w-5 h-5" :class="[$route.name?.toString()?.toLocaleLowerCase() === item.routeName?.toLocaleLowerCase() ? 'fill-[#16a34a]/50 text-[#16a34a] dark:fill-none dark:text-inherit' : '']" />
                  </div>
                  <span class="text-sm font-medium">{{ item.name }}</span>
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
import { useThemeStore } from '@/stores/theme';
import { useUIStore } from '@/stores/ui';
import { useI18n } from 'vue-i18n';
import {
  User,
  LogOut,
  Home,
  Wallet,
  Tag,
  BarChart3,
  Ellipsis,
  Sun,
  Moon,
  Laptop,
  TrendingUpDown,
  TrendingUp,
  Database,
  Settings,
  ChevronsLeft,
  Flame,
  Goal
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const uiStore = useUIStore();
const { t } = useI18n();
const showProfileMenu = ref(false);
const showMoreMenu = ref(false);
const showWarning = ref(false);

const WARNING_STORAGE_KEY = 'warningDismissedAt';
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

const navigation = computed(() => [
  { name: t('nav.dashboard'), to: '/dashboard', icon: Home, routeName: 'Dashboard' },
  { name: t('nav.wallets'), to: '/wallets', icon: Wallet, routeName: 'Wallets' },
  { name: t('nav.transactions'), to: '/transactions', icon: TrendingUpDown, routeName: 'Transactions' },
  { name: t('nav.categories'), to: '/categories', icon: Tag, routeName: 'Categories' },
  { name: t('nav.budgets'), to: '/budgets', icon: Goal, routeName: 'Budgets' },
  { name: t('nav.milestones'), to: '/milestones', icon: Flame, routeName: 'Milestones' },
  { name: t('nav.reports'), to: '/reports', icon: BarChart3, routeName: 'Reports' },
  { name: t('nav.backup'), to: '/backup', icon: Database, routeName: 'Backup' },
  { name: t('nav.settings'), to: '/settings', icon: Settings, routeName: 'Settings' },
]);

const mainBottomNav = computed(() => navigation.value.slice(0, 4));
const moreMenuNav = computed(() => navigation.value.slice(4));

const isMoreMenuActive = computed(() => {
  return moreMenuNav.value.some(item => item.routeName?.toLowerCase() === route.name?.toString()?.toLowerCase());
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

const checkWarningVisibility = () => {
  const dismissedAt = localStorage.getItem(WARNING_STORAGE_KEY);

  if (!dismissedAt) {
    showWarning.value = true;
    return;
  }

  const dismissedTime = parseInt(dismissedAt, 10);
  const currentTime = Date.now();
  const timeDifference = currentTime - dismissedTime;

  if (timeDifference >= SEVEN_DAYS_IN_MS) {
    showWarning.value = true;
  }
};

const dismissWarning = () => {
  localStorage.setItem(WARNING_STORAGE_KEY, Date.now().toString());
  showWarning.value = false;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  checkWarningVisibility();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

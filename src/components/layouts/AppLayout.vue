<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#020617]">
    <!-- Mobile Header -->
    <header class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-[#020617] border-b border-gray-200 dark:border-gray-800 safe-area-top">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-[#16a34a] rounded-lg flex items-center justify-center">
            <TrendingUp class="w-5 h-5 text-white" />
          </div>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-neon">FlowTrack</h1>
        </div>
        
        <button @click="showProfileMenu = !showProfileMenu" class="relative">
          <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <User class="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </div>
        </button>
      </div>

      <!-- Profile Menu -->
      <div v-if="showProfileMenu" class="absolute right-4 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
        <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ authStore.user?.full_name || authStore.user?.email }}
          </p>
        </div>
        <div class="py-2">
          <router-link to="/profile" @click="showProfileMenu = false" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <User class="w-4 h-4 mr-3" />
            {{ $t('layout.profile') }}
          </router-link>
          <button @click="logout" class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <LogOut class="w-4 h-4 mr-3" />
            {{ $t('layout.logout') }}
          </button>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700 pt-2 pb-1">
          <div class="flex items-center justify-between px-4 py-1">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ $t('layout.theme') }}</p>
            <div class="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
              <button
                @click="themeStore.setTheme('light')"
                class="p-1.5 rounded transition-all"
                :class="themeStore.theme === 'light' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'"
                :title="'Light'"
              >
                <Sun class="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                @click="themeStore.setTheme('dark')"
                class="p-1.5 rounded transition-all"
                :class="themeStore.theme === 'dark' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'"
                :title="'Dark'"
              >
                <Moon class="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                @click="themeStore.setTheme('system')"
                class="p-1.5 rounded transition-all"
                :class="themeStore.theme === 'system' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'"
                :title="'System'"
              >
                <Laptop class="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out" :class="uiStore.isSidebarMinimized ? 'lg:w-20' : 'lg:w-64'">
      <button @click="uiStore.toggleSidebar" class="absolute top-6 -right-3 z-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <ChevronsLeft class="w-4 h-4 transition-transform duration-300" :class="uiStore.isSidebarMinimized && 'rotate-180'" />
      </button>
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-6">
        <div class="flex h-16 shrink-0 items-center" :class="uiStore.isSidebarMinimized && 'justify-center'">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-[#16a34a] rounded-lg flex items-center justify-center shrink-0">
              <TrendingUp class="w-5 h-5 text-white" />
            </div>
            <h1 v-show="!uiStore.isSidebarMinimized" class="text-xl font-bold text-slate-600 dark:text-neon">FlowTrack</h1>
          </div>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name" :title="item.name">
                  <router-link :to="item.to" class="group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold" :class="[
                    $route.name?.toString()?.toLocaleLowerCase() === item.routeName?.toLocaleLowerCase() ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-neon' : 'text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
                    uiStore.isSidebarMinimized && 'justify-center'
                  ]">
                    <component :is="item.icon" class="h-5 w-5 shrink-0" :class="[$route.name?.toString()?.toLocaleLowerCase() === item.routeName?.toLocaleLowerCase() ? 'fill-[#16a34a]/50 text-[#16a34a] dark:fill-none dark:text-inherit' : '']" />
                    <span v-show="!uiStore.isSidebarMinimized" class="truncate">{{ item.name }}</span>
                  </router-link>
                </li>
              </ul>
            </li>
            
            <li class="-mx-6 mt-auto">
              <div class="border-t border-gray-200 dark:border-gray-700 py-3" :class="uiStore.isSidebarMinimized ? 'px-3' : 'px-6'">
                <div class="flex items-center gap-2" :class="uiStore.isSidebarMinimized ? 'flex-col' : 'justify-between'">
                  <p v-show="!uiStore.isSidebarMinimized" class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ $t('layout.theme') }}</p>
                  <div class="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-0.5" :class="uiStore.isSidebarMinimized && 'flex-col'">
                    <button
                      @click="themeStore.setTheme('light')"
                      class="p-1.5 rounded transition-all"
                      :class="themeStore.theme === 'light' ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-600'"
                      :title="'Light'"
                    >
                      <Sun class="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      @click="themeStore.setTheme('dark')"
                      class="p-1.5 rounded transition-all"
                      :class="themeStore.theme === 'dark' ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-600'"
                      :title="'Dark'"
                    >
                      <Moon class="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      @click="themeStore.setTheme('system')"
                      class="p-1.5 rounded transition-all"
                      :class="themeStore.theme === 'system' ? 'bg-white dark:bg-gray-600 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-600'"
                      :title="'System'"
                    >
                      <Laptop class="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>
              <div
                class="flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700"
                :class="uiStore.isSidebarMinimized ? 'justify-center px-2 flex-col items-center' : 'px-6'">
                <div v-show="!uiStore.isSidebarMinimized" class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center shrink-0">
                  <User class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div v-show="!uiStore.isSidebarMinimized" class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ authStore.user?.full_name || authStore.user?.email }}
                  </p>
                </div>
                <button @click="logout" :class="{ '-mr-2': !uiStore.isSidebarMinimized }" class="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
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
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
      <div class="grid grid-cols-5">
        <router-link
          v-for="item in mainBottomNav"
          :key="item.name"
          :to="item.to"
          class="flex flex-col items-center justify-center text-center py-2 transition-colors"
          :class="$route.name?.toString()?.toLowerCase() === item.routeName?.toLowerCase()
            ? 'text-black dark:text-neon'
            : 'text-gray-500 dark:text-gray-400'"
        >
          <component :is="item.icon" class="w-5 h-5 mb-1" :class="[$route.name?.toString()?.toLocaleLowerCase() === item.routeName?.toLocaleLowerCase() ? 'fill-[#16a34a]/50 text-[#16a34a] dark:fill-none dark:text-inherit' : '']" />
          <span class="text-[10px] font-medium">{{ item.name }}</span>
        </router-link>
        <button
          @click="showMoreMenu = true"
          class="flex flex-col items-center justify-center text-center py-2 transition-colors"
          :class="isMoreMenuActive
            ? 'text-black dark:text-neon'
            : 'text-gray-500 dark:text-gray-400'"
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
          <div class="bg-white dark:bg-gray-800 rounded-t-2xl p-4">
            <div class="flex flex-col space-y-1">
                <router-link
                  v-for="item in moreMenuNav"
                  :key="item.name"
                  :to="item.to"
                  @click="showMoreMenu = false"
                  class="flex items-center gap-x-3 px-4 py-3 rounded-lg transition-colors"
                  :class="$route.name?.toString()?.toLowerCase() === item.routeName?.toLowerCase()
                    ? 'bg-slate-100 dark:bg-gray-700 text-black dark:text-neon'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
                >
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    :class="$route.name?.toString()?.toLowerCase() === item.routeName?.toLowerCase()
                      ? 'bg-gray-200 dark:bg-gray-600'
                      : 'bg-gray-200 dark:bg-gray-700'"
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
  Target,
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
  Flame
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const uiStore = useUIStore();
const { t } = useI18n();
const showProfileMenu = ref(false);
const showMoreMenu = ref(false);

const navigation = computed(() => [
  { name: t('nav.dashboard'), to: '/dashboard', icon: Home, routeName: 'Dashboard' },
  { name: t('nav.wallets'), to: '/wallets', icon: Wallet, routeName: 'Wallets' },
  { name: t('nav.transactions'), to: '/transactions', icon: TrendingUpDown, routeName: 'Transactions' },
  { name: t('nav.categories'), to: '/categories', icon: Tag, routeName: 'Categories' },
  { name: t('nav.budgets'), to: '/budgets', icon: Target, routeName: 'Budgets' },
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

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

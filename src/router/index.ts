import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useConfigStore } from '@/stores/config'
import nprogress from 'nprogress'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('@/views/AuthCallbackView.vue')
    },
    {
      path: '/wallets',
      name: 'wallets',
      component: () => import('@/views/WalletsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/wallet/:id',
      name: 'wallet-detail',
      component: () => import('@/views/WalletDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/CategoriesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/views/TransactionsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions/bulk-expense',
      name: 'bulk-expense',
      component: () => import('@/views/BulkExpenseView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: () => import('@/views/BudgetsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/ReportsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/backup',
      name: 'backup',
      component: () => import('@/views/BackupRestoreView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/views/OnboardingView.vue'),
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, _from, next) => {
  nprogress.start()
  const authStore = useAuthStore()
  const configStore = useConfigStore()

  // ensure auth store is initialized
  if (!authStore.isAuthenticated && localStorage.getItem('auth_token')) {
    authStore.loadUserFromStorage()
  }

  const isAuthenticated = authStore.isAuthenticated

  if (to.name === 'bulk-expense' && !configStore.isApiKeyAiExist) {
    nprogress.done();
    next({ name: _from.name });
    return false;
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

router.afterEach(() => {
  nprogress.done()
})

export default router;
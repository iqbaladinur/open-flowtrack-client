import { ref, computed } from 'vue'
import { useTransactionsStore } from '@/stores/transactions'
import { useWalletsStore } from '@/stores/wallets'
import { useMilestonesStore } from '@/stores/milestones'
import type { Transaction } from '@/types/transaction'

// ============================================================================
// Types
// ============================================================================

export interface MonthSummary {
  month: number // 1-12
  label: string
  income: number
  expense: number
  net: number
}

export interface CategorySummary {
  category_id: string
  name: string
  icon: string
  color: string
  total: number
  percentage: number
  count: number
}

export interface WrappedOverview {
  totalTransactions: number
  activeDays: number
  topWalletName: string
  topWalletIcon: string
}

export interface WrappedIncome {
  total: number
  peakMonth: string
  peakAmount: number
  byMonth: MonthSummary[]
}

export interface WrappedExpense {
  total: number
  savingRate: number
  busiestDayOfWeek: string
  busiestDayCount: number
}

export interface WrappedBiggestExpense {
  amount: number
  categoryName: string
  date: string
  note: string
}

export interface WrappedMilestones {
  achievedCount: number
  totalCount: number
  nearestName: string | null
  nearestProgress: number
}

export interface WrappedPersonality {
  label: string
  icon: string
  description: string
  traits: string[]
}

export interface WrappedData {
  period: { year: number; startDate: string; endDate: string }
  overview: WrappedOverview
  income: WrappedIncome
  expense: WrappedExpense
  topCategories: CategorySummary[]
  biggestExpense: WrappedBiggestExpense | null
  milestones: WrappedMilestones
  personality: WrappedPersonality
  monthly: MonthSummary[]
}

// ============================================================================
// Constants
// ============================================================================

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// ============================================================================
// Pure calculation helpers (easy to unit-test independently)
// ============================================================================

export function computeTopCategories(transactions: Transaction[]): CategorySummary[] {
  const expenseTxs = transactions.filter(t => t.type === 'expense')
  const totalExpense = expenseTxs.reduce((sum, t) => sum + t.amount, 0)

  const catMap: Record<string, { name: string; icon: string; color: string; total: number; count: number }> = {}

  expenseTxs.forEach(t => {
    if (!t.category_id) return
    if (!catMap[t.category_id]) {
      catMap[t.category_id] = {
        name: t.category?.name || 'Unknown',
        icon: t.category?.icon || '',
        color: t.category?.color || '#888',
        total: 0,
        count: 0,
      }
    }
    catMap[t.category_id].total += t.amount
    catMap[t.category_id].count += 1
  })

  return Object.entries(catMap)
    .map(([id, c]) => ({
      category_id: id,
      ...c,
      percentage: totalExpense > 0 ? (c.total / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
}

export function computeMonthly(transactions: Transaction[]): MonthSummary[] {
  const monthlyMap: Record<number, MonthSummary> = {}
  for (let m = 1; m <= 12; m++) {
    monthlyMap[m] = { month: m, label: MONTH_NAMES[m - 1], income: 0, expense: 0, net: 0 }
  }

  transactions.forEach(t => {
    const month = new Date(t.date).getMonth() + 1
    if (t.type === 'income') monthlyMap[month].income += t.amount
    if (t.type === 'expense') monthlyMap[month].expense += t.amount
  })

  return Object.values(monthlyMap).map(m => ({ ...m, net: m.income - m.expense }))
}

export function computeSavingRate(totalIncome: number, totalExpense: number): number {
  if (totalIncome <= 0) return 0
  return ((totalIncome - totalExpense) / totalIncome) * 100
}

export function computeBusiestDay(transactions: Transaction[]): { day: string; count: number } {
  const dayCount: Record<number, number> = {}
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const day = new Date(t.date).getDay()
      dayCount[day] = (dayCount[day] || 0) + 1
    })

  const top = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]
  return top ? { day: DAY_NAMES[parseInt(top[0])], count: top[1] } : { day: '-', count: 0 }
}

export function computePersonality(
  savingRate: number,
  totalTransactions: number,
): WrappedPersonality {
  const traits: string[] = []

  if (savingRate >= 30) traits.push('high-saver')
  else if (savingRate >= 15) traits.push('moderate-saver')
  else traits.push('spender')

  if (totalTransactions >= 200) traits.push('very-consistent')
  else if (totalTransactions >= 80) traits.push('consistent')
  else traits.push('casual')

  if (traits.includes('high-saver') && traits.includes('very-consistent')) {
    return {
      label: 'The Disciplined Saver',
      icon: '🦁',
      description: 'You are a master of financial discipline. You consistently save a large portion of your income and never miss recording a transaction.',
      traits,
    }
  }
  if (traits.includes('high-saver') || traits.includes('moderate-saver')) {
    if (traits.includes('very-consistent') || traits.includes('consistent')) {
      return {
        label: 'The Smart Planner',
        icon: '🦊',
        description: 'You plan ahead and track everything carefully. Your saving habits show great financial awareness.',
        traits,
      }
    }
    return {
      label: 'The Steady Saver',
      icon: '🐢',
      description: "You may not track every transaction, but your saving instincts are strong. Small improvements in tracking can go a long way.",
      traits,
    }
  }
  if (traits.includes('very-consistent') || traits.includes('consistent')) {
    return {
      label: 'The Meticulous Tracker',
      icon: '🔍',
      description: "You record almost every transaction. Your financial data is impeccable — now pair it with more saving!",
      traits,
    }
  }
  return {
    label: 'The Free Spirit',
    icon: '🌊',
    description: 'You live in the moment. Consider setting a few budgets to get more control over your finances.',
    traits,
  }
}

// ============================================================================
// Main composable
// ============================================================================

export function useWrappedData() {
  const transactionsStore = useTransactionsStore()
  const walletsStore = useWalletsStore()
  const milestonesStore = useMilestonesStore()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<WrappedData | null>(null)

  const compute = async (year: number) => {
    loading.value = true
    error.value = null
    data.value = null

    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`

    try {
      const [transactions] = await Promise.all([
        transactionsStore.fetchTransactions({ start_date: startDate, end_date: endDate }, true, true),
        walletsStore.fetchWallets(true, undefined, endDate),
        milestonesStore.fetchMilestones(),
      ])

      const txs = (transactions || []) as Transaction[]
      const expenseTxs = txs.filter(t => t.type === 'expense')
      const incomeTxs = txs.filter(t => t.type === 'income')
      const wallets = walletsStore.wallets
      const milestones = milestonesStore.milestones

      // --- Overview ---
      const activeDays = new Set(txs.map(t => t.date.split('T')[0])).size

      const walletTxCount: Record<string, number> = {}
      txs.forEach(t => {
        walletTxCount[t.wallet_id] = (walletTxCount[t.wallet_id] || 0) + 1
      })
      const topWalletId = Object.entries(walletTxCount).sort((a, b) => b[1] - a[1])[0]?.[0]
      const topWallet = wallets.find(w => w.id === topWalletId)

      // --- Income & Expense ---
      const totalIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0)
      const totalExpense = expenseTxs.reduce((sum, t) => sum + t.amount, 0)
      const savingRate = computeSavingRate(totalIncome, totalExpense)

      // --- Monthly ---
      const monthly = computeMonthly(txs)
      const peakMonth = monthly.reduce(
        (best, m) => (m.income > best.income ? m : best),
        monthly[0],
      )

      // --- Day of week ---
      const { day: busiestDay, count: busiestDayCount } = computeBusiestDay(txs)

      // --- Top Categories ---
      const topCategories = computeTopCategories(txs)

      // --- Biggest expense ---
      const biggestExpenseTx = expenseTxs.reduce<Transaction | null>(
        (max, t) => (max === null || t.amount > max.amount ? t : max),
        null,
      )

      // --- Milestones ---
      const achieved = milestones.filter(m => m.status === 'achieved')
      const inProgress = milestones.filter(m => m.status === 'in_progress')
      const nearest = [...inProgress].sort(
        (a, b) => (b.overall_progress || 0) - (a.overall_progress || 0),
      )[0]

      // --- Personality ---
      const personality = computePersonality(savingRate, txs.length)

      data.value = {
        period: { year, startDate, endDate },
        overview: {
          totalTransactions: txs.length,
          activeDays,
          topWalletName: topWallet?.name || '-',
          topWalletIcon: topWallet?.icon || 'wallet',
        },
        income: {
          total: totalIncome,
          peakMonth: peakMonth?.label || '-',
          peakAmount: peakMonth?.income || 0,
          byMonth: monthly,
        },
        expense: {
          total: totalExpense,
          savingRate,
          busiestDayOfWeek: busiestDay,
          busiestDayCount,
        },
        topCategories,
        biggestExpense: biggestExpenseTx
          ? {
              amount: biggestExpenseTx.amount,
              categoryName: biggestExpenseTx.category?.name || 'Unknown',
              date: biggestExpenseTx.date,
              note: biggestExpenseTx.note || '',
            }
          : null,
        milestones: {
          achievedCount: achieved.length,
          totalCount: milestones.length,
          nearestName: nearest?.name ?? null,
          nearestProgress: nearest?.overall_progress || 0,
        },
        personality,
        monthly,
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to compute wrapped data'
    } finally {
      loading.value = false
    }
  }

  return { loading, error, data, compute }
}

// ============================================================================
// Availability control — testable without touching date logic in production
// ============================================================================

export function useWrappedAvailability() {
  // In dev mode: always available
  // In prod: available in December (to recap the year) or January (previous year recap)
  // Override anytime with ?preview=true in the URL
  const isPreviewMode = computed(() => {
    if (import.meta.env.DEV) return true
    return new URLSearchParams(window.location.search).has('preview')
  })

  const currentMonth = new Date().getMonth() + 1 // 1-12
  const currentYear = new Date().getFullYear()

  const isAvailable = computed(() => {
    return isPreviewMode.value || currentMonth === 12 || currentMonth === 1
  })

  // In January recap the previous year, otherwise current year
  const defaultYear = computed(() => {
    return currentMonth === 1 ? currentYear - 1 : currentYear
  })

  return { isAvailable, isPreviewMode, defaultYear }
}

<template>
  <!-- Static, html2canvas-compatible render of any wrapped slide.
       Rules: no CSS animations, no space-y-* (CSS custom props), no blur filters. -->
  <div style="position:absolute;inset:0;overflow:hidden;">

    <!-- 0: Intro -->
    <div v-if="slideIndex === 0"
      style="position:absolute;inset:0;background:#0b0b18;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem;overflow:hidden;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:1.5rem;">
        <div style="width:5rem;height:5rem;border-radius:1rem;background:#22c55e;border:1px solid rgba(52,211,153,.4);display:flex;align-items:center;justify-content:center;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
          </svg>
        </div>
        <div>
          <p style="color:#34d399;font-size:.75rem;font-family:monospace;letter-spacing:.2em;text-transform:uppercase;margin-bottom:.5rem;">FlowTrack</p>
          <h1 style="font-size:2.5rem;font-weight:700;color:white;line-height:1.2;">
            Your {{ data.period.year }}<br/>
            <span style="color:#34d399;">Wrapped</span>
          </h1>
        </div>
        <p style="color:rgba(255,255,255,.5);font-size:.875rem;max-width:20rem;">A year of financial decisions, habits, and growth — all in one place.</p>
      </div>
    </div>

    <!-- 1: Overview -->
    <div v-else-if="slideIndex === 1"
      style="position:absolute;inset:0;background:linear-gradient(135deg,#0a0a2e,#0d0d3d);display:flex;flex-direction:column;justify-content:center;padding:2rem 5rem;overflow:hidden;">
      <div style="max-width:32rem;">
        <p style="color:#60a5fa;font-size:.75rem;font-family:monospace;letter-spacing:.2em;text-transform:uppercase;margin-bottom:2rem;">Year at a Glance</p>
        <div style="margin-bottom:2.5rem;">
          <p style="color:rgba(255,255,255,.4);font-size:.875rem;margin-bottom:.25rem;">You made</p>
          <div style="display:flex;align-items:flex-end;gap:.5rem;flex-wrap:wrap;">
            <span style="font-size:3.5rem;font-weight:700;color:white;font-variant-numeric:tabular-nums;">{{ data.overview.totalTransactions }}</span>
            <span style="font-size:1.25rem;color:rgba(255,255,255,.6);margin-bottom:.25rem;">transactions</span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
          <div>
            <p style="color:rgba(255,255,255,.4);font-size:.75rem;margin-bottom:.25rem;">Active days</p>
            <p style="font-size:1.5rem;font-weight:700;color:#93c5fd;">{{ data.overview.activeDays }}</p>
            <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-top:.25rem;">days you recorded</p>
          </div>
          <div>
            <p style="color:rgba(255,255,255,.4);font-size:.75rem;margin-bottom:.25rem;">Most used wallet</p>
            <p style="font-size:1.25rem;font-weight:700;color:#93c5fd;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ data.overview.topWalletName }}</p>
            <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-top:.25rem;">your go-to account</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 2: Income -->
    <div v-else-if="slideIndex === 2"
      style="position:absolute;inset:0;background:linear-gradient(135deg,#061a0e,#0a2918);display:flex;flex-direction:column;justify-content:center;padding:2rem 5rem;overflow:hidden;">
      <div style="max-width:32rem;">
        <p style="color:#34d399;font-size:.75rem;font-family:monospace;letter-spacing:.2em;text-transform:uppercase;margin-bottom:2rem;">Income</p>
        <p style="color:rgba(255,255,255,.4);font-size:.875rem;margin-bottom:.5rem;">This year, you earned</p>
        <p :class="amountSize(data.income.total)" style="font-weight:700;color:#34d399;line-height:1.1;margin-bottom:.5rem;font-variant-numeric:tabular-nums;word-break:break-all;">
          {{ config.formatCurrency(data.income.total) }}
        </p>
        <p style="color:rgba(255,255,255,.3);font-size:.875rem;margin-bottom:2.5rem;">total income in {{ data.period.year }}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
          <div>
            <p style="color:rgba(255,255,255,.4);font-size:.75rem;margin-bottom:.25rem;">Best month</p>
            <p style="font-size:1.5rem;font-weight:700;color:#6ee7b7;">{{ data.income.peakMonth }}</p>
            <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-top:.25rem;font-variant-numeric:tabular-nums;">{{ config.formatCurrency(data.income.peakAmount) }}</p>
          </div>
          <div>
            <p style="color:rgba(255,255,255,.4);font-size:.75rem;margin-bottom:.25rem;">Monthly avg</p>
            <p style="font-size:1.125rem;font-weight:700;color:#6ee7b7;font-variant-numeric:tabular-nums;word-break:break-all;">{{ config.formatCurrency(data.income.total / 12) }}</p>
            <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-top:.25rem;">per month</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 3: Expense -->
    <div v-else-if="slideIndex === 3"
      style="position:absolute;inset:0;background:linear-gradient(135deg,#1a0608,#2a0a0e);display:flex;flex-direction:column;justify-content:center;padding:2rem 5rem;overflow:hidden;">
      <div style="max-width:32rem;">
        <p style="color:#f87171;font-size:.75rem;font-family:monospace;letter-spacing:.2em;text-transform:uppercase;margin-bottom:2rem;">Spending</p>
        <p style="color:rgba(255,255,255,.4);font-size:.875rem;margin-bottom:.5rem;">And you spent</p>
        <p :class="amountSize(data.expense.total)" style="font-weight:700;color:#f87171;line-height:1.1;margin-bottom:.5rem;font-variant-numeric:tabular-nums;word-break:break-all;">
          {{ config.formatCurrency(data.expense.total) }}
        </p>
        <p style="color:rgba(255,255,255,.3);font-size:.875rem;margin-bottom:2.5rem;">in total expenses</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
          <div>
            <p style="color:rgba(255,255,255,.4);font-size:.75rem;margin-bottom:.5rem;">Saving rate</p>
            <p :class="savingRateColor" style="font-size:1.875rem;font-weight:700;font-variant-numeric:tabular-nums;margin-bottom:.25rem;">
              {{ data.expense.savingRate.toFixed(1) }}%
            </p>
            <div style="width:100%;background:rgba(255,255,255,.1);border-radius:9999px;height:6px;margin-top:.5rem;overflow:hidden;">
              <div :class="savingRateBarColor" :style="{ width: Math.max(0, Math.min(100, data.expense.savingRate)) + '%' }" style="height:100%;border-radius:9999px;"></div>
            </div>
            <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-top:.5rem;">{{ savingRateLabel }}</p>
          </div>
          <div>
            <p style="color:rgba(255,255,255,.4);font-size:.75rem;margin-bottom:.25rem;">Most expenses on</p>
            <p style="font-size:1.25rem;font-weight:700;color:#fdba74;">{{ data.expense.busiestDayOfWeek }}</p>
            <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-top:.25rem;">{{ data.expense.busiestDayCount }} transactions</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 4: Top Categories -->
    <div v-else-if="slideIndex === 4"
      style="position:absolute;inset:0;background:linear-gradient(135deg,#0a0620,#130a30);display:flex;flex-direction:column;justify-content:center;padding:2rem 5rem;overflow:hidden;">
      <div style="max-width:32rem;width:100%;">
        <p style="color:#c084fc;font-size:.75rem;font-family:monospace;letter-spacing:.2em;text-transform:uppercase;margin-bottom:2rem;">Top Categories</p>
        <p style="color:rgba(255,255,255,.4);font-size:.875rem;margin-bottom:1.5rem;">Where your money went most</p>
        <div>
          <div
            v-for="(cat, i) in data.topCategories"
            :key="cat.category_id"
            :style="{ marginTop: i > 0 ? '1.25rem' : '0' }"
          >
            <div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.375rem;">
              <div style="display:flex;align-items:center;gap:.5rem;min-width:0;">
                <span style="color:rgba(255,255,255,.3);font-size:.75rem;width:1rem;flex-shrink:0;">{{ i + 1 }}</span>
                <span style="color:white;font-size:.875rem;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ cat.name }}</span>
              </div>
              <div style="display:flex;align-items:center;gap:.5rem;flex-shrink:0;">
                <span style="color:rgba(255,255,255,.4);font-size:.75rem;">{{ cat.count }}x</span>
                <span style="color:white;font-size:.75rem;font-weight:600;font-variant-numeric:tabular-nums;">{{ config.formatCurrency(cat.total) }}</span>
              </div>
            </div>
            <div style="width:100%;background:rgba(255,255,255,.1);border-radius:9999px;height:6px;overflow:hidden;">
              <div :style="{ width: cat.percentage + '%', background: cat.color }" style="height:100%;border-radius:9999px;"></div>
            </div>
            <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-top:.25rem;">{{ cat.percentage.toFixed(1) }}% of total spending</p>
          </div>
          <p v-if="data.topCategories.length === 0" style="color:rgba(255,255,255,.4);font-size:.875rem;font-style:italic;">No expense categories found.</p>
        </div>
      </div>
    </div>

    <!-- 5: Biggest Expense -->
    <div v-else-if="slideIndex === 5"
      style="position:absolute;inset:0;background:linear-gradient(135deg,#1a0f00,#2a1800);display:flex;flex-direction:column;justify-content:center;padding:2rem 5rem;overflow:hidden;">
      <div style="max-width:32rem;">
        <p style="color:#fbbf24;font-size:.75rem;font-family:monospace;letter-spacing:.2em;text-transform:uppercase;margin-bottom:2rem;">Biggest Move</p>
        <template v-if="data.biggestExpense">
          <p style="color:rgba(255,255,255,.4);font-size:.875rem;margin-bottom:.5rem;">Your single biggest expense was</p>
          <p :class="amountSize(data.biggestExpense.amount)" style="font-weight:700;color:#fbbf24;line-height:1;margin-bottom:2rem;font-variant-numeric:tabular-nums;">
            {{ config.formatCurrency(data.biggestExpense.amount) }}
          </p>
          <div style="display:flex;gap:2rem;margin-bottom:1rem;">
            <div>
              <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-bottom:.25rem;">Category</p>
              <p style="color:white;font-size:1rem;font-weight:500;">{{ data.biggestExpense.categoryName }}</p>
            </div>
            <div>
              <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-bottom:.25rem;">Date</p>
              <p style="color:white;font-size:1rem;font-weight:500;">{{ biggestExpenseDate }}</p>
            </div>
          </div>
          <div v-if="data.biggestExpense.note">
            <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-bottom:.25rem;">Note</p>
            <p style="color:rgba(255,255,255,.8);font-size:.875rem;font-style:italic;">"{{ data.biggestExpense.note }}"</p>
          </div>
        </template>
        <template v-else>
          <p style="color:rgba(255,255,255,.4);font-size:1.125rem;">No expenses recorded this year.</p>
        </template>
      </div>
    </div>

    <!-- 6: Monthly -->
    <div v-else-if="slideIndex === 6"
      style="position:absolute;inset:0;background:linear-gradient(135deg,#001a1f,#002a30);display:flex;flex-direction:column;justify-content:center;padding:2rem 5rem;overflow:hidden;">
      <div style="max-width:32rem;width:100%;">
        <p style="color:#2dd4bf;font-size:.75rem;font-family:monospace;letter-spacing:.2em;text-transform:uppercase;margin-bottom:1.5rem;">Month by Month</p>
        <div style="display:flex;gap:1rem;margin-bottom:2rem;">
          <div style="min-width:0;flex:1;">
            <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-bottom:.25rem;">Best month</p>
            <p style="font-size:1.125rem;font-weight:700;color:#5eead4;">{{ bestMonth.label }}</p>
            <p style="color:rgba(255,255,255,.4);font-size:.75rem;font-variant-numeric:tabular-nums;overflow:hidden;text-overflow:ellipsis;">+{{ config.formatCurrency(bestMonth.net) }}</p>
          </div>
          <div v-if="worstMonth.net < 0" style="min-width:0;flex:1;">
            <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-bottom:.25rem;">Toughest month</p>
            <p style="font-size:1.125rem;font-weight:700;color:#f87171;">{{ worstMonth.label }}</p>
            <p style="color:rgba(255,255,255,.4);font-size:.75rem;font-variant-numeric:tabular-nums;">{{ config.formatCurrency(worstMonth.net) }}</p>
          </div>
        </div>
        <!-- Bar chart -->
        <div style="display:flex;align-items:flex-end;gap:6px;height:7rem;width:100%;">
          <div
            v-for="m in data.monthly"
            :key="m.month"
            style="flex:1;display:flex;flex-direction:column;align-items:center;gap:.25rem;"
          >
            <div style="width:100%;display:flex;flex-direction:column;justify-content:flex-end;height:88px;">
              <div
                :style="{
                  height: monthBarHeight(m.net) + 'px',
                  background: m.net >= 0 ? 'rgba(20,184,166,.8)' : 'rgba(239,68,68,.8)',
                  minHeight: '2px',
                }"
                style="width:100%;border-radius:2px;"
              ></div>
            </div>
            <span style="color:rgba(255,255,255,.3);font-family:monospace;font-size:9px;line-height:1;">{{ m.label.slice(0, 1) }}</span>
          </div>
        </div>
        <div style="display:flex;gap:1rem;margin-top:1rem;">
          <div style="display:flex;align-items:center;gap:.375rem;">
            <div style="width:.5rem;height:.5rem;border-radius:2px;background:#14b8a6;"></div>
            <span style="color:rgba(255,255,255,.3);font-size:.75rem;">Positive</span>
          </div>
          <div style="display:flex;align-items:center;gap:.375rem;">
            <div style="width:.5rem;height:.5rem;border-radius:2px;background:#ef4444;"></div>
            <span style="color:rgba(255,255,255,.3);font-size:.75rem;">Negative</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 7: Milestones -->
    <div v-else-if="slideIndex === 7"
      style="position:absolute;inset:0;background:linear-gradient(135deg,#1a1200,#2a1e00);display:flex;flex-direction:column;justify-content:center;padding:2rem 5rem;overflow:hidden;">
      <div style="max-width:32rem;">
        <p style="color:#facc15;font-size:.75rem;font-family:monospace;letter-spacing:.2em;text-transform:uppercase;margin-bottom:2rem;">Milestones</p>
        <div style="display:flex;align-items:center;gap:1.25rem;margin-bottom:2.5rem;">
          <div style="font-size:3.75rem;">🏆</div>
          <div>
            <p style="color:rgba(255,255,255,.4);font-size:.875rem;margin-bottom:.25rem;">You achieved</p>
            <p style="font-size:3rem;font-weight:700;color:#facc15;line-height:1;">
              {{ data.milestones.achievedCount }}
              <span style="font-size:1.5rem;color:rgba(255,255,255,.4);">/ {{ data.milestones.totalCount }}</span>
            </p>
            <p style="color:rgba(255,255,255,.3);font-size:.875rem;">milestones completed</p>
          </div>
        </div>
        <div v-if="data.milestones.totalCount > 0" style="margin-bottom:2rem;">
          <div style="display:flex;justify-content:space-between;font-size:.75rem;color:rgba(255,255,255,.3);margin-bottom:.25rem;">
            <span>Completion rate</span><span>{{ completionRate.toFixed(0) }}%</span>
          </div>
          <div style="width:100%;background:rgba(255,255,255,.1);border-radius:9999px;height:8px;overflow:hidden;">
            <div :style="{ width: completionRate + '%' }" style="height:100%;background:#eab308;border-radius:9999px;"></div>
          </div>
        </div>
        <div v-if="data.milestones.nearestName">
          <p style="color:rgba(255,255,255,.3);font-size:.75rem;margin-bottom:.5rem;">Almost there →</p>
          <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:.75rem;padding:1rem;">
            <p style="color:white;font-weight:500;margin-bottom:.5rem;">{{ data.milestones.nearestName }}</p>
            <div style="display:flex;justify-content:space-between;font-size:.75rem;color:rgba(255,255,255,.4);margin-bottom:.25rem;">
              <span>Progress</span><span>{{ data.milestones.nearestProgress.toFixed(0) }}%</span>
            </div>
            <div style="width:100%;background:rgba(255,255,255,.1);border-radius:9999px;height:6px;overflow:hidden;">
              <div :style="{ width: data.milestones.nearestProgress + '%' }" style="height:100%;background:#facc15;border-radius:9999px;"></div>
            </div>
          </div>
        </div>
        <p v-else-if="data.milestones.totalCount === 0" style="color:rgba(255,255,255,.3);font-size:.875rem;font-style:italic;">No milestones set yet. Create your first goal!</p>
      </div>
    </div>

    <!-- 8: Personality -->
    <div v-else-if="slideIndex === 8"
      :style="{ position: 'absolute', inset: '0', background: personalityBg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 5rem', overflow: 'hidden' }">
      <div style="max-width:32rem;">
        <p style="color:rgba(255,255,255,.4);font-size:.75rem;font-family:monospace;letter-spacing:.2em;text-transform:uppercase;margin-bottom:2rem;">You are...</p>
        <div style="font-size:5rem;margin-bottom:1.5rem;">{{ data.personality.icon }}</div>
        <h2 style="font-size:2.5rem;font-weight:700;color:white;line-height:1.2;margin-bottom:1rem;">{{ data.personality.label }}</h2>
        <p style="color:rgba(255,255,255,.6);font-size:1rem;line-height:1.6;margin-bottom:2rem;">{{ data.personality.description }}</p>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:2.5rem;">
          <span
            v-for="trait in data.personality.traits"
            :key="trait"
            style="font-size:.75rem;padding:.25rem .75rem;border-radius:9999px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.6);font-family:monospace;border:1px solid rgba(255,255,255,.1);"
          >{{ trait }}</span>
        </div>
        <p style="color:rgba(255,255,255,.2);font-size:.75rem;">FlowTrack · {{ data.period.year }} Financial Wrapped</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WrappedData, MonthSummary } from '@/composables/useWrappedData'

const props = defineProps<{
  data: WrappedData
  config: any
  slideIndex: number
}>()

function amountSize(amount: number): string {
  const len = props.config.formatCurrency(amount).length
  if (len > 18) return 'text-xl'
  if (len > 15) return 'text-2xl'
  if (len > 12) return 'text-3xl'
  if (len > 9)  return 'text-4xl'
  return 'text-5xl'
}

const savingRateColor = computed(() => {
  const r = props.data.expense.savingRate
  return r >= 30 ? 'text-emerald-400' : r >= 15 ? 'text-yellow-400' : 'text-red-400'
})

const savingRateBarColor = computed(() => {
  const r = props.data.expense.savingRate
  return r >= 30 ? 'bg-emerald-500' : r >= 15 ? 'bg-yellow-500' : 'bg-red-500'
})

const savingRateLabel = computed(() => {
  const r = props.data.expense.savingRate
  if (r >= 30) return 'Great job!'
  if (r >= 15) return 'Decent, keep it up'
  if (r >= 0)  return 'Room to improve'
  return 'Spent more than earned'
})

const biggestExpenseDate = computed(() => {
  if (!props.data.biggestExpense) return ''
  return new Date(props.data.biggestExpense.date).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
})

const maxAbsNet = computed(() => Math.max(...props.data.monthly.map(m => Math.abs(m.net)), 1))

function monthBarHeight(net: number): number {
  return Math.max(2, (Math.abs(net) / maxAbsNet.value) * 80)
}

const bestMonth = computed(() =>
  props.data.monthly.reduce(
    (best: MonthSummary, m: MonthSummary) => (m.net > best.net ? m : best),
    props.data.monthly[0],
  ),
)

const worstMonth = computed(() =>
  props.data.monthly.reduce(
    (worst: MonthSummary, m: MonthSummary) => (m.net < worst.net ? m : worst),
    props.data.monthly[0],
  ),
)

const completionRate = computed(() => {
  if (props.data.milestones.totalCount === 0) return 0
  return (props.data.milestones.achievedCount / props.data.milestones.totalCount) * 100
})

const personalityBg = computed(() => {
  const label = props.data.personality.label
  if (label.includes('Disciplined')) return 'linear-gradient(135deg,#0a1f0a,#0d3020)'
  if (label.includes('Smart'))       return 'linear-gradient(135deg,#0a0f1f,#0d1a35)'
  if (label.includes('Steady'))      return 'linear-gradient(135deg,#0f0a1f,#1a0d35)'
  if (label.includes('Meticulous'))  return 'linear-gradient(135deg,#001a1a,#002828)'
  return 'linear-gradient(135deg,#1a0a0f,#2a0a18)'
})
</script>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import type { Config } from '@/types/config'

export const popularCurrencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'GBP', name: 'British Pound Sterling' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' }
]

export const useConfigStore = defineStore('config', () => {
  const config = ref<Config | null>(null)
  const loading = ref(false)
  const api = useApi()

  // --- API-based state ---
  const currency = computed(() => config.value?.currency || 'USD')
  const fractions = computed(() => config.value?.fractions || 2)
  const gemini_api_key = computed(() => config.value?.gemini_api_key || '')

  // --- LocalStorage-based state ---
  const firstDayOfMonth = ref(1)
  const includeHiddenWalletsInCalculation = ref(false)
  const isApiKeyAiExist = computed(() => {
    return !!gemini_api_key.value
  })

  const setConfig = (newConfig: Config) => {
    config.value = newConfig
    localStorage.setItem('config', JSON.stringify(newConfig))
  }

  const loadConfigFromStorage = () => {
    const configData = localStorage.getItem('config')
    if (configData) {
      try {
        config.value = JSON.parse(configData)
      } catch (error) {
        console.error('Failed to parse config data:', error)
        localStorage.removeItem('config')
      }
    }

    const savedDay = localStorage.getItem('firstDayOfMonth')
    firstDayOfMonth.value = savedDay ? parseInt(savedDay, 10) : 1

    const savedIncludeHidden = localStorage.getItem('includeHiddenWalletsInCalculation')
    includeHiddenWalletsInCalculation.value = savedIncludeHidden
      ? JSON.parse(savedIncludeHidden)
      : false
  }

  const fetchConfig = async () => {
    loading.value = true
    try {
      const response = await api.get<Config>('/config')
      if (response.data) {
        setConfig(response.data)
      }
    } finally {
      loading.value = false
    }
  }

  const updateConfig = async (data: {
    currency?: string
    fractions?: number
    gemini_api_key?: string
  }) => {
    loading.value = true
    try {
      const response = await api.put<Config>('/config', data)
      if (response.data) {
        setConfig(response.data)
        return { success: true }
      }
      return { success: false, error: response.error }
    } catch (error) {
      return { success: false, error: 'Failed to update config' }
    } finally {
      loading.value = false
    }
  }

  const updateFirstDayOfMonth = (day: number) => {
    if (day >= 1 && day <= 28) {
      firstDayOfMonth.value = day
      localStorage.setItem('firstDayOfMonth', day.toString())
    }
  }

  const updateIncludeHiddenWalletsInCalculation = (value: boolean) => {
    includeHiddenWalletsInCalculation.value = value
    localStorage.setItem('includeHiddenWalletsInCalculation', JSON.stringify(value))
  }

  const formatCurrency = (amount: number) => {
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency.value,
      minimumFractionDigits: fractions.value,
      maximumFractionDigits: fractions.value
    }

    // The 'id-ID' locale is better for formatting IDR without decimals by default if fractions is 0
    const locale = currency.value === 'IDR' ? 'id-ID' : 'en-US'

    return new Intl.NumberFormat(locale, options).format(amount)
  }

  // Initialize from storage on store creation
  loadConfigFromStorage()

  return {
    config,
    loading,
    currency,
    fractions,
    gemini_api_key,
    firstDayOfMonth,
    includeHiddenWalletsInCalculation,
    isApiKeyAiExist,
    setConfig,
    loadConfigFromStorage,
    fetchConfig,
    updateConfig,
    updateFirstDayOfMonth,
    updateIncludeHiddenWalletsInCalculation,
    formatCurrency
  }
})

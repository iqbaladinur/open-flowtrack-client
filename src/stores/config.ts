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

  const currency = computed(() => config.value?.currency || 'USD')
  const fractions = computed(() => config.value?.fractions || 2)

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

  const updateConfig = async (data: { currency?: string; fractions?: number }) => {
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

  return {
    config,
    loading,
    currency,
    fractions,
    setConfig,
    loadConfigFromStorage,
    fetchConfig,
    updateConfig,
    formatCurrency
  }
})

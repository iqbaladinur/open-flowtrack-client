<template>
  <div class="relative inline-block">
    <span
      class="absolute left-0 top-1/2 transform -translate-y-1/2 text-xl text-gray-400 dark:text-gray-500 px-1 rounded-md dark:bg-gray-700/90 bg-gray-200/90"
    >
      {{ configStore.currency }}
    </span>
    <input
      :id="elId"
      type="text"
      v-model="displayValue"
      inputmode="decimal"
      class="w-full bg-transparent text-right text-4xl font-bold pl-14 pr-4 py-4 focus:ring-0 border-none outline-none"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      autofocus
      autocomplete="off"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'

const props = defineProps<{
  modelValue: number | null;
  disabled: boolean;
  required: boolean;
  placeholder: string;
  elId: string;
}>()

const emit = defineEmits(['update:modelValue'])

const configStore = useConfigStore()

const displayValue = computed({
  get: () => {
    if (props.modelValue === null || props.modelValue === undefined) {
      return ''
    }
    // Format the number without the currency symbol for better editing experience
    const options: Intl.NumberFormatOptions = {
      style: 'decimal',
      minimumFractionDigits: configStore.fractions,
      maximumFractionDigits: configStore.fractions
    }
    const locale = configStore.currency === 'IDR' ? 'id-ID' : 'en-US'
    return new Intl.NumberFormat(locale, options).format(props.modelValue)
  },
  set: (value) => {
    // Remove all non-digit characters to get a clean string of numbers
    const digits = value.replace(/\D/g, '')
    if (digits === '') {
      emit('update:modelValue', null)
      return
    }

    // Convert the string of digits to a numeric value, respecting the fraction digits
    const numberValue = parseInt(digits, 10) / Math.pow(10, configStore.fractions)
    emit('update:modelValue', numberValue)
  }
})
</script>

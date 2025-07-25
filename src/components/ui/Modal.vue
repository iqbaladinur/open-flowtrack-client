<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="closeOnOutsideClick && $emit('update:modelValue', false)"
      >
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            aria-hidden="true"
          ></div>

          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="modelValue"
              class="relative w-full max-w-md transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all"
              @click.stop
            >
              <div class="px-6 py-4">
                <div class="flex items-center justify-between mb-4">
                  <h3 
                    v-if="title"
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    {{ title }}
                  </h3>
                  <button
                    @click="$emit('update:modelValue', false)"
                    class="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X class="w-5 h-5" />
                  </button>
                </div>
                
                <slot />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

interface Props {
  modelValue: boolean;
  title?: string;
  closeOnOutsideClick?: boolean;
}

withDefaults(defineProps<Props>(), {
  closeOnOutsideClick: true,
});

defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>
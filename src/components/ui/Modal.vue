<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 bg-black/50"
        @click="closeOnOutsideClick && $emit('update:modelValue', false)"
        aria-hidden="true"
      />
    </Transition>
  </Teleport>

  <!-- Panel -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-transform duration-200 ease-out"
      enter-from-class="translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
      enter-to-class="translate-y-0 sm:scale-100 sm:opacity-100"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0 sm:scale-100 sm:opacity-100"
      leave-to-class="translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[51] flex items-end sm:items-center sm:justify-center pointer-events-none"
      >
        <div
          class="w-full max-h-[90vh] transform rounded-t-2xl bg-sepia-50 dark:bg-gray-800 shadow-xl sm:my-8 sm:max-w-lg sm:rounded-xl pointer-events-auto"
          @click.stop
        >
          <div class="flex flex-col h-full relative">
            <div class="px-6 py-4 flex-shrink-0">
              <div class="flex items-center justify-between">
                <h3
                  v-if="title"
                  class="text-lg font-semibold text-sepia-900 dark:text-white"
                >
                  {{ title }}
                </h3>
                <button
                  @click="$emit('update:modelValue', false)"
                  class="rounded-lg p-1 text-sepia-600 hover:text-sepia-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="px-6 overflow-y-auto flex-1 max-h-[80vh]" :class="{ 'pb-[100px]': !!$slots.footer, 'pb-6': !$slots.footer }">
              <slot />
            </div>

            <div v-if="$slots.footer" class="px-6 py-4 border-t border-sepia-300 dark:border-gray-700 flex-shrink-0 absolute bottom-0 w-full bg-sepia-50 dark:bg-gray-800 rounded-b-xl">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { watch } from 'vue';

interface Props {
  modelValue: boolean;
  title?: string;
  closeOnOutsideClick?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closeOnOutsideClick: true,
});

const body = document.body;

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = 'auto';
  }
});

defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>

<template>
  <Teleport to="body">
    <div
      v-show="modelValue"
      class="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center"
      @click="closeOnOutsideClick && $emit('update:modelValue', false)"
    >
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true"></div>

      <Transition
        enter-active-class="transition-transform duration-200 ease-out"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div
          v-if="modelValue"
          class="w-full max-h-[90vh] transform rounded-t-2xl bg-white dark:bg-gray-800 shadow-xl transition-all sm:my-8 sm:max-w-md sm:rounded-xl"
          @click.stop
        >
          <div class="flex flex-col h-full relative">
            <div class="px-6 py-4 flex-shrink-0">
              <div class="flex items-center justify-between">
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
            </div>
            
            <div class="px-6 overflow-y-auto flex-1 max-h-[80vh]" :class="{ 'pb-[100px]': !!$slots.footer, 'pb-6': !$slots.footer }">
              <slot />
            </div>

            <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 absolute bottom-0 w-full bg-white dark:bg-gray-800 rounded-b-xl">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </Transition>
    </div>
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

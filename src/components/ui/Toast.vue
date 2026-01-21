<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm"
          :class="toastClass(toast.type)"
        >
          <component :is="getIcon(toast.type)" class="w-5 h-5 flex-shrink-0" />
          <p class="text-sm font-medium flex-1">{{ toast.message }}</p>
          <button
            @click="remove(toast.id)"
            class="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast, type ToastType } from '@/composables/useToast';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next';
import type { Component } from 'vue';

const { toasts, remove } = useToast();

const getIcon = (type: ToastType): Component => {
  const icons: Record<ToastType, Component> = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };
  return icons[type];
};

const toastClass = (type: ToastType): string => {
  const classes: Record<ToastType, string> = {
    success: 'bg-success-50 dark:bg-success-900/80 border-success-200 dark:border-success-700 text-success-800 dark:text-success-200',
    error: 'bg-error-50 dark:bg-error-900/80 border-error-200 dark:border-error-700 text-error-800 dark:text-error-200',
    warning: 'bg-warning-50 dark:bg-warning-900/80 border-warning-200 dark:border-warning-700 text-warning-800 dark:text-warning-200',
    info: 'bg-blue-50 dark:bg-blue-900/80 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
  };
  return classes[type];
};
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>

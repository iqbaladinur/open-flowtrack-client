import { ref, readonly } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

export function useToast() {
  const show = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = ++toastId;
    const toast: Toast = { id, message, type, duration };

    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  };

  const remove = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message: string, duration = 3000) => show(message, 'success', duration);
  const error = (message: string, duration = 4000) => show(message, 'error', duration);
  const warning = (message: string, duration = 3500) => show(message, 'warning', duration);
  const info = (message: string, duration = 3000) => show(message, 'info', duration);

  return {
    toasts: readonly(toasts),
    show,
    remove,
    success,
    error,
    warning,
    info,
  };
}

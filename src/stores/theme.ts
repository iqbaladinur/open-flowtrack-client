import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';

export type Theme = 'light' | 'dark' | 'system';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('system');

  const applyTheme = () => {
    const selectedTheme = theme.value;
    let isDark: boolean;

    if (selectedTheme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = selectedTheme === 'dark';
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    applyTheme();
  };

  const init = () => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      theme.value = savedTheme;
    }
    applyTheme();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme();
      }
    });
  };

  onMounted(() => {
    init();
  });

  return { theme, setTheme, init };
});

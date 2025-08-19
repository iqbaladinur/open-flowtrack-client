import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const isSidebarMinimized = ref(JSON.parse(localStorage.getItem('isSidebarMinimized') || 'false'));

  function toggleSidebar() {
    isSidebarMinimized.value = !isSidebarMinimized.value;
  }

  watch(isSidebarMinimized, (value) => {
    localStorage.setItem('isSidebarMinimized', JSON.stringify(value));
  });

  return {
    isSidebarMinimized,
    toggleSidebar,
  };
});

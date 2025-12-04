<template>
  <div class="fixed bottom-[70px] right-6 z-[20] sm:hidden">
    <div
      class="absolute bottom-0 right-0 p-4 bg-sepia-500/70 dark:bg-primary-500/70 rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
      @click="toggleMenu"
    >
      <Plus class="w-6 h-6 text-white transition-transform duration-300" :class="{ 'rotate-45': isOpen }" />
    </div>
    <transition name="fade">
      <div v-if="isOpen" class="absolute bottom-20 right-0 space-y-4">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

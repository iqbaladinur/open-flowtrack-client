<template>
  <div class="relative inline-block" ref="containerRef">
    <!-- Trigger Button (Icon Only) -->
    <button type="button" ref="triggerRef" @click.stop="openPicker" :disabled="disabled"
      class="p-1.5 rounded-xl border-2 transition-all duration-200 hover:scale-105" :class="[
        isOpen
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
          : 'border-transparent hover:border-sepia-300 dark:hover:border-gray-600'
      ]">
      <div class="size-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow
                 bg-gradient-to-br from-white/60 to-sepia-200/60 dark:from-gray-500/60 dark:to-gray-600/50">
        <component :is="selectedIconComponent" :size="38" class="text-gray-200/0" />
      </div>
    </button>

    <!-- Desktop Dropdown (Teleported) -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="isOpen && !isMobile"
          class="fixed z-[9999] bg-white dark:bg-gray-800 border border-sepia-200 dark:border-gray-700 rounded-xl shadow-2xl p-2"
          :style="dropdownStyle">
          <div class="grid grid-cols-6 gap-1">
            <button v-for="icon in allIcons" :key="icon.value" type="button" @click.stop="selectIcon(icon.value)"
              class="p-1.5 flex items-center justify-center rounded-lg transition-all duration-100" :class="[
                modelValue === icon.value
                  ? 'bg-sepia-200 dark:bg-gray-600 ring-2 ring-sepia-500 dark:ring-neon ring-offset-1 ring-offset-white dark:ring-offset-gray-800'
                  : 'hover:bg-sepia-100 dark:hover:bg-gray-700'
              ]" :title="t(`iconPicker.${icon.value}`)">
              <div class="size-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow
                 bg-gradient-to-br from-white/60 to-sepia-200/60 dark:from-gray-500/60 dark:to-gray-600/50">
                <component :is="icon.component" :size="38" class="text-gray-200/0" />
              </div>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Mobile Bottom Sheet -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen && isMobile" class="fixed inset-0 z-[9999] bg-black/50" @click="isOpen = false">
          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-full"
            enter-to-class="translate-y-0" leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0" leave-to-class="translate-y-full">
            <div v-if="isOpen"
              class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl p-4 pb-8 max-h-[70vh] overflow-y-auto"
              @click.stop>
              <!-- Handle -->
              <div class="flex justify-center mb-4">
                <div class="w-10 h-1 bg-sepia-300 dark:bg-gray-600 rounded-full"></div>
              </div>

              <!-- Title -->
              <h3 class="text-base font-semibold text-sepia-800 dark:text-white mb-4 text-center">{{
                t('iconPicker.selectIcon') }}</h3>

              <div class="grid grid-cols-6 gap-1 mb-10">
                <button v-for="icon in allIcons" :key="icon.value" type="button" @click.stop="selectIcon(icon.value)"
                  class="aspect-square flex items-center justify-center rounded-xl transition-all duration-100" :class="[
                    modelValue === icon.value
                      ? 'bg-sepia-200 dark:bg-gray-600 ring-2 ring-sepia-500 dark:ring-neon'
                      : 'hover:bg-sepia-100 dark:hover:bg-gray-700 active:bg-sepia-200 dark:active:bg-gray-600'
                  ]">
                  <div class="size-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow
                 bg-gradient-to-br from-white/60 to-sepia-200/60 dark:from-gray-500/60 dark:to-gray-600/50">
                    <component :is="icon.component" :size="38" class="text-gray-200/0" />
                  </div>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  BRIIcon, BCAIcon, BNIIcon, MandiriIcon, JagoIcon,
  CIMBIcon, PermataIcon, BSIIcon, JeniusIcon, SeabankIcon, BTNIcon,
  GopayIcon, OvoIcon, DanaIcon, ShopeePayIcon, LinkAjaIcon,
  BankCashIcon, WalletIcon
} from '@/components/icons';

interface Props {
  modelValue: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const { t } = useI18n();

const isOpen = ref(false);
const isMobile = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref({ top: '0px', left: '0px' });

const bankIcons = [
  { value: 'bri', component: BRIIcon },
  { value: 'bca', component: BCAIcon },
  { value: 'bni', component: BNIIcon },
  { value: 'mandiri', component: MandiriIcon },
  { value: 'bsi', component: BSIIcon },
  { value: 'btn', component: BTNIcon },
  { value: 'cimb', component: CIMBIcon },
  { value: 'permata', component: PermataIcon },
  { value: 'jago', component: JagoIcon },
  { value: 'jenius', component: JeniusIcon },
  { value: 'seabank', component: SeabankIcon },
];

const ewalletIcons = [
  { value: 'gopay', component: GopayIcon },
  { value: 'ovo', component: OvoIcon },
  { value: 'dana', component: DanaIcon },
  { value: 'shopeepay', component: ShopeePayIcon },
  { value: 'linkaja', component: LinkAjaIcon },
];

const genericIcons = [
  { value: 'cash', component: BankCashIcon },
  { value: 'wallet', component: WalletIcon },
];

const allIcons = [...bankIcons, ...ewalletIcons, ...genericIcons];

const iconMap: Record<string, any> = Object.fromEntries(
  allIcons.map(icon => [icon.value, icon])
);

const selectedIconComponent = computed(() => {
  return iconMap[props.modelValue]?.component || WalletIcon;
});

const checkMobile = () => {
  isMobile.value = window.innerWidth < 640;
};

const updateDropdownPosition = () => {
  if (triggerRef.value) {
    const rect = triggerRef.value.getBoundingClientRect();
    dropdownStyle.value = {
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`
    };
  }
};

const openPicker = async () => {
  checkMobile();
  isOpen.value = !isOpen.value;
  if (isOpen.value && !isMobile.value) {
    await nextTick();
    updateDropdownPosition();
  }
};

const selectIcon = (value: string) => {
  emit('update:modelValue', value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  if (!isMobile.value && containerRef.value && !containerRef.value.contains(target)) {
    isOpen.value = false;
  }
};

const handleResize = () => {
  checkMobile();
  if (isOpen.value && !isMobile.value) {
    updateDropdownPosition();
  }
};

const handleScroll = () => {
  if (isOpen.value && !isMobile.value) {
    updateDropdownPosition();
  }
};

onMounted(() => {
  checkMobile();
  document.addEventListener('click', handleClickOutside, true);
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleScroll, true);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleScroll, true);
});
</script>

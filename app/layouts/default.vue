<template>
  <div class="min-h-screen bg-base-100" :data-theme="currentTheme">
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar class="hidden lg:flex" />

      <!-- Mobile Sidebar Overlay -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-40 bg-black/50 lg:hidden"
        @click="isSidebarOpen = false"
      />

      <!-- Mobile Sidebar -->
      <div
        :class="[
          'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:hidden',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          // If sidebar is open on mobile, make wrapper full width if sidebar is full width
           isSidebarOpen && 'w-full sm:w-auto'
        ]"
      >
        <Sidebar @close="isSidebarOpen = false" />
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-h-screen">
        <!-- Header -->
        <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

        <!-- Page Content -->
        <main class="flex-1 p-4 lg:p-6 overflow-auto">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import Sidebar from '~/components/layout/Sidebar.vue';
import Header from '~/components/layout/Header.vue';
import { useCovidStore } from '~/stores/useCovidStore';

/**
 * Default Layout
 * Main layout with sidebar + header + content area
 */
const isSidebarOpen = ref(false);
const store = useCovidStore();

// Compute current theme based on store
const currentTheme = computed(() => store.isDarkMode ? 'dark' : 'light');

// Set theme on document root
onMounted(() => {
  document.documentElement.setAttribute('data-theme', currentTheme.value);
});

const route = useRoute();

// Close sidebar on route change
watch(() => route.path, () => {
  isSidebarOpen.value = false;
});

// Watch for theme changes and sync to document root
watch(
  currentTheme,
  (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  }
);
</script>

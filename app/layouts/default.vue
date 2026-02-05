<template>
  <div class="min-h-screen bg-base-100" data-theme="covidDark">
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
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <Sidebar />
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
import { ref, onMounted, watch } from 'vue';
import Sidebar from '~/components/layout/Sidebar.vue';
import Header from '~/components/layout/Header.vue';
import { useCovidStore } from '~/stores/useCovidStore';

/**
 * Default Layout
 * Main layout with sidebar + header + content area
 */
const isSidebarOpen = ref(false);
const store = useCovidStore();

// Set initial theme
onMounted(() => {
  document.documentElement.setAttribute('data-theme', store.isDarkMode ? 'dark' : 'mytheme');
});

// Watch for theme changes
watch(
  () => store.isDarkMode,
  (isDark) => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'mytheme');
  }
);
</script>

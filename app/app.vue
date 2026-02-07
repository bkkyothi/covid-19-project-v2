<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useThemeStore } from '~/stores/useThemeStore';
import { computed, onMounted } from 'vue';

/**
 * App Entry Point
 * Root component that wraps all pages with layouts
 */
const themeStore = useThemeStore();

onMounted(() => {
  themeStore.init();
});

useHead({
  htmlAttrs: {
    lang: 'en',
    'data-theme': computed(() => themeStore.isDark ? 'dark' : 'light'),
  },
});
</script>

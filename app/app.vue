<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useCovidStore } from '~/stores/useCovidStore';
import { computed } from 'vue';

/**
 * App Entry Point
 * Root component that wraps all pages with layouts
 */
const store = useCovidStore();

useHead({
  htmlAttrs: {
    lang: 'en',
    'data-theme': computed(() => store.isDarkMode ? 'dark' : 'light'),
  },
});
</script>

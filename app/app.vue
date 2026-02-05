<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
/**
 * App Entry Point
 * Root component that wraps all pages with layouts
 */
useHead({
  htmlAttrs: {
    lang: 'en',
    'data-theme': 'covidDark',
  },
});
</script>

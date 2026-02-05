<template>
  <div class="chart-wrapper chart-container">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" :text="loadingText" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4">
      <ErrorAlert type="error" :message="error" />
    </div>

    <!-- Chart Content -->
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue';
import ErrorAlert from './ErrorAlert.vue';

/**
 * ChartWrapper Component
 * Wrapper handling loading/error states for chart components
 */
interface Props {
  loading?: boolean;
  error?: string | null;
  loadingText?: string;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  loadingText: 'Loading chart data...',
});
</script>

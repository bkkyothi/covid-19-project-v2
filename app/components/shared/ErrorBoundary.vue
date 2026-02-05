<template>
  <div class="error-boundary">
    <div v-if="hasError" class="p-4">
      <ErrorAlert
        type="error"
        :title="errorTitle"
        :message="errorMessage"
        dismissible
        @dismiss="reset"
      />
      <button class="btn btn-primary btn-sm mt-4" @click="reset">
        Try Again
      </button>
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import ErrorAlert from './ErrorAlert.vue';

/**
 * ErrorBoundary Component
 * Catches and displays errors from child components
 */
interface Props {
  fallbackTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fallbackTitle: 'Something went wrong',
});

const hasError = ref(false);
const errorMessage = ref('');
const errorTitle = ref(props.fallbackTitle);

// Capture errors from child components
onErrorCaptured((error: Error) => {
  hasError.value = true;
  errorMessage.value = error.message || 'An unexpected error occurred';
  errorTitle.value = props.fallbackTitle;
  
  // Log error in development
  if (process.dev) {
    console.error('[ErrorBoundary]', error);
  }
  
  // Prevent error from propagating
  return false;
});

// Reset error state
function reset(): void {
  hasError.value = false;
  errorMessage.value = '';
}

// Expose reset for parent components
defineExpose({ reset, hasError });
</script>

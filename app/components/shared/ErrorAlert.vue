<template>
  <div :class="['alert', alertClass, 'shadow-lg']" role="alert">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        v-if="type === 'error'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        v-else-if="type === 'warning'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
      <path
        v-else-if="type === 'info'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        v-else
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div>
      <h3 v-if="title" class="font-bold">{{ title }}</h3>
      <div class="text-sm">{{ message }}</div>
    </div>
    <div v-if="dismissible">
      <button class="btn btn-sm btn-ghost" @click="$emit('dismiss')">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ErrorAlert Component
 * DaisyUI alert for displaying errors, warnings, and info messages
 */
interface Props {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  dismissible?: boolean;
}

defineProps<Props>();

defineEmits<{
  dismiss: [];
}>();

const alertClass = computed(() => {
  const props = defineProps<Props>();
  const classes = {
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info',
    success: 'alert-success',
  };
  return classes[props.type || 'error'];
});
</script>

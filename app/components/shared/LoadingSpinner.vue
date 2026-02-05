<template>
  <div class="flex items-center justify-center">
    <span :class="['loading loading-spinner', sizeClass, colorClass]"></span>
    <span v-if="text" class="ml-2 text-sm">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * LoadingSpinner Component
 * DaisyUI loading spinner with customizable size and color
 */
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  text: '',
});

const sizeClass = computed(() => {
  const sizes = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  };
  return sizes[props.size];
});

const colorClass = computed(() => {
  const colors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    info: 'text-info',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  };
  return colors[props.color];
});
</script>

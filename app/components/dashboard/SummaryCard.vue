<template>
  <div
    class="card bg-base-200 shadow-lg summary-card cursor-pointer"
    :class="[colorClass]"
  >
    <div class="card-body p-4">
      <div class="flex items-start justify-between">
        <!-- Icon -->
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center"
          :class="iconBgClass"
        >
          <component :is="iconComponent" class="w-6 h-6" :class="iconTextClass" />
        </div>

        <!-- Change Indicator -->
        <div v-if="change !== undefined" class="text-right">
          <span
            :class="[
              'text-xs font-medium px-2 py-1 rounded-full',
              change >= 0 ? 'bg-error/20 text-error' : 'bg-success/20 text-success'
            ]"
          >
            {{ change >= 0 ? '+' : '' }}{{ formatNumber(change) }}
          </span>
        </div>
      </div>

      <div class="mt-3">
        <p class="text-base-content/60 text-sm">{{ title }}</p>
        <h3 class="text-2xl font-bold mt-1">{{ formatNumber(value) }}</h3>
      </div>

      <!-- Progress bar (optional) -->
      <div v-if="showProgress" class="mt-3">
        <progress
          class="progress w-full h-1"
          :class="progressClass"
          :value="progressValue"
          max="100"
        ></progress>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue';

/**
 * SummaryCard Component
 * Displays a single statistic with icon, value, and optional change indicator
 */
interface Props {
  title: string;
  value: number;
  change?: number;
  icon?: 'cases' | 'deaths' | 'recovered' | 'active' | 'tests' | 'critical';
  color?: 'blue' | 'red' | 'green' | 'orange' | 'purple' | 'cyan';
  showProgress?: boolean;
  progressValue?: number;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'cases',
  color: 'blue',
  showProgress: false,
  progressValue: 0,
});

// Color classes
const colorClass = computed(() => {
  const colors = {
    blue: 'border-l-4 border-l-primary',
    red: 'border-l-4 border-l-error',
    green: 'border-l-4 border-l-success',
    orange: 'border-l-4 border-l-warning',
    purple: 'border-l-4 border-l-secondary',
    cyan: 'border-l-4 border-l-info',
  };
  return colors[props.color];
});

const iconBgClass = computed(() => {
  const colors = {
    blue: 'bg-primary/20',
    red: 'bg-error/20',
    green: 'bg-success/20',
    orange: 'bg-warning/20',
    purple: 'bg-secondary/20',
    cyan: 'bg-info/20',
  };
  return colors[props.color];
});

const iconTextClass = computed(() => {
  const colors = {
    blue: 'text-primary',
    red: 'text-error',
    green: 'text-success',
    orange: 'text-warning',
    purple: 'text-secondary',
    cyan: 'text-info',
  };
  return colors[props.color];
});

const progressClass = computed(() => {
  const colors = {
    blue: 'progress-primary',
    red: 'progress-error',
    green: 'progress-success',
    orange: 'progress-warning',
    purple: 'progress-secondary',
    cyan: 'progress-info',
  };
  return colors[props.color];
});

// Icon components
const iconComponent = computed(() => {
  const icons = {
    cases: h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
    ]),
    deaths: h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    recovered: h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' })
    ]),
    active: h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 10V3L4 14h7v7l9-11h-7z' })
    ]),
    tests: h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' })
    ]),
    critical: h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' })
    ]),
  };
  return icons[props.icon];
});

// Format large numbers
function formatNumber(value: number): string {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2) + 'B';
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toLocaleString('en-US');
}
</script>

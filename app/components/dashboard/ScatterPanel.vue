<template>
  <ChartWrapper :loading="loading" :error="error">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
      <h3 class="text-base sm:text-lg font-semibold">{{ title }}</h3>

      <!-- Mode Selector -->
      <div role="tablist" class="tabs tabs-border tabs-sm sm:tabs-md">
        <a 
          role="tab" 
          class="tab text-xs sm:text-sm" 
          :class="mode === 'total' ? 'tab-active' : ''"
          @click="mode = 'total'"
        >Total</a>
        <a 
          role="tab" 
          class="tab text-xs sm:text-sm" 
          :class="mode === 'perMillion' ? 'tab-active' : ''"
          @click="mode = 'perMillion'"
        >Per Million</a>
      </div>
    </div>

    <ClientOnly>
      <apexchart
        v-if="chartOptions && chartSeries.length"
        type="scatter"
        :height="responsiveHeight"
        :options="chartOptions"
        :series="chartSeries"
      />
    </ClientOnly>
  </ChartWrapper>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import ChartWrapper from '~/components/shared/ChartWrapper.vue';
import { ScatterChart } from '~/charts';
import { useCovidStore } from '~/stores/useCovidStore';
import type { CountryData } from '~/models';
import type { ApexOptions } from 'apexcharts';

/**
 * ScatterPanel Component
 * Displays scatter chart for cases vs deaths correlation
 */
interface Props {
  countries?: CountryData[] | null;
  loading?: boolean;
  error?: string | null;
  title?: string;
  height?: number;
  limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  countries: null,
  loading: false,
  error: null,
  title: 'Cases vs Deaths',
  height: 350,
  limit: 50,
});

const mode = ref<'total' | 'perMillion'>('total');

// Get store for dark mode state
const store = useCovidStore();
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

// Responsive height calculation
const responsiveHeight = computed(() => {
  if (windowWidth.value < 480) return 260;
  if (windowWidth.value < 640) return 300;
  return props.height;
});

function handleResize() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
  }
});

// Build chart configuration
const chartConfig = computed(() => {
  if (!props.countries || props.countries.length === 0) return null;

  let chart: ScatterChart;

  if (mode.value === 'total') {
    chart = ScatterChart.fromCountriesCasesVsDeaths(props.countries, props.limit, {
      isDarkMode: store.isDarkMode,
    });
  } else {
    chart = ScatterChart.fromCountriesPerMillion(props.countries, props.limit, {
      isDarkMode: store.isDarkMode,
    });
  }

  return chart.getConfig();
});

const chartOptions = computed<ApexOptions | null>(() => {
  if (!chartConfig.value) return null;
  // Remove title from options since we have our own
  const options = { ...chartConfig.value.options };
  delete options.title;
  return options;
});

const chartSeries = computed(() => chartConfig.value?.series || []);
</script>

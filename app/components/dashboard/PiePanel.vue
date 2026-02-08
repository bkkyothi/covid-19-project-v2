<template>
  <ChartWrapper :loading="loading" :error="error">
    <div class="mb-4">
      <h3 class="text-base sm:text-lg font-semibold">{{ title }}</h3>
    </div>

    <ClientOnly>
      <apexchart
        v-if="chartOptions && chartSeries.length"
        :type="chartType"
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
import { PieChart } from '~/charts';
import { useCovidStore } from '~/stores/useCovidStore';
import type { ContinentData, CountryData } from '~/models';
import type { ApexOptions } from 'apexcharts';

/**
 * PiePanel Component
 * Displays pie/donut charts for data distribution
 */
interface Props {
  continents?: ContinentData[] | null;
  countries?: CountryData[] | null;
  loading?: boolean;
  error?: string | null;
  title?: string;
  chartType?: 'pie' | 'donut';
  height?: number;
  limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  continents: null,
  countries: null,
  loading: false,
  error: null,
  title: 'Distribution',
  chartType: 'donut',
  height: 350,
  limit: 10,
});

// Get store for dark mode state
const store = useCovidStore();
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

// Responsive height calculation
const responsiveHeight = computed(() => {
  if (windowWidth.value < 480) return 280;
  if (windowWidth.value < 640) return 320;
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
  if (props.continents && props.continents.length > 0) {
    const chart = PieChart.fromContinents(props.continents, {
      chartType: props.chartType,
      isDarkMode: store.isDarkMode,
    });
    return chart.getConfig();
  }

  if (props.countries && props.countries.length > 0) {
    const chart = PieChart.fromCountries(props.countries, props.limit, {
      chartType: props.chartType,
      isDarkMode: store.isDarkMode,
    });
    return chart.getConfig();
  }

  return null;
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

<template>
  <ChartWrapper :loading="loading" :error="error">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      
      <!-- Period Selector -->
      <div role="tablist" class="tabs tabs-border">
        <a
          v-for="period in periods"
          :key="period.value"
          role="tab"
          class="tab"
          :class="selectedPeriod === period.value ? 'tab-active' : ''"
          @click="selectPeriod(period.value)"
        >
          {{ period.label }}
        </a>
      </div>
    </div>

    <ClientOnly>
      <apexchart
        v-if="chartOptions && chartSeries.length"
        :type="chartType"
        :height="height"
        :options="chartOptions"
        :series="chartSeries"
      />
    </ClientOnly>
  </ChartWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ChartWrapper from '~/components/shared/ChartWrapper.vue';
import { TimeseriesChart } from '~/charts';
import { useCovidStore } from '~/stores/useCovidStore';
import type { HistoricalData } from '~/models';
import type { ApexOptions } from 'apexcharts';

/**
 * TimeseriesPanel Component
 * Displays timeseries charts with period selection
 */
interface Props {
  data: HistoricalData | null;
  loading?: boolean;
  error?: string | null;
  title?: string;
  chartType?: 'area' | 'line';
  height?: number;
  showCases?: boolean;
  showDeaths?: boolean;
  showRecovered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  title: 'Cases Over Time',
  chartType: 'area',
  height: 350,
  showCases: true,
  showDeaths: true,
  showRecovered: true,
});

// Period options
const periods = [
  { label: '30D', value: 30, color: 'btn-accent' },
  { label: '90D', value: 90, color: 'btn-secondary' },
  { label: '1Y', value: 365, color: 'btn-secondary' },
  { label: 'All', value: 0, color: 'btn-primary' },
];

const selectedPeriod = ref(0); // 0 = All

// Get store for dark mode state
const store = useCovidStore();

// Filter data by period
const filteredData = computed(() => {
  if (!props.data) return null;
  if (selectedPeriod.value === 0) return props.data;
  return props.data.filterByDays(selectedPeriod.value);
});

// Build chart configuration
const chartConfig = computed(() => {
  if (!filteredData.value) return null;

  const chart = new TimeseriesChart(filteredData.value, {
    chartType: props.chartType,
    dataType: 'cumulative',
    showCases: props.showCases,
    showDeaths: props.showDeaths,
    showRecovered: props.showRecovered,
    isDarkMode: store.isDarkMode,
  });

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

function selectPeriod(value: number): void {
  selectedPeriod.value = value;
}
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="card-title text-base font-bold">{{ title }}</h3>
        
        <!-- Period Selector -->
        <div role="tablist" class="tabs tabs-border tabs-sm">
          <a
            v-for="period in periods"
            :key="period.value"
            role="tab"
            class="tab"
            :class="selectedPeriod === period.value ? 'tab-active' : ''"
            @click="selectedPeriod = period.value"
          >
            {{ period.label }}
          </a>
        </div>
      </div>

      <ClientOnly>
        <apexchart
          v-if="chartOptions && chartSeries.length"
          type="area"
          :height="height"
          :options="chartOptions"
          :series="chartSeries"
        />
        <div v-else class="h-64 flex items-center justify-center skeleton">
             Loading Chart...
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCovidStore } from '~/stores/useCovidStore';
import { useThemeStore } from '~/stores/useThemeStore';
import type { VaccineCoverage } from '~/models';
import type { ApexOptions } from 'apexcharts';

interface Props {
  data: VaccineCoverage | null;
  title?: string;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  data: null,
  title: 'Vaccination Trend',
  height: 350,
});

const store = useCovidStore();
const themeStore = useThemeStore();
const selectedPeriod = ref(0); // 0 = All

const periods = [
  { label: '30D', value: 30 },
  { label: '90D', value: 90 },
  { label: '1Y', value: 365 },
  { label: 'All', value: 0 },
];

const filteredData = computed(() => {
  if (!props.data) return null;
  if (selectedPeriod.value === 0) return props.data;
  return props.data.filterByDays(selectedPeriod.value);
});

const chartSeries = computed(() => {
    if (!filteredData.value) return [];
    const data = filteredData.value.toTimeseriesSeries();
    return [{
        name: 'Doses Administered',
        data: data
    }];
});

const chartOptions = computed<ApexOptions>(() => {
    const isDark = themeStore.isDark;
    
    return {
        chart: {
            background: 'transparent',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        theme: {
            mode: isDark ? 'dark' : 'light'
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#10b981'], // Emerald-500
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.1, // Fade out
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            type: 'datetime',
            tooltip: { enabled: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: isDark ? '#9ca3af' : '#6b7280' }
            }
        },
        yaxis: {
            labels: {
                style: { colors: isDark ? '#9ca3af' : '#6b7280' },
                formatter: (val) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val)
            }
        },
        grid: {
            borderColor: isDark ? '#374151' : '#e5e7eb',
            strokeDashArray: 4
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            x: { format: 'dd MMM yyyy' }
        }
    };
});
</script>

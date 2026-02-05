<template>
  <div>
    <!-- Page Loading -->
    <div v-if="isInitialLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <LoadingSpinner size="lg" />
        <p class="mt-4 text-base-content/60">Loading dashboard data...</p>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Summary Cards -->
      <section class="mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Cases"
            :value="globalSummary?.totalCases || 0"
            :change="globalSummary?.todayCases"
            icon="cases"
            color="blue"
          />
          <SummaryCard
            title="Total Deaths"
            :value="globalSummary?.totalDeaths || 0"
            :change="globalSummary?.todayDeaths"
            icon="deaths"
            color="red"
          />
          <SummaryCard
            title="Recovered"
            :value="globalSummary?.totalRecovered || 0"
            :change="globalSummary?.todayRecovered"
            icon="recovered"
            color="green"
          />
          <SummaryCard
            title="Active Cases"
            :value="globalSummary?.activeCases || 0"
            icon="active"
            color="orange"
          />
        </div>
      </section>

      <!-- Secondary Stats -->
      <section class="mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            title="Critical Cases"
            :value="globalSummary?.criticalCases || 0"
            icon="critical"
            color="purple"
          />
          <SummaryCard
            title="Total Tests"
            :value="globalSummary?.totalTests || 0"
            icon="tests"
            color="cyan"
          />
          <div class="card bg-base-200 shadow-lg p-4">
            <div class="flex flex-col h-full justify-center">
              <div class="stats stats-vertical lg:stats-horizontal bg-transparent">
                <div class="stat p-2">
                  <div class="stat-title text-xs">Fatality Rate</div>
                  <div class="stat-value text-lg text-error">
                    {{ globalSummary?.fatalityRate.toFixed(2) || 0 }}%
                  </div>
                </div>
                <div class="stat p-2">
                  <div class="stat-title text-xs">Recovery Rate</div>
                  <div class="stat-value text-lg text-success">
                    {{ globalSummary?.recoveryRate.toFixed(2) || 0 }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Charts Section -->
      <section class="mb-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Timeseries Chart -->
          <TimeseriesPanel
            :data="historicalData"
            :loading="store.historicalData.loading"
            :error="store.historicalData.error"
            title="COVID-19 Cases Over Time"
            chart-type="area"
          />

          <!-- Continent Distribution -->
          <PiePanel
            :continents="continents"
            :loading="store.continents.loading"
            :error="store.continents.error"
            title="Cases by Continent"
            chart-type="donut"
          />
        </div>
      </section>

      <!-- Second Row Charts -->
      <section class="mb-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Top Countries Pie -->
          <PiePanel
            :countries="countries"
            :loading="store.countries.loading"
            :error="store.countries.error"
            title="Top 10 Countries by Cases"
            chart-type="pie"
            :limit="10"
          />

          <!-- Scatter Chart -->
          <ScatterPanel
            :countries="countries"
            :loading="store.countries.loading"
            :error="store.countries.error"
            title="Cases vs Deaths Analysis"
            :limit="50"
          />
        </div>
      </section>

      <!-- Top Countries Table -->
      <section>
        <TopCountriesTable
          :countries="countries"
          :loading="store.countries.loading"
          :error="store.countries.error"
          title="Top Countries by Cases"
          :limit="15"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCovidStore } from '~/stores/useCovidStore';
import LoadingSpinner from '~/components/shared/LoadingSpinner.vue';
import SummaryCard from '~/components/dashboard/SummaryCard.vue';
import TimeseriesPanel from '~/components/dashboard/TimeseriesPanel.vue';
import PiePanel from '~/components/dashboard/PiePanel.vue';
import ScatterPanel from '~/components/dashboard/ScatterPanel.vue';
import TopCountriesTable from '~/components/dashboard/TopCountriesTable.vue';

/**
 * Dashboard Page
 * Main COVID-19 dashboard with all visualizations
 */
definePageMeta({
  layout: 'default',
});

const store = useCovidStore();

// Data from store
const globalSummary = computed(() => store.globalSummary.data);
const historicalData = computed(() => store.historicalData.data);
const countries = computed(() => store.countries.data);
const continents = computed(() => store.continents.data);

// Check if initial load is happening
const isInitialLoading = computed(() => {
  return (
    store.isLoading &&
    !store.globalSummary.data &&
    !store.historicalData.data
  );
});

// Fetch data on mount
onMounted(async () => {
  await store.fetchDashboardData();
});
</script>

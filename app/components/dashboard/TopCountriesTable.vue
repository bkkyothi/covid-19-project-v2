<template>
  <div class="card bg-base-200 shadow-lg">
    <div class="card-body p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base sm:text-lg font-semibold">{{ title }}</h3>
        <span class="badge badge-primary badge-sm sm:badge-md">Top {{ limit }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-4">
        <ErrorAlert type="error" :message="error" />
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="table table-zebra table-sm sm:table-md w-full">
          <thead>
            <tr class="text-xs sm:text-sm">
              <th class="w-8 sm:w-12">#</th>
              <th>Country</th>
              <th class="text-right">Cases</th>
              <th class="text-right">Deaths</th>
              <th class="text-right hidden sm:table-cell">Recovered</th>
              <th class="text-right">Fatality</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(country, index) in displayCountries" :key="country.name" class="text-xs sm:text-sm">
              <td class="font-mono text-base-content/60">{{ index + 1 }}</td>
              <td>
                <div class="flex items-center gap-1 sm:gap-2">
                  <img
                    :src="country.flagUrl"
                    :alt="country.name"
                    class="w-4 h-3 sm:w-6 sm:h-4 object-cover rounded"
                  />
                  <span class="font-medium truncate max-w-[80px] sm:max-w-none">{{ country.name }}</span>
                </div>
              </td>
              <td class="text-right font-mono text-primary">
                {{ formatNumber(country.cases) }}
              </td>
              <td class="text-right font-mono text-error">
                {{ formatNumber(country.deaths) }}
              </td>
              <td class="text-right font-mono text-success hidden sm:table-cell">
                {{ formatNumber(country.recovered) }}
              </td>
              <td class="text-right">
                <span class="badge badge-xs sm:badge-sm" :class="getFatalityBadgeClass(country.fatalityRate)">
                  {{ country.fatalityRate.toFixed(1) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LoadingSpinner from '~/components/shared/LoadingSpinner.vue';
import ErrorAlert from '~/components/shared/ErrorAlert.vue';
import type { CountryData } from '~/models';

/**
 * TopCountriesTable Component
 * Displays a table of top countries by cases
 */
interface Props {
  countries?: CountryData[] | null;
  loading?: boolean;
  error?: string | null;
  title?: string;
  limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  countries: null,
  loading: false,
  error: null,
  title: 'Top Countries by Cases',
  limit: 10,
});

// Get sorted and limited countries
const displayCountries = computed(() => {
  if (!props.countries) return [];
  return [...props.countries]
    .sort((a, b) => b.cases - a.cases)
    .slice(0, props.limit);
});

// Format numbers with abbreviation
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

// Get badge class based on fatality rate
function getFatalityBadgeClass(rate: number): string {
  if (rate >= 3) return 'badge-error';
  if (rate >= 2) return 'badge-warning';
  return 'badge-success';
}
</script>

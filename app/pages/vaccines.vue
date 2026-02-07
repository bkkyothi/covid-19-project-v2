<template>
  <div class="p-6 space-y-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold">Vaccination Tracking</h1>
      <p class="text-base-content/70">Global COVID-19 vaccination distribution and progress.</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <div class="stats shadow bg-base-100 w-full border border-base-200" v-if="globalCoverage">
        <div class="stat">
          <div class="stat-figure text-success">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          </div>
          <div class="stat-title">Total Doses Administered</div>
          <div class="stat-value text-success text-2xl lg:text-3xl">{{ formatNumber(globalCoverage.totalVaccinated) }}</div>
          <div class="stat-desc">worldwide</div>
        </div>
      </div>
      <!-- Placeholder for more stats if needed -->
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Map & Chart (Left Column - 2 spans) -->
      <div class="lg:col-span-2 space-y-6">
         <!-- Map Card -->
         <div class="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
            <div class="card-body p-0 h-[500px] relative">
               <ClientOnly>
                 <VaccineMap />
                 <template #fallback>
                    <div class="skeleton w-full h-full rounded-none"></div>
                 </template>
               </ClientOnly>
            </div>
         </div>

         <!-- Trend Chart -->
         <VaccineChartPanel 
            v-if="globalCoverage" 
            :data="globalCoverage" 
            title="Global Vaccination Timeline" 
         />
      </div>

      <!-- Top Countries Table (Right Column - 1 span) -->
      <div class="card bg-base-100 shadow-xl h-fit border border-base-200">
         <div class="card-body p-4">
            <h2 class="card-title text-lg mb-4">Top Countries by Doses</h2>
            <div class="overflow-x-auto">
               <table class="table table-xs w-full">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Country</th>
                      <th class="text-right">Doses</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(country, index) in topCountries" :key="country.countryName" class="hover">
                      <th>{{ index + 1 }}</th>
                      <td class="font-bold truncate max-w-[120px]" :title="country.countryName">
                         {{ country.countryName }}
                      </td>
                      <td class="text-right font-mono">{{ formatCompact(country.totalVaccinated) }}</td>
                    </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCovidStore } from '~/stores/useCovidStore';
import VaccineMap from '~/components/vaccines/VaccineMap.vue';
import VaccineChartPanel from '~/components/vaccines/VaccineChartPanel.vue';

const store = useCovidStore();

onMounted(async () => {
    if (!store.vaccineCoverage.data) {
       store.fetchVaccineCoverage('all'); 
    }
    if (!store.vaccineCountries.data) {
       store.fetchVaccineCountries();
    }
});

const globalCoverage = computed(() => store.vaccineCoverage.data);
const topCountries = computed(() => store.topVaccinatedCountries);

function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
}

function formatCompact(num: number): string {
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
}
</script>

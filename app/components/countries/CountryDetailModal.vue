<template>
  <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle">
    <div v-if="country" class="modal-box bg-base-200">
      <!-- Modal Header -->
      <div class="flex items-center gap-4 mb-6">
        <figure class="w-32 shadow-lg ring ring-primary ring-offset-base-100 ring-offset-2 rounded-xl overflow-hidden">
          <img :src="country.flagUrl" :alt="country.name" class="w-full h-full object-cover aspect-[4/3]" />
        </figure>
        <div>
          <h3 class="font-bold text-2xl">{{ country.name }}</h3>
          <div class="flex items-center gap-2 mt-1">
            <span class="badge badge-outline">{{ country.continent }}</span>
            <span class="badge badge-ghost">{{ country.iso3 }}</span>
          </div>
        </div>
      </div>

      <!-- Main Stats -->
      <div class="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100 mb-4">
        <div class="stat">
          <div class="stat-figure text-warning">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="stat-title">Total Cases</div>
          <div class="stat-value text-warning text-xl">{{ formatNumber(country.cases) }}</div>
          <div class="stat-desc text-success">+{{ formatNumber(country.todayCases) }} today</div>
        </div>
        
        <div class="stat">
          <div class="stat-figure text-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div class="stat-title">Deaths</div>
          <div class="stat-value text-error text-xl">{{ formatNumber(country.deaths) }}</div>
          <div class="stat-desc text-error/70">+{{ formatNumber(country.todayDeaths) }} today</div>
        </div>
        
        <div class="stat">
          <div class="stat-figure text-success">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-title">Recovered</div>
          <div class="stat-value text-success text-xl">{{ formatNumber(country.recovered) }}</div>
          <div class="stat-desc text-success/70">+{{ formatNumber(country.todayRecovered) }} today</div>
        </div>
      </div>

      <!-- Detailed Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div class="bg-base-100 rounded-xl p-4 shadow">
          <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
            <div class="w-2 h-2 rounded-full bg-info"></div>
            Active Cases
          </div>
          <div class="font-bold text-lg text-info">{{ formatNumber(country.active) }}</div>
        </div>
        
        <div class="bg-base-100 rounded-xl p-4 shadow">
          <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
            <div class="w-2 h-2 rounded-full bg-error"></div>
            Critical
          </div>
          <div class="font-bold text-lg text-error">{{ formatNumber(country.critical) }}</div>
        </div>
        
        <div class="bg-base-100 rounded-xl p-4 shadow">
          <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
            <div class="w-2 h-2 rounded-full bg-primary"></div>
            Tests
          </div>
          <div class="font-bold text-lg text-primary">{{ formatNumber(country.tests) }}</div>
        </div>
        
        <div class="bg-base-100 rounded-xl p-4 shadow">
          <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
            <div class="w-2 h-2 rounded-full" :class="country.fatalityClass.replace('text-', 'bg-')"></div>
            Fatality Rate
          </div>
          <div class="font-bold text-lg" :class="country.fatalityClass">
            {{ country.fatalityRate.toFixed(2) }}%
          </div>
        </div>
        
        <div class="bg-base-100 rounded-xl p-4 shadow">
          <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
            <div class="w-2 h-2 rounded-full bg-success"></div>
            Recovery Rate
          </div>
          <div class="font-bold text-lg text-success">{{ country.recoveryRate.toFixed(2) }}%</div>
        </div>
        
        <div class="bg-base-100 rounded-xl p-4 shadow">
          <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
            <div class="w-2 h-2 rounded-full bg-secondary"></div>
            Population
          </div>
          <div class="font-bold text-lg">{{ formatNumber(country.population) }}</div>
        </div>
      </div>

      <!-- Per Million Stats -->
      <div class="bg-base-100 rounded-xl p-4 shadow mb-4">
        <h4 class="font-semibold text-sm text-base-content/70 mb-3">Per Million Population</h4>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-lg font-bold text-warning">{{ formatNumber(country.casesPerMillion) }}</div>
            <div class="text-xs text-base-content/60">Cases</div>
          </div>
          <div>
            <div class="text-lg font-bold text-error">{{ formatNumber(country.deathsPerMillion) }}</div>
            <div class="text-xs text-base-content/60">Deaths</div>
          </div>
          <div>
            <div class="text-lg font-bold text-primary">{{ formatNumber(country.testsPerMillion) }}</div>
            <div class="text-xs text-base-content/60">Tests</div>
          </div>
        </div>
      </div>

      <!-- Modal Action -->
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-primary">Close</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CountryData } from '~/models';

const modalRef = ref<HTMLDialogElement | null>(null);
const country = ref<CountryData | null>(null);

function show(data: CountryData) {
  country.value = data;
  modalRef.value?.showModal();
}

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



defineExpose({ show });
</script>

<style scoped>
.modal-box {
  max-height: 90vh;
  overflow-y: auto;
}
</style>

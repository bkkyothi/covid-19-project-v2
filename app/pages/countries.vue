<template>
  <div class="countries-page p-4 md:p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Countries Overview
        </h1>
        <p class="text-base-content/60 mt-1">
          Explore COVID-19 data by country. Click on a flag to see details.
        </p>
      </div>
      <div class="flex flex-col items-end gap-2">
        <div class="badge badge-lg badge-primary gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ countries?.length || 0 }} Countries
        </div>
        <label class="input input-bordered flex items-center gap-2">
          <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" class="grow" required placeholder="Search" v-model="searchQuery"/>
        </label>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <span class="loading loading-infinity loading-lg text-primary"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Flags Grid with 3D Hover Effect -->
    <TransitionGroup 
      name="list" 
      tag="div" 
      v-else 
      class="flags-grid"
    >
      <div
        v-for="country in filteredCountries"
        :key="country.iso2 || country.name"
        class="hover-3d"
        @click="openCountryModal(country)"
      >
        <!-- Flag Content -->
        <figure class="flag-figure">
          <img
            :src="country.flagUrl"
            :alt="country.name"
            class="flag-image"
            loading="lazy"
          />
          <figcaption
            class="flag-caption"
            :class="{
              'forced-visible': searchQuery.trim().length > 0
            }"
            v-html="highlight(country.name)"
          ></figcaption>
        </figure>
        <!-- 8 empty divs needed for the 3D effect -->
     
      </div>
    </TransitionGroup>

    <!-- Country Detail Modal -->
    <dialog ref="countryModal" class="modal modal-bottom sm:modal-middle">
      <div v-if="selectedCountry" class="modal-box bg-base-200">
        <!-- Modal Header -->
        <div class="flex items-center gap-4 mb-6">
          <figure class="w-32 shadow-lg ring ring-primary ring-offset-base-100 ring-offset-2 rounded-xl overflow-hidden">
            <img :src="selectedCountry.flagUrl" :alt="selectedCountry.name" class="w-full h-full object-cover aspect-[4/3]" />
          </figure>
          <div>
            <h3 class="font-bold text-2xl">{{ selectedCountry.name }}</h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="badge badge-outline">{{ selectedCountry.continent }}</span>
              <span class="badge badge-ghost">{{ selectedCountry.iso3 }}</span>
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
            <div class="stat-value text-warning text-xl">{{ formatNumber(selectedCountry.cases) }}</div>
            <div class="stat-desc text-success">+{{ formatNumber(selectedCountry.todayCases) }} today</div>
          </div>
          
          <div class="stat">
            <div class="stat-figure text-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div class="stat-title">Deaths</div>
            <div class="stat-value text-error text-xl">{{ formatNumber(selectedCountry.deaths) }}</div>
            <div class="stat-desc text-error/70">+{{ formatNumber(selectedCountry.todayDeaths) }} today</div>
          </div>
          
          <div class="stat">
            <div class="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="stat-title">Recovered</div>
            <div class="stat-value text-success text-xl">{{ formatNumber(selectedCountry.recovered) }}</div>
            <div class="stat-desc text-success/70">+{{ formatNumber(selectedCountry.todayRecovered) }} today</div>
          </div>
        </div>

        <!-- Detailed Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <div class="bg-base-100 rounded-xl p-4 shadow">
            <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
              <div class="w-2 h-2 rounded-full bg-info"></div>
              Active Cases
            </div>
            <div class="font-bold text-lg text-info">{{ formatNumber(selectedCountry.active) }}</div>
          </div>
          
          <div class="bg-base-100 rounded-xl p-4 shadow">
            <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
              <div class="w-2 h-2 rounded-full bg-error"></div>
              Critical
            </div>
            <div class="font-bold text-lg text-error">{{ formatNumber(selectedCountry.critical) }}</div>
          </div>
          
          <div class="bg-base-100 rounded-xl p-4 shadow">
            <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
              <div class="w-2 h-2 rounded-full bg-primary"></div>
              Tests
            </div>
            <div class="font-bold text-lg text-primary">{{ formatNumber(selectedCountry.tests) }}</div>
          </div>
          
          <div class="bg-base-100 rounded-xl p-4 shadow">
            <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
              <div class="w-2 h-2 rounded-full" :class="getFatalityClass(selectedCountry.fatalityRate).replace('text-', 'bg-')"></div>
              Fatality Rate
            </div>
            <div class="font-bold text-lg" :class="getFatalityClass(selectedCountry.fatalityRate)">
              {{ selectedCountry.fatalityRate.toFixed(2) }}%
            </div>
          </div>
          
          <div class="bg-base-100 rounded-xl p-4 shadow">
            <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
              <div class="w-2 h-2 rounded-full bg-success"></div>
              Recovery Rate
            </div>
            <div class="font-bold text-lg text-success">{{ selectedCountry.recoveryRate.toFixed(2) }}%</div>
          </div>
          
          <div class="bg-base-100 rounded-xl p-4 shadow">
            <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
              <div class="w-2 h-2 rounded-full bg-secondary"></div>
              Population
            </div>
            <div class="font-bold text-lg">{{ formatNumber(selectedCountry.population) }}</div>
          </div>
        </div>

        <!-- Per Million Stats -->
        <div class="bg-base-100 rounded-xl p-4 shadow mb-4">
          <h4 class="font-semibold text-sm text-base-content/70 mb-3">Per Million Population</h4>
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-lg font-bold text-warning">{{ formatNumber(selectedCountry.casesPerMillion) }}</div>
              <div class="text-xs text-base-content/60">Cases</div>
            </div>
            <div>
              <div class="text-lg font-bold text-error">{{ formatNumber(selectedCountry.deathsPerMillion) }}</div>
              <div class="text-xs text-base-content/60">Deaths</div>
            </div>
            <div>
              <div class="text-lg font-bold text-primary">{{ formatNumber(selectedCountry.testsPerMillion) }}</div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCovidStore } from '~/stores/useCovidStore';
import type { CountryData } from '~/models';
import Fuse from 'fuse.js';

// Store
const store = useCovidStore();

// State
const selectedCountry = ref<CountryData | null>(null);
const countryModal = ref<HTMLDialogElement | null>(null);
const searchQuery = ref('');

// Computed
const countries = computed(() => store.countries.data);
const loading = computed(() => store.countries.loading);
const error = computed(() => store.countries.error);

const debouncedSearchQuery = ref('');
let debounceTimeout: NodeJS.Timeout;

watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newVal;
  }, 300);
});

const filteredCountries = computed(() => {
  if (!countries.value) return [];
  if (!debouncedSearchQuery.value) return countries.value;
  
  const options = {
    keys: ['name', 'iso2', 'iso3'],
    threshold: 0.3, // 0.0 is perfect match, 1.0 is match anything
    ignoreLocation: true
  };
  
  const fuse = new Fuse(countries.value, options);
  return fuse.search(debouncedSearchQuery.value).map(result => result.item);
});

// Methods
function openCountryModal(country: CountryData): void {
  selectedCountry.value = country;
  countryModal.value?.showModal();
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

function getFatalityClass(rate: number): string {
  if (rate >= 3) return 'text-error';
  if (rate >= 2) return 'text-warning';
  return 'text-success';
}

function highlight(text: string) {
  if (!searchQuery.value) return text;
  const q = searchQuery.value;
  return text.replace(
    new RegExp(`(${q})`, 'gi'),
    '<span class="text-warning">$1</span>'
  );
}

// Lifecycle
onMounted(async () => {
  if (!store.countries.data) {
    await store.fetchCountries();
  }
});
</script>

<style scoped>
.countries-page {
  min-height: 100vh;
}

.flags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
}

@media (min-width: 640px) {
  .flags-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .flags-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1.5rem;
  }
}

/* 3D Hover Effect */
.hover-3d {
  display: grid;
  place-items: center;
  perspective: 1000px;
  cursor: pointer;
}

.hover-3d > *:first-child {
  grid-area: 1/1;
  transition: transform 0.5s;
  transform-style: preserve-3d;
}

.hover-3d > div:empty {
  grid-area: 1/1;
}

.hover-3d > div:nth-child(2) { clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%); }
.hover-3d > div:nth-child(3) { clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%); }
.hover-3d > div:nth-child(4) { clip-path: polygon(0 50%, 50% 50%, 50% 100%, 0 100%); }
.hover-3d > div:nth-child(5) { clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%); }
.hover-3d > div:nth-child(6) { clip-path: polygon(0 0, 25% 0, 25% 100%, 0 100%); }
.hover-3d > div:nth-child(7) { clip-path: polygon(25% 0, 50% 0, 50% 100%, 25% 100%); }
.hover-3d > div:nth-child(8) { clip-path: polygon(50% 0, 75% 0, 75% 100%, 50% 100%); }
.hover-3d > div:nth-child(9) { clip-path: polygon(75% 0, 100% 0, 100% 100%, 75% 100%); }

.hover-3d > div:nth-child(2):hover ~ *:first-child { transform: rotateX(10deg) rotateY(-10deg); }
.hover-3d > div:nth-child(3):hover ~ *:first-child { transform: rotateX(10deg) rotateY(10deg); }
.hover-3d > div:nth-child(4):hover ~ *:first-child { transform: rotateX(-10deg) rotateY(-10deg); }
.hover-3d > div:nth-child(5):hover ~ *:first-child { transform: rotateX(-10deg) rotateY(10deg); }
.hover-3d > div:nth-child(6):hover ~ *:first-child { transform: rotateX(0deg) rotateY(-15deg); }
.hover-3d > div:nth-child(7):hover ~ *:first-child { transform: rotateX(0deg) rotateY(-5deg); }
.hover-3d > div:nth-child(8):hover ~ *:first-child { transform: rotateX(0deg) rotateY(5deg); }
.hover-3d > div:nth-child(9):hover ~ *:first-child { transform: rotateX(0deg) rotateY(15deg); }

/* Flag Figure */
.flag-figure {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 10px 20px -5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.hover-3d:hover .flag-figure {
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.2),
    0 10px 10px -5px rgba(0, 0, 0, 0.1),
    0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

.flag-image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hover-3d:hover .flag-image {
  transform: scale(1.05);
}

.flag-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  text-align: center;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
}

.hover-3d:hover .flag-caption {
  opacity: 1;
  transform: translateY(0);
}

.flag-caption.forced-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (min-width: 640px) {
  .flag-caption {
    font-size: 0.75rem;
    padding: 0.75rem;
  }
}

/* Modal Enhancements */
.modal-box {
  max-height: 90vh;
  overflow-y: auto;
}

/* List Transitions */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}


</style>

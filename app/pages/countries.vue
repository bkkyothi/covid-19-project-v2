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

    <!-- Flags Grid -->
    <CountryGrid 
      v-else 
      :countries="filteredCountries" 
      :searchQuery="debouncedSearchQuery"
      @select="openCountryModal"
    />

    <!-- Country Detail Modal -->
    <CountryDetailModal ref="modalRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCovidStore } from '~/stores/useCovidStore';
import type { CountryData } from '~/models';
import Fuse from 'fuse.js';

import CountryGrid from '~/components/countries/CountryGrid.vue';
import CountryDetailModal from '~/components/countries/CountryDetailModal.vue';

// Store
const store = useCovidStore();

// State
const modalRef = ref<InstanceType<typeof CountryDetailModal> | null>(null);
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
  modalRef.value?.show(country);
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
</style>

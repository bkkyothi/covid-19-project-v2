<template>
  <div class="relative h-full w-full">
    <!-- Loading State -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-base-100 z-50">
      <div class="flex flex-col items-center gap-4">
        <span class="loading loading-infinity loading-lg text-primary"></span>
        <p class="text-base-content/70">Loading map data...</p>
      </div>
    </div>
    
    <!-- Map Container -->
    <div id="continents-map" class="h-full w-full z-0 bg-base-200"></div>

    <!-- Hover Info Panel -->
    <div 
      class="absolute bottom-6 left-6 p-6 rounded-2xl shadow-xl z-[400] w-80 border border-base-200 transition-all duration-300 transform bg-base-100/90 text-base-content backdrop-blur-md"
      :class="hoveredContinent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'"
    >
      <div v-if="hoveredContinent">
        <!-- Continent Header -->
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {{ hoveredContinent.name }}
        </h2>
        
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 gap-2">
          <!-- Cases -->
          <div class="bg-base-200/50 rounded-lg p-3">
            <div class="text-xs font-semibold text-warning uppercase tracking-wider mb-1">Total Cases</div>
            <div class="text-xl font-bold">{{ formatNumber(hoveredContinent.cases) }}</div>
            <div v-if="hoveredContinent.todayCases" class="text-xs text-warning/80 mt-1">
              +{{ formatNumber(hoveredContinent.todayCases) }} today
            </div>
          </div>

          <!-- Deaths -->
          <div class="bg-base-200/50 rounded-lg p-3">
            <div class="text-xs font-semibold text-error uppercase tracking-wider mb-1">Deaths</div>
            <div class="text-xl font-bold">{{ formatNumber(hoveredContinent.deaths) }}</div>
            <div v-if="hoveredContinent.todayDeaths" class="text-xs text-error/80 mt-1">
              +{{ formatNumber(hoveredContinent.todayDeaths) }} today
            </div>
          </div>

          <!-- Recovered -->
          <div class="bg-base-200/50 rounded-lg p-3">
            <div class="text-xs font-semibold text-success uppercase tracking-wider mb-1">Recovered</div>
            <div class="text-xl font-bold">{{ formatNumber(hoveredContinent.recovered) }}</div>
          </div>
        </div>
        
        <div class="mt-4 pt-3 border-t border-base-200 flex justify-between items-center text-xs opacity-70">
           <span>Population</span>
           <span class="font-mono">{{ formatNumber(hoveredContinent.population) }}</span>
        </div>
      </div>
    </div>
    <!-- Filter Active Indicator -->
    <div 
      v-if="store.selectedContinent"
      class="absolute top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-content px-6 py-3 rounded-full shadow-lg z-[400] flex items-center gap-4 animate-in fade-in slide-in-from-top-4"
    >
      <div class="flex flex-col">
        <span class="text-xs opacity-80 uppercase tracking-widest">Dashboad Filter</span>
        <span class="font-bold">{{ store.selectedContinent }}</span>
      </div>
      <div class="flex gap-2">
        <NuxtLink to="/" class="btn btn-sm btn-circle btn-ghost" title="Go to Dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </NuxtLink>
        <button @click="clearFilter" class="btn btn-sm btn-circle btn-ghost" title="Clear Filter">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue';
import { useCovidStore } from '~/stores/useCovidStore';
import type { ContinentData } from '~/models';

// Dynamic import for Leaflet (Client-side only)
let L: any;
let map: any;
let geoJsonLayer: any;
let tileLayer: any;

const store = useCovidStore();
const loading = ref(true);
const hoveredContinent = ref<ContinentData | null>(null);

// Local GeoJSON
const config = useRuntimeConfig();
const GEOJSON_URL = `${config.app.baseURL}continents.geo.json`;
const TILES_LIGHT = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png';
const TILES_DARK = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';

watch(() => store.isDarkMode, (isDark) => {
  if (tileLayer) {
    tileLayer.setUrl(isDark ? TILES_DARK : TILES_LIGHT);
  }
});

// Methods
function formatNumber(num: number): string {
  if (!num) return '0';
  return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
}


function matchContinent(geoName: string): ContinentData | undefined {
  if (!store.continents.data) return undefined;
  
  // Normalization map
  const nameMap: Record<string, string> = {
    'North America': 'North America',
    'South America': 'South America',
    'Asia': 'Asia',
    'Europe': 'Europe',
    'Africa': 'Africa',
    'Australia': 'Australia/Oceania',
    'Oceania': 'Australia/Oceania',
    'Antarctica': '' 
  };

  const targetName = nameMap[geoName] || geoName;
  return store.continents.data.find(c => c.name === targetName);
}

function clearFilter() {
  store.setSelectedContinent(null);
  // Reset map view
  if (map) {
    map.flyTo([20, 0], 2);
    // Reset styles
    geoJsonLayer.eachLayer((layer: any) => {
      geoJsonLayer.resetStyle(layer);
    });
  }
}

async function initMap() {
  if (!process.client) return;

  try {
    // Import Leaflet
    const leafletModule = await import('leaflet');
    L = leafletModule.default || leafletModule;
    await import('leaflet/dist/leaflet.css');

    // Fetch GeoJSON
    const response = await fetch(GEOJSON_URL);
    if (!response.ok) throw new Error('Failed to load map data');
    const geoData = await response.json();

    // Initialize Map
    map = L.map('continents-map', {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: false,
      attributionControl: false
    });

    // Add Tile Layer
    tileLayer = L.tileLayer(store.isDarkMode ? TILES_DARK : TILES_LIGHT, {
      maxZoom: 19
    }).addTo(map);

    // Style Function
    const style = (feature: any) => {
      const props = feature.properties;
      const continentName = props.continent || props.CONTINENT || props.name || props.NAME;
      const data = matchContinent(continentName);
      
      const isSelected = store.selectedContinent === data?.name;
      const fillColor = data ? data.color : '#cccccc';
      
      // If something is selected and this is NOT it, fade it out
      const opacity = store.selectedContinent && !isSelected ? 0.3 : 1;
      const fillOpacity = store.selectedContinent && !isSelected ? 0.2 : 0.6;
      
      return {
        fillColor: fillColor,
        weight: isSelected ? 2 : 1,
        opacity: opacity,
        color: isSelected ? 'white' : 'white',
        dashArray: isSelected ? '' : '3',
        fillOpacity: isSelected ? 0.8 : fillOpacity
      };
    };

    // Interactions
    const onEachFeature = (feature: any, layer: any) => {
      const props = feature.properties;
      const continentName = props.continent || props.CONTINENT || props.name || props.NAME;
      const data = matchContinent(continentName);

      layer.on({
        mouseover: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            weight: 2,
            color: '#fff',
            dashArray: '',
            fillOpacity: 0.9
          });
          layer.bringToFront();
          
          if (data) {
            hoveredContinent.value = data;
          }
        },
        mouseout: (e: any) => {
          geoJsonLayer.resetStyle(e.target);
          hoveredContinent.value = null;
        },
        click: (e: any) => {
          if (data) {
             store.setSelectedContinent(data.name);
             map.flyToBounds(e.target.getBounds(), {
               padding: [50, 50],
               duration: 1.5,
               easeLinearity: 0.5
             });
             
             // Force style update
             geoJsonLayer.eachLayer((l: any) => geoJsonLayer.resetStyle(l));
          }
        }
      });
    };

    // Add GeoJSON Layer
    geoJsonLayer = L.geoJson(geoData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);

    loading.value = false;

  } catch (error) {
    console.error('Error initializing map:', error);
    loading.value = false;
  }
}

onMounted(async () => {
  // Ensure we have data
  if (!store.continents.data) {
    await store.fetchContinents();
  }
  
  await initMap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
:deep(.leaflet-interactive) {
  transition: all 0.2s ease;
  cursor: pointer;
}
</style>

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
    <div id="vaccine-map" class="h-full w-full z-0 bg-base-200"></div>

    <!-- Legend -->
    <div class="absolute bottom-6 left-6 z-[35] bg-base-100/90 p-4 rounded-xl shadow-lg border border-base-200 backdrop-blur-md">
       <div class="flex items-center gap-2 mb-2">
         <span class="text-xs font-bold uppercase">Total Doses</span>
       </div>
       <div class="flex items-center gap-2">
          <span class="text-xs">{{ formatNumber(minVal) }}</span>
          <div class="w-32 h-4 bg-gradient-to-r from-[#d1fae5] to-[#065f46] rounded"></div>
          <span class="text-xs">{{ formatNumber(maxVal) }}</span>
       </div>
    </div>

    <!-- Hover Info Panel (Tooltip Custom) -->
    <div 
      v-if="hoveredCountry"
      class="absolute top-6 right-6 p-4 rounded-xl shadow-xl z-[35] w-64 border border-base-200 bg-base-100/90 backdrop-blur-md transition-all duration-200"
    >
        <h3 class="font-bold text-lg mb-1">{{ hoveredCountry.countryName }}</h3>
        <div class="text-xs opacity-70 uppercase mb-2">Vaccines rolled out</div>
        <div class="text-2xl font-bold text-success">{{ formatNumber(hoveredCountry.totalVaccinated) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
import { useCovidStore } from '~/stores/useCovidStore';
import { useThemeStore } from '~/stores/useThemeStore';
import type { VaccineCoverage } from '~/models';

// Leaflet types
let L: any;
let map: any;
let geoJsonLayer: any;
let tileLayer: any;

const store = useCovidStore();
const themeStore = useThemeStore();
const loading = ref(true);
const hoveredCountry = ref<VaccineCoverage | null>(null);

// GeoJSON Source (Using a public stable source for country boundaries)
// Using low res (110m) for performance
const GEOJSON_URL = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';
const TILES_LIGHT = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png';
const TILES_DARK = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';

// Color Scale
// Using generic greens tailored for map
const minVal = computed(() => {
    if (!store.vaccineCountries.data?.length) return 0;
    return Math.min(...store.vaccineCountries.data.map(c => c.totalVaccinated));
});

const maxVal = computed(() => {
    if (!store.vaccineCountries.data?.length) return 1000000;
    return Math.max(...store.vaccineCountries.data.map(c => c.totalVaccinated));
});

function getColor(d: number) {
    // Logarithmic scale for better distribution
    // colors: #d1fae5 (100), #a7f3d0 (200), #6ee7b7 (300), #34d399 (400), #10b981 (500), #059669 (600), #047857 (700), #065f46 (800), #064e3b (900)
    // Simplified 5-step
    const max = maxVal.value || 1;
    const logMax = Math.log(max);
    const logVal = Math.log(d || 1);
    const ratio = logVal / logMax;

    if (d === 0) return '#f3f4f6'; // gray-100
    if (ratio < 0.4) return '#d1fae5';
    if (ratio < 0.5) return '#6ee7b7';
    if (ratio < 0.6) return '#34d399';
    if (ratio < 0.7) return '#10b981';
    if (ratio < 0.8) return '#059669';
    return '#064e3b'; // darkest green
}

function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
}

// Name matching helper
function matchCountry(geoName: string): VaccineCoverage | undefined {
    if (!store.vaccineCountries.data) return undefined;
    
    // Normalize logic
    const normalizedGeo = geoName.toLowerCase();
    
    return store.vaccineCountries.data.find(c => {
        const cName = c.countryName?.toLowerCase() || '';
        if (cName === normalizedGeo) return true;
        // Common mismatches
        if (normalizedGeo === 'united states of america' && cName === 'usa') return true;
        if (normalizedGeo === 'united kingdom' && cName === 'uk') return true;
        if (cName.includes(normalizedGeo) || normalizedGeo.includes(cName)) return true;
        return false;
    });
}

watch(() => themeStore.isDark, (isDark) => {
    if (tileLayer) {
        tileLayer.setUrl(isDark ? TILES_DARK : TILES_LIGHT);
    }
});

async function initMap() {
    if (!process.client) return;
    
    try {
        const leafletModule = await import('leaflet');
        L = leafletModule.default || leafletModule;
        await import('leaflet/dist/leaflet.css');

        // Fetch GeoJSON
        const response = await fetch(GEOJSON_URL);
        if (!response.ok) throw new Error('Failed to load map data');
        const geoData = await response.json();

        map = L.map('vaccine-map', {
            center: [20, 0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 6,
            zoomControl: false,
            attributionControl: false
        });

        tileLayer = L.tileLayer(themeStore.isDark ? TILES_DARK : TILES_LIGHT, {
            maxZoom: 19
        }).addTo(map);

        // Style
        const style = (feature: any) => {
            const data = matchCountry(feature.properties.name);
            const value = data ? data.totalVaccinated : 0;
            return {
                fillColor: getColor(value),
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        };

        const onEachFeature = (feature: any, layer: any) => {
             const data = matchCountry(feature.properties.name);
             
             layer.on({
                 mouseover: (e: any) => {
                     const layer = e.target;
                     layer.setStyle({
                         weight: 2,
                         color: '#666',
                         dashArray: '',
                         fillOpacity: 0.9
                     });
                     layer.bringToFront();
                     if (data) hoveredCountry.value = data;
                 },
                 mouseout: (e: any) => {
                     geoJsonLayer.resetStyle(e.target);
                     hoveredCountry.value = null;
                 },
                 click: (e: any) => {
                     map.flyToBounds(e.target.getBounds());
                 }
             });
        };

        geoJsonLayer = L.geoJson(geoData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
        
        loading.value = false;

    } catch (e) {
        console.error("Map init failed", e);
        loading.value = false;
    }
}

onMounted(async () => {
    // Ensure data
    if (!store.vaccineCountries.data) {
        await store.fetchVaccineCountries();
    }
    await initMap();
});

onUnmounted(() => {
    if (map) map.remove();
});
</script>

<style scoped>
:deep(.leaflet-interactive) {
  transition: fill-opacity 0.2s ease;
}
</style>

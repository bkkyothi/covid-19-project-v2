import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { covidService } from '~/services';
import type {
    GlobalSummary,
    HistoricalData,
    CountryData,
    ContinentData,
    VaccineCoverage,
    StateData,
} from '~/models';
import type { ApiState } from '~/types/common';
import { createApiState, createLoadingState, createSuccessState, createErrorState } from '~/types/common';

/**
 * useCovidStore
 * Pinia store for centralized COVID-19 data state management
 */
export const useCovidStore = defineStore('covid', () => {
    // ============ State ============

    const globalSummary = ref<ApiState<GlobalSummary>>(createApiState());
    const historicalData = ref<ApiState<HistoricalData>>(createApiState());
    const countries = ref<ApiState<CountryData[]>>(createApiState());
    const continents = ref<ApiState<ContinentData[]>>(createApiState());
    const vaccineCoverage = ref<ApiState<VaccineCoverage>>(createApiState());
    const states = ref<ApiState<StateData[]>>(createApiState());

    // UI State
    const isDarkMode = ref(true);
    const lastUpdated = ref<Date | null>(null);

    // ============ Computed ============

    const isLoading = computed(() => {
        return (
            globalSummary.value.loading ||
            historicalData.value.loading ||
            countries.value.loading ||
            continents.value.loading
        );
    });

    const hasError = computed(() => {
        return !!(
            globalSummary.value.error ||
            historicalData.value.error ||
            countries.value.error ||
            continents.value.error
        );
    });

    const topCountries = computed(() => {
        if (!countries.value.data) return [];
        return [...countries.value.data].sort((a, b) => b.cases - a.cases).slice(0, 10);
    });

    const sortedContinents = computed(() => {
        if (!continents.value.data) return [];
        return [...continents.value.data].sort((a, b) => b.cases - a.cases);
    });

    // ============ Actions ============

    /**
     * Fetch global summary
     */
    async function fetchGlobalSummary(): Promise<void> {
        globalSummary.value = createLoadingState();
        const result = await covidService.getGlobalSummary();
        globalSummary.value = result;
        if (result.data) {
            lastUpdated.value = result.data.updatedAt;
        }
    }

    /**
     * Fetch historical data
     */
    async function fetchHistoricalData(lastDays: number | 'all' = 'all'): Promise<void> {
        historicalData.value = createLoadingState();
        const result = await covidService.getHistoricalAll(lastDays);
        historicalData.value = result;
    }

    /**
     * Fetch all countries
     */
    async function fetchCountries(): Promise<void> {
        countries.value = createLoadingState();
        const result = await covidService.getCountries();
        countries.value = result;
    }

    /**
     * Fetch all continents
     */
    async function fetchContinents(): Promise<void> {
        continents.value = createLoadingState();
        const result = await covidService.getContinents();
        continents.value = result;
    }

    /**
     * Fetch vaccine coverage
     */
    async function fetchVaccineCoverage(lastDays: number | 'all' = 'all'): Promise<void> {
        vaccineCoverage.value = createLoadingState();
        const result = await covidService.getVaccineCoverage(lastDays);
        vaccineCoverage.value = result;
    }

    /**
     * Fetch US states
     */
    async function fetchStates(): Promise<void> {
        states.value = createLoadingState();
        const result = await covidService.getStates();
        states.value = result;
    }

    /**
     * Fetch all dashboard data
     */
    async function fetchDashboardData(): Promise<void> {
        await Promise.all([
            fetchGlobalSummary(),
            fetchHistoricalData(),
            fetchCountries(),
            fetchContinents(),
        ]);
    }

    /**
     * Refresh all data (clear cache and refetch)
     */
    async function refreshData(): Promise<void> {
        covidService.clearCache();
        await fetchDashboardData();
    }

    /**
     * Toggle dark mode
     */
    function toggleDarkMode(): void {
        isDarkMode.value = !isDarkMode.value;
    }

    /**
     * Set dark mode
     */
    function setDarkMode(value: boolean): void {
        isDarkMode.value = value;
    }

    // ============ Return ============

    return {
        // State
        globalSummary,
        historicalData,
        countries,
        continents,
        vaccineCoverage,
        states,
        isDarkMode,
        lastUpdated,

        // Computed
        isLoading,
        hasError,
        topCountries,
        sortedContinents,

        // Actions
        fetchGlobalSummary,
        fetchHistoricalData,
        fetchCountries,
        fetchContinents,
        fetchVaccineCoverage,
        fetchStates,
        fetchDashboardData,
        refreshData,
        toggleDarkMode,
        setDarkMode,
    };
});

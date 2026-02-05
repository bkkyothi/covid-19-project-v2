import { apiService } from './ApiService';
import { cacheService } from './CacheService';
import {
    GlobalSummaryMapper,
    HistoricalDataMapper,
    CountryDataMapper,
    ContinentDataMapper,
    VaccineCoverageMapper,
    StateDataMapper,
} from '~/mappers';
import type {
    GlobalSummaryResponse,
    HistoricalResponse,
    CountryResponse,
    ContinentResponse,
    StateResponse,
    VaccineCoverageResponse,
    VaccineCountryCoverageResponse,
} from '~/types/api';
import type { ApiState } from '~/types/common';
import {
    GlobalSummary,
    HistoricalData,
    CountryData,
    ContinentData,
    VaccineCoverage,
    StateData,
} from '~/models';

/**
 * CovidService
 * Domain service for COVID-19 data operations
 * Uses ApiService for requests, CacheService for caching
 * Returns Model instances (not raw JSON)
 */
export class CovidService {
    private cacheTTL = 5 * 60 * 1000; // 5 minutes

    // ============ Global Summary ============

    /**
     * Get global COVID-19 summary
     */
    async getGlobalSummary(): Promise<ApiState<GlobalSummary>> {
        const cacheKey = 'global_summary';

        try {
            // Check cache first
            const cached = cacheService.get<GlobalSummary>(cacheKey);
            if (cached) {
                return { data: cached, loading: false, error: null };
            }

            const raw = await apiService.get<GlobalSummaryResponse>('/v3/covid-19/all');
            const model = GlobalSummaryMapper.toModel(raw);

            // Cache the model
            cacheService.set(cacheKey, model, this.cacheTTL);

            return { data: model, loading: false, error: null };
        } catch (error) {
            return { data: null, loading: false, error: this.getErrorMessage(error) };
        }
    }

    // ============ Historical Data ============

    /**
     * Get historical data for all countries
     */
    async getHistoricalAll(lastDays: number | 'all' = 'all'): Promise<ApiState<HistoricalData>> {
        const cacheKey = `historical_all_${lastDays}`;

        try {
            const cached = cacheService.get<HistoricalData>(cacheKey);
            if (cached) {
                return { data: cached, loading: false, error: null };
            }

            const raw = await apiService.get<HistoricalResponse>('/v3/covid-19/historical/all', {
                lastdays: lastDays,
            });
            const model = HistoricalDataMapper.toModel(raw);

            cacheService.set(cacheKey, model, this.cacheTTL);

            return { data: model, loading: false, error: null };
        } catch (error) {
            return { data: null, loading: false, error: this.getErrorMessage(error) };
        }
    }

    // ============ Countries ============

    /**
     * Get all countries data
     */
    async getCountries(): Promise<ApiState<CountryData[]>> {
        const cacheKey = 'countries';

        try {
            const cached = cacheService.get<CountryData[]>(cacheKey);
            if (cached) {
                return { data: cached, loading: false, error: null };
            }

            const raw = await apiService.get<CountryResponse[]>('/v3/covid-19/countries');
            const models = CountryDataMapper.toModels(raw);

            cacheService.set(cacheKey, models, this.cacheTTL);

            return { data: models, loading: false, error: null };
        } catch (error) {
            return { data: null, loading: false, error: this.getErrorMessage(error) };
        }
    }

    /**
     * Get specific country data
     */
    async getCountry(country: string): Promise<ApiState<CountryData>> {
        const cacheKey = `country_${country}`;

        try {
            const cached = cacheService.get<CountryData>(cacheKey);
            if (cached) {
                return { data: cached, loading: false, error: null };
            }

            const raw = await apiService.get<CountryResponse>(`/v3/covid-19/countries/${country}`);
            const model = CountryDataMapper.toModel(raw);

            cacheService.set(cacheKey, model, this.cacheTTL);

            return { data: model, loading: false, error: null };
        } catch (error) {
            return { data: null, loading: false, error: this.getErrorMessage(error) };
        }
    }

    /**
     * Get top countries by cases
     */
    async getTopCountries(limit: number = 10): Promise<ApiState<CountryData[]>> {
        const result = await this.getCountries();

        if (result.error || !result.data) {
            return result;
        }

        const sorted = CountryDataMapper.sortByCases(result.data, limit);
        return { data: sorted, loading: false, error: null };
    }

    // ============ Continents ============

    /**
     * Get all continents data
     */
    async getContinents(): Promise<ApiState<ContinentData[]>> {
        const cacheKey = 'continents';

        try {
            const cached = cacheService.get<ContinentData[]>(cacheKey);
            if (cached) {
                return { data: cached, loading: false, error: null };
            }

            const raw = await apiService.get<ContinentResponse[]>('/v3/covid-19/continents');
            const models = ContinentDataMapper.toModels(raw);

            cacheService.set(cacheKey, models, this.cacheTTL);

            return { data: models, loading: false, error: null };
        } catch (error) {
            return { data: null, loading: false, error: this.getErrorMessage(error) };
        }
    }

    /**
     * Get specific continent data
     */
    async getContinent(continent: string): Promise<ApiState<ContinentData>> {
        const cacheKey = `continent_${continent}`;

        try {
            const cached = cacheService.get<ContinentData>(cacheKey);
            if (cached) {
                return { data: cached, loading: false, error: null };
            }

            const raw = await apiService.get<ContinentResponse>(`/v3/covid-19/continents/${continent}`);
            const model = ContinentDataMapper.toModel(raw);

            cacheService.set(cacheKey, model, this.cacheTTL);

            return { data: model, loading: false, error: null };
        } catch (error) {
            return { data: null, loading: false, error: this.getErrorMessage(error) };
        }
    }

    // ============ US States ============

    /**
     * Get all US states data
     */
    async getStates(): Promise<ApiState<StateData[]>> {
        const cacheKey = 'states';

        try {
            const cached = cacheService.get<StateData[]>(cacheKey);
            if (cached) {
                return { data: cached, loading: false, error: null };
            }

            const raw = await apiService.get<StateResponse[]>('/v3/covid-19/states');
            const models = StateDataMapper.toModels(raw);

            cacheService.set(cacheKey, models, this.cacheTTL);

            return { data: models, loading: false, error: null };
        } catch (error) {
            return { data: null, loading: false, error: this.getErrorMessage(error) };
        }
    }

    /**
     * Get specific US state data
     */
    async getState(state: string): Promise<ApiState<StateData>> {
        const cacheKey = `state_${state}`;

        try {
            const cached = cacheService.get<StateData>(cacheKey);
            if (cached) {
                return { data: cached, loading: false, error: null };
            }

            const raw = await apiService.get<StateResponse>(`/v3/covid-19/states/${state}`);
            const model = StateDataMapper.toModel(raw);

            cacheService.set(cacheKey, model, this.cacheTTL);

            return { data: model, loading: false, error: null };
        } catch (error) {
            return { data: null, loading: false, error: this.getErrorMessage(error) };
        }
    }

    // ============ Vaccine ============

    /**
     * Get global vaccine coverage
     */
    async getVaccineCoverage(lastDays: number | 'all' = 'all'): Promise<ApiState<VaccineCoverage>> {
        const cacheKey = `vaccine_coverage_${lastDays}`;

        try {
            const cached = cacheService.get<VaccineCoverage>(cacheKey);
            if (cached) {
                return { data: cached, loading: false, error: null };
            }

            const raw = await apiService.get<VaccineCoverageResponse>('/v3/covid-19/vaccine/coverage', {
                lastdays: lastDays,
            });
            const model = VaccineCoverageMapper.toModel(raw);

            cacheService.set(cacheKey, model, this.cacheTTL);

            return { data: model, loading: false, error: null };
        } catch (error) {
            return { data: null, loading: false, error: this.getErrorMessage(error) };
        }
    }

    /**
     * Get vaccine coverage by country
     */
    async getVaccineCoverageByCountry(country: string): Promise<ApiState<VaccineCoverage>> {
        const cacheKey = `vaccine_coverage_country_${country}`;

        try {
            const cached = cacheService.get<VaccineCoverage>(cacheKey);
            if (cached) {
                return { data: cached, loading: false, error: null };
            }

            const raw = await apiService.get<VaccineCountryCoverageResponse>(
                `/v3/covid-19/vaccine/coverage/countries/${country}`
            );
            const model = VaccineCoverageMapper.fromCountryResponse(raw);

            cacheService.set(cacheKey, model, this.cacheTTL);

            return { data: model, loading: false, error: null };
        } catch (error) {
            return { data: null, loading: false, error: this.getErrorMessage(error) };
        }
    }

    // ============ Utilities ============

    /**
     * Clear all cached data
     */
    clearCache(): void {
        cacheService.clear();
    }

    /**
     * Extract error message
     */
    private getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }
        return 'An unknown error occurred';
    }
}

// Singleton instance
export const covidService = new CovidService();

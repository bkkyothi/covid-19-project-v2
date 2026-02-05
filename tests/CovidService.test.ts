import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CovidService } from '../app/services/CovidService';
import { apiService } from '../app/services/ApiService';
import { cacheService } from '../app/services/CacheService';
import type { GlobalSummaryResponse, CountryResponse } from '../app/types/api';

// Mock the services
vi.mock('../app/services/ApiService', () => ({
    apiService: {
        get: vi.fn(),
    },
}));

vi.mock('../app/services/CacheService', () => ({
    cacheService: {
        get: vi.fn(),
        set: vi.fn(),
        has: vi.fn(),
        clear: vi.fn(),
    },
}));

describe('CovidService', () => {
    let service: CovidService;

    // Mock data
    const mockGlobalSummary: GlobalSummaryResponse = {
        updated: Date.now(),
        cases: 500000000,
        todayCases: 100000,
        deaths: 6000000,
        todayDeaths: 1000,
        recovered: 450000000,
        todayRecovered: 80000,
        active: 44000000,
        critical: 50000,
        casesPerOneMillion: 64000,
        deathsPerOneMillion: 770,
        tests: 5000000000,
        testsPerOneMillion: 640000,
        population: 7800000000,
        oneCasePerPeople: 16,
        oneDeathPerPeople: 1300,
        oneTestPerPeople: 2,
        activePerOneMillion: 5600,
        recoveredPerOneMillion: 58000,
        criticalPerOneMillion: 6,
        affectedCountries: 230,
    };

    const mockCountry: CountryResponse = {
        updated: Date.now(),
        country: 'USA',
        countryInfo: {
            _id: 840,
            iso2: 'US',
            iso3: 'USA',
            lat: 38,
            long: -97,
            flag: 'https://disease.sh/assets/img/flags/us.png',
        },
        cases: 100000000,
        todayCases: 50000,
        deaths: 1000000,
        todayDeaths: 500,
        recovered: 95000000,
        todayRecovered: 40000,
        active: 4000000,
        critical: 5000,
        casesPerOneMillion: 300000,
        deathsPerOneMillion: 3000,
        tests: 1000000000,
        testsPerOneMillion: 3000000,
        population: 330000000,
        continent: 'North America',
        oneCasePerPeople: 3,
        oneDeathPerPeople: 330,
        oneTestPerPeople: 1,
        activePerOneMillion: 12000,
        recoveredPerOneMillion: 285000,
        criticalPerOneMillion: 15,
    };

    beforeEach(() => {
        service = new CovidService();
        vi.clearAllMocks();
        // Reset cache mock to return null by default
        vi.mocked(cacheService.get).mockReturnValue(null);
    });

    describe('getGlobalSummary', () => {
        it('should fetch global summary and return model', async () => {
            vi.mocked(apiService.get).mockResolvedValue(mockGlobalSummary);

            const result = await service.getGlobalSummary();

            expect(result.error).toBeNull();
            expect(result.loading).toBe(false);
            expect(result.data).toBeDefined();
            expect(result.data?.totalCases).toBe(mockGlobalSummary.cases);
            expect(result.data?.totalDeaths).toBe(mockGlobalSummary.deaths);
        });

        it('should return cached data if available', async () => {
            const cachedModel = { totalCases: 500000000 };
            vi.mocked(cacheService.get).mockReturnValue(cachedModel);

            const result = await service.getGlobalSummary();

            expect(apiService.get).not.toHaveBeenCalled();
            expect(result.data).toBe(cachedModel);
        });

        it('should handle errors gracefully', async () => {
            vi.mocked(apiService.get).mockRejectedValue(new Error('Network error'));

            const result = await service.getGlobalSummary();

            expect(result.data).toBeNull();
            expect(result.error).toBe('Network error');
            expect(result.loading).toBe(false);
        });
    });

    describe('getCountries', () => {
        it('should fetch countries and return model array', async () => {
            vi.mocked(apiService.get).mockResolvedValue([mockCountry]);

            const result = await service.getCountries();

            expect(result.error).toBeNull();
            expect(result.data).toHaveLength(1);
            expect(result.data?.[0].name).toBe('USA');
        });

        it('should cache the fetched countries', async () => {
            vi.mocked(apiService.get).mockResolvedValue([mockCountry]);

            await service.getCountries();

            expect(cacheService.set).toHaveBeenCalled();
        });
    });

    describe('getTopCountries', () => {
        it('should return top countries sorted by cases', async () => {
            const countries = [
                { ...mockCountry, country: 'USA', cases: 100000000 },
                { ...mockCountry, country: 'India', cases: 50000000 },
                { ...mockCountry, country: 'Brazil', cases: 75000000 },
            ];
            vi.mocked(apiService.get).mockResolvedValue(countries);

            const result = await service.getTopCountries(2);

            expect(result.data).toHaveLength(2);
            expect(result.data?.[0].name).toBe('USA');
            expect(result.data?.[1].name).toBe('Brazil');
        });
    });

    describe('clearCache', () => {
        it('should clear the cache', () => {
            service.clearCache();

            expect(cacheService.clear).toHaveBeenCalled();
        });
    });
});

import type { CountryResponse } from '~/types/api';
import { CountryData } from '~/models';

/**
 * CountryDataMapper
 * Transforms API response to CountryData model
 */
export class CountryDataMapper {
    /**
     * Convert raw response to model instance
     */
    static toModel(raw: CountryResponse): CountryData {
        return new CountryData(raw);
    }

    /**
     * Convert array of raw responses to model array
     */
    static toModels(rawList: CountryResponse[]): CountryData[] {
        return rawList.map((raw) => this.toModel(raw));
    }

    /**
     * Sort countries by cases descending
     */
    static sortByCases(countries: CountryData[], limit?: number): CountryData[] {
        const sorted = [...countries].sort((a, b) => b.cases - a.cases);
        return limit ? sorted.slice(0, limit) : sorted;
    }

    /**
     * Sort countries by deaths descending
     */
    static sortByDeaths(countries: CountryData[], limit?: number): CountryData[] {
        const sorted = [...countries].sort((a, b) => b.deaths - a.deaths);
        return limit ? sorted.slice(0, limit) : sorted;
    }
}

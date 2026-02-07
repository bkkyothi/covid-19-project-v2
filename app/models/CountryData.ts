import type { CountryResponse, CountryInfo } from '~/types/api';
import type { LabeledValue } from '~/types/common';

/**
 * CountryData Model
 * Wraps country-specific COVID data with helper methods
 */
export class CountryData {
    constructor(public readonly raw: CountryResponse) { }

    // ============ Basic Getters ============

    get name(): string {
        return this.raw.country;
    }

    get info(): CountryInfo {
        return this.raw.countryInfo;
    }

    get flagUrl(): string {
        return this.raw.countryInfo.flag;
    }

    get iso2(): string {
        return this.raw.countryInfo.iso2;
    }

    get iso3(): string {
        return this.raw.countryInfo.iso3;
    }

    get continent(): string {
        return this.raw.continent;
    }

    get cases(): number {
        return this.raw.cases;
    }

    get deaths(): number {
        return this.raw.deaths;
    }

    get recovered(): number {
        return this.raw.recovered;
    }

    get active(): number {
        return this.raw.active;
    }

    get critical(): number {
        return this.raw.critical;
    }

    get todayCases(): number {
        return this.raw.todayCases;
    }

    get todayDeaths(): number {
        return this.raw.todayDeaths;
    }

    get todayRecovered(): number {
        return this.raw.todayRecovered;
    }

    get tests(): number {
        return this.raw.tests;
    }

    get population(): number {
        return this.raw.population;
    }

    get updatedAt(): Date {
        return new Date(this.raw.updated);
    }

    // ============ Computed Properties ============

    get casesPerMillion(): number {
        return this.raw.casesPerOneMillion;
    }

    get deathsPerMillion(): number {
        return this.raw.deathsPerOneMillion;
    }

    get testsPerMillion(): number {
        return this.raw.testsPerOneMillion;
    }

    get fatalityRate(): number {
        if (this.raw.cases === 0) return 0;
        return (this.raw.deaths / this.raw.cases) * 100;
    }

    get recoveryRate(): number {
        if (this.raw.cases === 0) return 0;
        return (this.raw.recovered / this.raw.cases) * 100;
    }

    get fatalityClass(): string {
        const rate = this.fatalityRate;
        if (rate >= 3) return 'text-error';
        if (rate >= 2) return 'text-warning';
        return 'text-success';
    }

    get coordinates(): { lat: number; lng: number } {
        return {
            lat: this.raw.countryInfo.lat,
            lng: this.raw.countryInfo.long,
        };
    }

    // ============ Helper Methods ============

    /**
     * Convert to summary card data
     */
    toCard(): LabeledValue<number>[] {
        return [
            { label: 'Cases', value: this.cases },
            { label: 'Deaths', value: this.deaths },
            { label: 'Recovered', value: this.recovered },
            { label: 'Active', value: this.active },
        ];
    }

    /**
     * Convert to table row data
     */
    toTableRow(): Record<string, string | number> {
        return {
            country: this.name,
            flag: this.flagUrl,
            cases: this.cases,
            deaths: this.deaths,
            recovered: this.recovered,
            active: this.active,
            fatalityRate: this.fatalityRate.toFixed(2) + '%',
        };
    }

    /**
     * Format number with commas
     */
    formatNumber(value: number): string {
        return value.toLocaleString('en-US');
    }

    /**
     * Get raw response data
     */
    getRaw(): CountryResponse {
        return this.raw;
    }
}

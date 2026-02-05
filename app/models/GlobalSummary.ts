import type { GlobalSummaryResponse } from '~/types/api';
import type { LabeledValue } from '~/types/common';

/**
 * GlobalSummary Model
 * Wraps raw API response with computed properties and helper methods
 */
export class GlobalSummary {
    constructor(private raw: GlobalSummaryResponse) { }

    // ============ Basic Getters ============

    get totalCases(): number {
        return this.raw.cases;
    }

    get totalDeaths(): number {
        return this.raw.deaths;
    }

    get totalRecovered(): number {
        return this.raw.recovered;
    }

    get activeCases(): number {
        return this.raw.active;
    }

    get criticalCases(): number {
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

    get totalTests(): number {
        return this.raw.tests;
    }

    get population(): number {
        return this.raw.population;
    }

    get affectedCountries(): number {
        return this.raw.affectedCountries;
    }

    get updatedAt(): Date {
        return new Date(this.raw.updated);
    }

    // ============ Computed Properties ============

    /**
     * Fatality rate (deaths / cases * 100)
     */
    get fatalityRate(): number {
        if (this.raw.cases === 0) return 0;
        return (this.raw.deaths / this.raw.cases) * 100;
    }

    /**
     * Recovery rate (recovered / cases * 100)
     */
    get recoveryRate(): number {
        if (this.raw.cases === 0) return 0;
        return (this.raw.recovered / this.raw.cases) * 100;
    }

    /**
     * Active rate (active / cases * 100)
     */
    get activeRate(): number {
        if (this.raw.cases === 0) return 0;
        return (this.raw.active / this.raw.cases) * 100;
    }

    /**
     * Cases per million population
     */
    get casesPerMillion(): number {
        return this.raw.casesPerOneMillion;
    }

    /**
     * Deaths per million population
     */
    get deathsPerMillion(): number {
        return this.raw.deathsPerOneMillion;
    }

    // ============ Helper Methods ============

    /**
     * Convert to summary card data array
     */
    toCard(): LabeledValue<number>[] {
        return [
            { label: 'Total Cases', value: this.totalCases },
            { label: 'Deaths', value: this.totalDeaths },
            { label: 'Recovered', value: this.totalRecovered },
            { label: 'Active', value: this.activeCases },
        ];
    }

    /**
     * Convert to today's stats card data
     */
    toTodayCard(): LabeledValue<number>[] {
        return [
            { label: 'New Cases', value: this.todayCases },
            { label: 'New Deaths', value: this.todayDeaths },
            { label: 'New Recovered', value: this.todayRecovered },
        ];
    }

    /**
     * Format number with commas
     */
    formatNumber(value: number): string {
        return value.toLocaleString('en-US');
    }

    /**
     * Get formatted cases string
     */
    getFormattedCases(): string {
        return this.formatNumber(this.totalCases);
    }

    /**
     * Get formatted deaths string
     */
    getFormattedDeaths(): string {
        return this.formatNumber(this.totalDeaths);
    }

    /**
     * Get raw response data
     */
    getRaw(): GlobalSummaryResponse {
        return this.raw;
    }
}

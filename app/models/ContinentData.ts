import type { ContinentResponse } from '~/types/api';
import type { LabeledValue } from '~/types/common';

/**
 * ContinentData Model
 * Wraps continent-specific COVID data
 */
export class ContinentData {
    constructor(private raw: ContinentResponse) { }

    // ============ Basic Getters ============

    get name(): string {
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

    get tests(): number {
        return this.raw.tests;
    }

    get population(): number {
        return this.raw.population;
    }

    get countries(): string[] {
        return this.raw.countries;
    }

    get countriesCount(): number {
        return this.raw.countries.length;
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

    get fatalityRate(): number {
        if (this.raw.cases === 0) return 0;
        return (this.raw.deaths / this.raw.cases) * 100;
    }

    get recoveryRate(): number {
        if (this.raw.cases === 0) return 0;
        return (this.raw.recovered / this.raw.cases) * 100;
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
            { label: 'Countries', value: this.countriesCount },
        ];
    }

    /**
     * Convert to pie chart data item
     */
    toPieData(): { label: string; value: number } {
        return {
            label: this.name,
            value: this.cases,
        };
    }

    /**
     * Get raw response data
     */
    getRaw(): ContinentResponse {
        return this.raw;
    }
}

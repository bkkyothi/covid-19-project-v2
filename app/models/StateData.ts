import type { StateResponse } from '~/types/api';
import type { LabeledValue } from '~/types/common';

/**
 * StateData Model
 * Wraps US state COVID data
 */
export class StateData {
    constructor(private raw: StateResponse) { }

    // ============ Basic Getters ============

    get name(): string {
        return this.raw.state;
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
     * Convert to table row
     */
    toTableRow(): Record<string, string | number> {
        return {
            state: this.name,
            cases: this.cases,
            deaths: this.deaths,
            active: this.active,
            fatalityRate: this.fatalityRate.toFixed(2) + '%',
        };
    }

    /**
     * Get raw response data
     */
    getRaw(): StateResponse {
        return this.raw;
    }
}

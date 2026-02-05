import type { VaccineCoverageResponse, VaccineCountryCoverageResponse } from '~/types/api';

/**
 * VaccineCoverage Model
 * Wraps vaccine coverage timeline data
 */
export class VaccineCoverage {
    private country?: string;

    constructor(
        private timeline: VaccineCoverageResponse,
        country?: string
    ) {
        this.country = country;
    }

    // ============ Basic Getters ============

    get countryName(): string | undefined {
        return this.country;
    }

    get dates(): string[] {
        return Object.keys(this.timeline);
    }

    get latestDate(): string {
        const dates = this.dates;
        return dates[dates.length - 1];
    }

    get latestCount(): number {
        return this.timeline[this.latestDate] || 0;
    }

    get firstDate(): string {
        return this.dates[0];
    }

    get firstCount(): number {
        return this.timeline[this.firstDate] || 0;
    }

    get totalVaccinated(): number {
        return this.latestCount;
    }

    // ============ Transformation Methods ============

    /**
     * Convert to timeseries format for charts
     */
    toTimeseriesSeries(): { x: number; y: number }[] {
        return this.dates.map((dateStr) => ({
            x: new Date(dateStr).getTime(),
            y: this.timeline[dateStr] || 0,
        }));
    }

    /**
     * Get daily vaccinations (difference from previous day)
     */
    getDailyVaccinations(): { x: number; y: number }[] {
        const dates = this.dates;
        const result: { x: number; y: number }[] = [];

        for (let i = 1; i < dates.length; i++) {
            const prevCount = this.timeline[dates[i - 1]] || 0;
            const currCount = this.timeline[dates[i]] || 0;
            result.push({
                x: new Date(dates[i]).getTime(),
                y: Math.max(0, currCount - prevCount),
            });
        }

        return result;
    }

    /**
     * Filter by last N days
     */
    filterByDays(days: number): VaccineCoverage {
        const allDates = this.dates;
        const filteredDates = allDates.slice(-days);

        const filteredTimeline: VaccineCoverageResponse = {};
        filteredDates.forEach((date) => {
            filteredTimeline[date] = this.timeline[date];
        });

        return new VaccineCoverage(filteredTimeline, this.country);
    }

    /**
     * Create from country coverage response
     */
    static fromCountryResponse(response: VaccineCountryCoverageResponse): VaccineCoverage {
        return new VaccineCoverage(response.timeline, response.country);
    }

    /**
     * Get raw timeline data
     */
    getRaw(): VaccineCoverageResponse {
        return this.timeline;
    }
}

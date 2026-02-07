import type { HistoricalResponse } from '~/types/api';
import type { TimeseriesDataPoint } from '~/types/chart';

/**
 * HistoricalData Model
 * Wraps historical timeseries data with transformation methods
 */
export class HistoricalData {
    readonly raw: HistoricalResponse;

    constructor(raw: HistoricalResponse) {
        this.raw = raw;
    }

    // ============ Basic Getters ============

    get cases(): Record<string, number> {
        return this.raw.cases;
    }

    get deaths(): Record<string, number> {
        return this.raw.deaths;
    }

    get recovered(): Record<string, number> {
        return this.raw.recovered;
    }

    /**
     * Get all available dates
     */
    get dates(): string[] {
        return Object.keys(this.raw.cases);
    }

    /**
     * Get date range
     */
    get dateRange(): { start: Date; end: Date } {
        const dates = this.dates;
        const firstDate = dates[0] ?? new Date().toISOString();
        const lastDate = dates[dates.length - 1] ?? new Date().toISOString();
        return {
            start: new Date(firstDate),
            end: new Date(lastDate),
        };
    }

    /**
     * Get total data points count
     */
    get dataPointsCount(): number {
        return this.dates.length;
    }

    // ============ Transformation Methods ============

    /**
     * Convert to timeseries format for charts
     */
    toTimeseriesFormat(): TimeseriesDataPoint[] {
        return this.dates.map((dateStr) => ({
            date: new Date(dateStr),
            cases: this.raw.cases[dateStr] || 0,
            deaths: this.raw.deaths[dateStr] || 0,
            recovered: this.raw.recovered[dateStr] || 0,
        }));
    }

    /**
     * Get cases series for ApexCharts
     */
    toCasesSeries(): { x: number; y: number }[] {
        return this.dates.map((dateStr) => ({
            x: new Date(dateStr).getTime(),
            y: this.raw.cases[dateStr] || 0,
        }));
    }

    /**
     * Get deaths series for ApexCharts
     */
    toDeathsSeries(): { x: number; y: number }[] {
        return this.dates.map((dateStr) => ({
            x: new Date(dateStr).getTime(),
            y: this.raw.deaths[dateStr] || 0,
        }));
    }

    /**
     * Get recovered series for ApexCharts
     */
    toRecoveredSeries(): { x: number; y: number }[] {
        return this.dates.map((dateStr) => ({
            x: new Date(dateStr).getTime(),
            y: this.raw.recovered[dateStr] || 0,
        }));
    }

    /**
     * Get daily new cases (difference from previous day)
     */
    getDailyCases(): { x: number; y: number }[] {
        const dates = this.dates;
        const result: { x: number; y: number }[] = [];

        for (let i = 1; i < dates.length; i++) {
            const prevCases = this.raw.cases[dates[i - 1]!] || 0;
            const currCases = this.raw.cases[dates[i]!] || 0;
            result.push({
                x: new Date(dates[i]!).getTime(),
                y: Math.max(0, currCases - prevCases),
            });
        }

        return result;
    }

    /**
     * Get daily new deaths
     */
    getDailyDeaths(): { x: number; y: number }[] {
        const dates = this.dates;
        const result: { x: number; y: number }[] = [];

        for (let i = 1; i < dates.length; i++) {
            const prevDeaths = this.raw.deaths[dates[i - 1]!] || 0;
            const currDeaths = this.raw.deaths[dates[i]!] || 0;
            result.push({
                x: new Date(dates[i]!).getTime(),
                y: Math.max(0, currDeaths - prevDeaths),
            });
        }

        return result;
    }

    /**
     * Filter data by last N days
     */
    filterByDays(days: number): HistoricalData {
        const allDates = this.dates;
        const filteredDates = allDates.slice(-days);

        const filteredRaw: HistoricalResponse = {
            cases: {},
            deaths: {},
            recovered: {},
        };

        filteredDates.forEach((date) => {
            filteredRaw.cases[date] = this.raw.cases[date] ?? 0;
            filteredRaw.deaths[date] = this.raw.deaths[date] ?? 0;
            filteredRaw.recovered[date] = this.raw.recovered[date] ?? 0;
        });

        return new HistoricalData(filteredRaw);
    }

    /**
     * Get raw response data
     */
    getRaw(): HistoricalResponse {
        return this.raw;
    }
}

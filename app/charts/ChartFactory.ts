import { TimeseriesChart, type TimeseriesType, type DataType } from './TimeseriesChart';
import { PieChart, type PieType } from './PieChart';
import { ScatterChart } from './ScatterChart';
import type { HistoricalData, ContinentData, CountryData } from '~/models';

/**
 * ChartFactory
 * Factory class for creating chart configurations
 */
export class ChartFactory {
    private isDarkMode: boolean;

    constructor(isDarkMode: boolean = true) {
        this.isDarkMode = isDarkMode;
    }

    // ============ Timeseries Charts ============

    /**
     * Create timeseries chart from historical data
     */
    createTimeseries(
        data: HistoricalData,
        options?: {
            chartType?: TimeseriesType;
            dataType?: DataType;
            showCases?: boolean;
            showDeaths?: boolean;
            showRecovered?: boolean;
        }
    ): TimeseriesChart {
        return new TimeseriesChart(data, {
            ...options,
            isDarkMode: this.isDarkMode,
        });
    }

    /**
     * Create cumulative area chart
     */
    createCumulativeAreaChart(data: HistoricalData): TimeseriesChart {
        return this.createTimeseries(data, {
            chartType: 'area',
            dataType: 'cumulative',
        });
    }

    /**
     * Create daily cases line chart
     */
    createDailyLineChart(data: HistoricalData): TimeseriesChart {
        return this.createTimeseries(data, {
            chartType: 'line',
            dataType: 'daily',
        });
    }

    // ============ Pie Charts ============

    /**
     * Create pie chart from data items
     */
    createPie(
        data: Array<{ label: string; value: number }>,
        options?: {
            chartType?: PieType;
            title?: string;
        }
    ): PieChart {
        return new PieChart(data, {
            ...options,
            isDarkMode: this.isDarkMode,
        });
    }

    /**
     * Create continent distribution pie chart
     */
    createContinentPie(continents: ContinentData[], chartType: PieType = 'donut'): PieChart {
        return PieChart.fromContinents(continents, {
            chartType,
            isDarkMode: this.isDarkMode,
        });
    }

    /**
     * Create top countries pie chart
     */
    createTopCountriesPie(
        countries: CountryData[],
        limit: number = 10,
        chartType: PieType = 'donut'
    ): PieChart {
        return PieChart.fromCountries(countries, limit, {
            chartType,
            isDarkMode: this.isDarkMode,
        });
    }

    // ============ Scatter Charts ============

    /**
     * Create scatter chart from data points
     */
    createScatter(
        data: Array<{ x: number; y: number; label?: string }>,
        options?: {
            xAxisLabel?: string;
            yAxisLabel?: string;
            title?: string;
        }
    ): ScatterChart {
        return new ScatterChart(data, {
            ...options,
            isDarkMode: this.isDarkMode,
        });
    }

    /**
     * Create cases vs deaths scatter chart
     */
    createCasesVsDeathsScatter(countries: CountryData[], limit: number = 50): ScatterChart {
        return ScatterChart.fromCountriesCasesVsDeaths(countries, limit, {
            isDarkMode: this.isDarkMode,
        });
    }

    /**
     * Create per million scatter chart
     */
    createPerMillionScatter(countries: CountryData[], limit: number = 50): ScatterChart {
        return ScatterChart.fromCountriesPerMillion(countries, limit, {
            isDarkMode: this.isDarkMode,
        });
    }

    // ============ Utilities ============

    /**
     * Set dark mode
     */
    setDarkMode(isDark: boolean): void {
        this.isDarkMode = isDark;
    }

    /**
     * Get current dark mode setting
     */
    getDarkMode(): boolean {
        return this.isDarkMode;
    }
}

// Default factory instance
export const chartFactory = new ChartFactory();

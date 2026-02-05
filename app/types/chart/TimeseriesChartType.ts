import type { BaseChartOptions, ChartSeries } from './BaseChartOptions';

/**
 * Timeseries chart configuration
 */
export interface TimeseriesChartConfig {
    options: BaseChartOptions;
    series: ChartSeries[];
}

/**
 * Timeseries data point with date
 */
export interface TimeseriesDataPoint {
    date: Date;
    cases: number;
    deaths: number;
    recovered: number;
}

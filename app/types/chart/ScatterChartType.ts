import type { BaseChartOptions, ChartSeries } from './BaseChartOptions';

/**
 * Scatter chart configuration
 */
export interface ScatterChartConfig {
    options: BaseChartOptions;
    series: ChartSeries[];
}

/**
 * Scatter chart data point
 */
export interface ScatterDataPoint {
    x: number;
    y: number;
    label?: string;
    size?: number;
}

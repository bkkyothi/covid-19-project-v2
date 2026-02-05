import type { ApexOptions } from 'apexcharts';

/**
 * Base chart options extending ApexCharts
 */
export interface BaseChartOptions extends ApexOptions {
    theme?: {
        mode?: 'dark' | 'light';
    };
}

/**
 * Chart series data point
 */
export interface ChartDataPoint {
    x: string | number | Date;
    y: number;
}

/**
 * Chart series configuration
 */
export interface ChartSeries {
    name: string;
    data: number[] | ChartDataPoint[];
    color?: string;
}

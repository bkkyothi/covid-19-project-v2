import type { BaseChartOptions } from './BaseChartOptions';

/**
 * Pie chart configuration
 */
export interface PieChartConfig {
    options: BaseChartOptions;
    series: number[];
    labels: string[];
}

/**
 * Pie chart data item
 */
export interface PieDataItem {
    label: string;
    value: number;
    color?: string;
}

import type { ApexOptions } from 'apexcharts';
import { BaseChartConfig } from './BaseChartConfig';
import type { ContinentData, CountryData } from '~/models';

export type PieType = 'pie' | 'donut';

interface PieDataItem {
    label: string;
    value: number;
}

/**
 * PieChart
 * Pie/Donut chart for distribution visualization
 */
export class PieChart extends BaseChartConfig {
    private data: PieDataItem[];
    private chartType: PieType;
    private title: string;

    constructor(
        data: PieDataItem[],
        options: {
            chartType?: PieType;
            title?: string;
            isDarkMode?: boolean;
        } = {}
    ) {
        super(options.isDarkMode ?? true);
        this.data = data;
        this.chartType = options.chartType ?? 'donut';
        this.title = options.title ?? 'Distribution';
    }

    /**
     * Create from continent data
     */
    static fromContinents(
        continents: ContinentData[],
        options?: { chartType?: PieType; isDarkMode?: boolean }
    ): PieChart {
        const data = continents.map((c) => ({
            label: c.name,
            value: c.cases,
        }));
        return new PieChart(data, { ...options, title: 'Cases by Continent' });
    }

    /**
     * Create from top countries data
     */
    static fromCountries(
        countries: CountryData[],
        limit: number = 10,
        options?: { chartType?: PieType; isDarkMode?: boolean }
    ): PieChart {
        const sorted = [...countries].sort((a, b) => b.cases - a.cases).slice(0, limit);
        const data = sorted.map((c) => ({
            label: c.name,
            value: c.cases,
        }));
        return new PieChart(data, { ...options, title: `Top ${limit} Countries by Cases` });
    }

    /**
     * Build chart options
     */
    buildOptions(): ApexOptions {
        const baseOptions = this.getBaseOptions();

        return {
            ...baseOptions,
            chart: {
                ...baseOptions.chart,
                type: this.chartType,
                height: 350,
            },
            labels: this.data.map((d) => d.label),
            title: {
                text: this.title,
                align: 'left',
                style: {
                    fontSize: '16px',
                    fontWeight: 600,
                    color: this.isDarkMode ? '#f3f4f6' : '#111827',
                },
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '60%',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '14px',
                                color: this.isDarkMode ? '#e5e7eb' : '#374151',
                            },
                            value: {
                                show: true,
                                fontSize: '16px',
                                color: this.isDarkMode ? '#f3f4f6' : '#111827',
                                formatter: (val: string) => this.formatNumber(parseInt(val)),
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: this.isDarkMode ? '#9ca3af' : '#6b7280',
                                formatter: (w: { globals: { seriesTotals: number[] } }) => {
                                    const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                    return this.formatNumber(total);
                                },
                            },
                        },
                    },
                },
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => val.toFixed(1) + '%',
                style: {
                    fontSize: '11px',
                },
                dropShadow: {
                    enabled: false,
                },
            },
            colors: [
                '#3b82f6', '#ef4444', '#22c55e', '#f97316', '#a855f7',
                '#06b6d4', '#ec4899', '#84cc16', '#eab308', '#6366f1',
            ],
            stroke: {
                width: 2,
                colors: [this.isDarkMode ? '#1f2937' : '#ffffff'],
            },
        };
    }

    /**
     * Build chart series
     */
    buildSeries(): number[] {
        return this.data.map((d) => d.value);
    }

    /**
     * Get chart configuration
     */
    getConfig(): { options: ApexOptions; series: number[]; labels: string[] } {
        return {
            options: this.buildOptions(),
            series: this.buildSeries(),
            labels: this.data.map((d) => d.label),
        };
    }
}

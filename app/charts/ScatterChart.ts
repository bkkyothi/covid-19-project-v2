import type { ApexOptions } from 'apexcharts';
import { BaseChartConfig } from './BaseChartConfig';
import type { CountryData } from '~/models';

interface ScatterDataPoint {
    x: number;
    y: number;
    label?: string;
}

/**
 * ScatterChart
 * Scatter/Bubble chart for correlation analysis
 */
export class ScatterChart extends BaseChartConfig {
    private data: ScatterDataPoint[];
    private xAxisLabel: string;
    private yAxisLabel: string;
    private title: string;

    constructor(
        data: ScatterDataPoint[],
        options: {
            xAxisLabel?: string;
            yAxisLabel?: string;
            title?: string;
            isDarkMode?: boolean;
        } = {}
    ) {
        super(options.isDarkMode ?? true);
        this.data = data;
        this.xAxisLabel = options.xAxisLabel ?? 'X Axis';
        this.yAxisLabel = options.yAxisLabel ?? 'Y Axis';
        this.title = options.title ?? 'Scatter Chart';
    }

    /**
     * Create from countries - Cases vs Deaths
     */
    static fromCountriesCasesVsDeaths(
        countries: CountryData[],
        limit: number = 50,
        options?: { isDarkMode?: boolean }
    ): ScatterChart {
        const sorted = [...countries].sort((a, b) => b.cases - a.cases).slice(0, limit);
        const data = sorted.map((c) => ({
            x: c.cases,
            y: c.deaths,
            label: c.name,
        }));
        return new ScatterChart(data, {
            ...options,
            xAxisLabel: 'Total Cases',
            yAxisLabel: 'Total Deaths',
            title: 'Cases vs Deaths by Country',
        });
    }

    /**
     * Create from countries - Cases per Million vs Deaths per Million
     */
    static fromCountriesPerMillion(
        countries: CountryData[],
        limit: number = 50,
        options?: { isDarkMode?: boolean }
    ): ScatterChart {
        const sorted = [...countries].sort((a, b) => b.casesPerMillion - a.casesPerMillion).slice(0, limit);
        const data = sorted.map((c) => ({
            x: c.casesPerMillion,
            y: c.deathsPerMillion,
            label: c.name,
        }));
        return new ScatterChart(data, {
            ...options,
            xAxisLabel: 'Cases per Million',
            yAxisLabel: 'Deaths per Million',
            title: 'Cases vs Deaths per Million Population',
        });
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
                type: 'scatter',
                height: 350,
                zoom: {
                    enabled: true,
                    type: 'xy',
                },
            },
            title: {
                text: this.title,
                align: 'left',
                style: {
                    fontSize: '16px',
                    fontWeight: 600,
                    color: this.isDarkMode ? '#f3f4f6' : '#111827',
                },
            },
            xaxis: {
                title: {
                    text: this.xAxisLabel,
                    style: {
                        color: this.isDarkMode ? '#9ca3af' : '#6b7280',
                    },
                },
                labels: {
                    formatter: (val: string) => this.formatNumber(parseFloat(val)),
                    style: {
                        colors: this.isDarkMode ? '#9ca3af' : '#6b7280',
                    },
                },
                tickAmount: 10,
            },
            yaxis: {
                title: {
                    text: this.yAxisLabel,
                    style: {
                        color: this.isDarkMode ? '#9ca3af' : '#6b7280',
                    },
                },
                labels: {
                    formatter: (val: number) => this.formatNumber(val),
                    style: {
                        colors: this.isDarkMode ? '#9ca3af' : '#6b7280',
                    },
                },
            },
            markers: {
                size: 8,
                hover: {
                    size: 12,
                },
            },
            colors: [this.colors.cases],
            tooltip: {
                ...baseOptions.tooltip,
                custom: ({ seriesIndex, dataPointIndex, w }: {
                    seriesIndex: number;
                    dataPointIndex: number;
                    w: { config: { series: Array<{ data: Array<{ label?: string; x: number; y: number }> }> } }
                }) => {
                    const point = w.config.series[seriesIndex]?.data[dataPointIndex];
                    if (!point) {
                        return '<div class="px-3 py-2 bg-base-200 border border-base-300 rounded shadow-lg">No data</div>';
                    }
                    const label = point.label || 'Unknown';
                    const x = this.formatNumber(point.x);
                    const y = this.formatNumber(point.y);
                    return `
            <div class="px-3 py-2 bg-base-200 border border-base-300 rounded shadow-lg">
              <div class="font-semibold text-sm">${label}</div>
              <div class="text-xs text-gray-400">${this.xAxisLabel}: ${x}</div>
              <div class="text-xs text-gray-400">${this.yAxisLabel}: ${y}</div>
            </div>
          `;
                },
            },
        };
    }

    /**
     * Build chart series
     */
    buildSeries(): ApexAxisChartSeries {
        return [
            {
                name: 'Countries',
                data: this.data.map((d) => ({
                    x: d.x,
                    y: d.y,
                    label: d.label,
                })),
            },
        ];
    }

    /**
     * Get chart configuration
     */
    getConfig(): { options: ApexOptions; series: ApexAxisChartSeries } {
        return {
            options: this.buildOptions(),
            series: this.buildSeries(),
        };
    }
}

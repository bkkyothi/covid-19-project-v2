import type { ApexOptions } from 'apexcharts';
import { BaseChartConfig } from './BaseChartConfig';
import type { HistoricalData } from '~/models';

export type TimeseriesType = 'area' | 'line';
export type DataType = 'cumulative' | 'daily';

/**
 * TimeseriesChart
 * Line/Area chart for COVID-19 timeseries data
 */
export class TimeseriesChart extends BaseChartConfig {
    private data: HistoricalData;
    private chartType: TimeseriesType;
    private dataType: DataType;
    private showCases: boolean;
    private showDeaths: boolean;
    private showRecovered: boolean;

    constructor(
        data: HistoricalData,
        options: {
            chartType?: TimeseriesType;
            dataType?: DataType;
            showCases?: boolean;
            showDeaths?: boolean;
            showRecovered?: boolean;
            isDarkMode?: boolean;
        } = {}
    ) {
        super(options.isDarkMode ?? true);
        this.data = data;
        this.chartType = options.chartType ?? 'area';
        this.dataType = options.dataType ?? 'cumulative';
        this.showCases = options.showCases ?? true;
        this.showDeaths = options.showDeaths ?? true;
        this.showRecovered = options.showRecovered ?? true;
    }

    /**
     * Build chart options for ApexCharts
     */
    buildOptions(): ApexOptions {
        const baseOptions = this.getBaseOptions();

        return {
            ...baseOptions,
            chart: {
                ...baseOptions.chart,
                type: this.chartType,
                height: 350,
                stacked: false,
                zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: true,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
                width: this.chartType === 'area' ? 2 : 3,
            },
            fill: {
                type: this.chartType === 'area' ? 'gradient' : 'solid',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.45,
                    opacityTo: 0.05,
                    stops: [50, 100],
                },
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    datetimeUTC: false,
                    style: {
                        colors: this.isDarkMode ? '#9ca3af' : '#6b7280',
                    },
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
            },
            yaxis: {
                labels: {
                    formatter: (value: number) => this.formatNumber(value),
                    style: {
                        colors: this.isDarkMode ? '#9ca3af' : '#6b7280',
                    },
                },
            },
            title: {
                text: this.dataType === 'cumulative' ? 'Cumulative Cases Over Time' : 'Daily New Cases',
                align: 'left',
                style: {
                    fontSize: '16px',
                    fontWeight: 600,
                    color: this.isDarkMode ? '#f3f4f6' : '#111827',
                },
            },
            colors: [this.colors.cases, this.colors.deaths, this.colors.recovered],
        };
    }

    /**
     * Build chart series data
     */
    buildSeries(): ApexAxisChartSeries {
        const series: ApexAxisChartSeries = [];

        if (this.dataType === 'cumulative') {
            if (this.showCases) {
                series.push({
                    name: 'Cases',
                    data: this.data.toCasesSeries(),
                });
            }
            if (this.showDeaths) {
                series.push({
                    name: 'Deaths',
                    data: this.data.toDeathsSeries(),
                });
            }
            if (this.showRecovered) {
                series.push({
                    name: 'Recovered',
                    data: this.data.toRecoveredSeries(),
                });
            }
        } else {
            if (this.showCases) {
                series.push({
                    name: 'Daily Cases',
                    data: this.data.getDailyCases(),
                });
            }
            if (this.showDeaths) {
                series.push({
                    name: 'Daily Deaths',
                    data: this.data.getDailyDeaths(),
                });
            }
        }

        return series;
    }

    /**
     * Get chart configuration object
     */
    getConfig(): { options: ApexOptions; series: ApexAxisChartSeries } {
        return {
            options: this.buildOptions(),
            series: this.buildSeries(),
        };
    }
}

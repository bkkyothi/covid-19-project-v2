import type { ApexOptions } from 'apexcharts';

/**
 * BaseChartConfig
 * Abstract base class for all chart configurations
 * Provides common dark theme and responsive settings
 */
export abstract class BaseChartConfig {
    protected isDarkMode: boolean = true;

    // Common chart colors
    protected colors = {
        cases: '#3b82f6',    // Blue
        deaths: '#ef4444',   // Red
        recovered: '#22c55e', // Green
        active: '#f97316',   // Orange
        critical: '#a855f7', // Purple
        tests: '#06b6d4',    // Cyan
    };

    constructor(isDarkMode: boolean = true) {
        this.isDarkMode = isDarkMode;
    }

    /**
     * Get base chart options with dark theme
     */
    protected getBaseOptions(): ApexOptions {
        return {
            chart: {
                background: 'transparent',
                foreColor: this.isDarkMode ? '#e5e7eb' : '#374151',
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true,
                    },
                },
                animations: {
                    enabled: true,
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150,
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350,
                    },
                },
            },
            theme: {
                mode: this.isDarkMode ? 'dark' : 'light',
            },
            grid: {
                borderColor: this.isDarkMode ? '#374151' : '#e5e7eb',
                strokeDashArray: 3,
            },
            tooltip: {
                theme: this.isDarkMode ? 'dark' : 'light',
                style: {
                    fontSize: '12px',
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                labels: {
                    colors: this.isDarkMode ? '#e5e7eb' : '#374151',
                },
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: {
                            toolbar: {
                                show: false,
                            },
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };
    }

    /**
     * Format large numbers for display
     */
    protected formatNumber(value: number): string {
        if (value >= 1000000000) {
            return (value / 1000000000).toFixed(1) + 'B';
        }
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        }
        if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
        return value.toString();
    }

    /**
     * Abstract method to build chart options
     */
    abstract buildOptions(): ApexOptions;

    /**
     * Abstract method to build chart series
     */
    abstract buildSeries(): ApexAxisChartSeries | number[];
}

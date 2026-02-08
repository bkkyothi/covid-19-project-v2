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
                foreColor: this.isDarkMode ? '#e5e7eb' : '#15171aff',
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
                borderColor: this.isDarkMode ? '#15171aff' : '#e5e7eb',
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
                    colors: this.isDarkMode ? '#e5e7eb' : '#15171aff',
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            toolbar: {
                                show: false,
                            },
                            height: 280,
                        },
                        legend: {
                            position: 'bottom',
                            fontSize: '10px',
                            itemMargin: {
                                horizontal: 8,
                                vertical: 4,
                            },
                        },
                        xaxis: {
                            labels: {
                                rotate: -45,
                                rotateAlways: true,
                                style: {
                                    fontSize: '9px',
                                },
                            },
                        },
                        yaxis: {
                            labels: {
                                style: {
                                    fontSize: '9px',
                                },
                                formatter: (value: number) => this.formatNumber(value),
                            },
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        plotOptions: {
                            pie: {
                                donut: {
                                    size: '50%',
                                    labels: {
                                        show: true,
                                        name: {
                                            fontSize: '10px',
                                        },
                                        value: {
                                            fontSize: '12px',
                                        },
                                    },
                                },
                            },
                        },
                        // markers: {
                        //     size: 4,
                        // },
                    },
                },
                {
                    breakpoint: 640,
                    options: {
                        chart: {
                            toolbar: {
                                show: false,
                            },
                            height: 300,
                        },
                        legend: {
                            position: 'bottom',
                            fontSize: '11px',
                            itemMargin: {
                                horizontal: 10,
                                vertical: 5,
                            },
                        },
                        xaxis: {
                            labels: {
                                rotate: -45,
                                style: {
                                    fontSize: '10px',
                                },
                            },
                        },
                        yaxis: {
                            labels: {
                                style: {
                                    fontSize: '10px',
                                },
                                formatter: (value: number) => this.formatNumber(value),
                            },
                        },
                        dataLabels: {
                            style: {
                                fontSize: '9px',
                            },
                        },
                        plotOptions: {
                            pie: {
                                donut: {
                                    size: '55%',
                                    labels: {
                                        show: true,
                                        name: {
                                            fontSize: '11px',
                                        },
                                        value: {
                                            fontSize: '13px',
                                        },
                                    },
                                },
                            },
                        },
                        // markers: {
                        //     size: 5,
                        // },
                    },
                },
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
                            fontSize: '12px',
                        },
                        // markers: {
                        //     size: 6,
                        // },
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
            const num = value / 1000000000;
            return (num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)) + 'B';
        }
        if (value >= 1000000) {
            const num = value / 1000000;
            return (num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)) + 'M';
        }
        if (value >= 1000) {
            const num = value / 1000;
            return (num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)) + 'K';
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

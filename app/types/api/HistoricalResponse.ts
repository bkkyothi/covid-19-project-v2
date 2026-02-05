/**
 * Historical Data Response from /v3/covid-19/historical/all
 */
export interface HistoricalResponse {
    cases: Record<string, number>;
    deaths: Record<string, number>;
    recovered: Record<string, number>;
}

/**
 * Historical Data for a specific country
 */
export interface CountryHistoricalResponse {
    country: string;
    province: string[] | null;
    timeline: HistoricalResponse;
}

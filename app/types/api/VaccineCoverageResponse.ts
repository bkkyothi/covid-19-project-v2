/**
 * Vaccine Coverage Response from /v3/covid-19/vaccine/coverage
 */
export interface VaccineCoverageResponse {
    [date: string]: number;
}

/**
 * Vaccine Coverage by Country Response
 */
export interface VaccineCountryCoverageResponse {
    country: string;
    timeline: VaccineCoverageResponse;
}

/**
 * Vaccine Data Response from /v3/covid-19/vaccine
 */
export interface VaccineDataResponse {
    source: string;
    totalCandidates: string;
    phases: VaccinePhase[];
    data: VaccineCandidate[];
}

export interface VaccinePhase {
    phase: string;
    candidates: string;
}

export interface VaccineCandidate {
    candidate: string;
    mechanism: string;
    sponsors: string[];
    details: string;
    trialPhase: string;
    institutions: string[];
}

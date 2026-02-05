import type { VaccineCoverageResponse, VaccineCountryCoverageResponse } from '~/types/api';
import { VaccineCoverage } from '~/models';

/**
 * VaccineCoverageMapper
 * Transforms API response to VaccineCoverage model
 */
export class VaccineCoverageMapper {
    /**
     * Convert raw coverage response to model instance
     */
    static toModel(raw: VaccineCoverageResponse): VaccineCoverage {
        return new VaccineCoverage(raw);
    }

    /**
     * Convert country coverage response to model
     */
    static fromCountryResponse(raw: VaccineCountryCoverageResponse): VaccineCoverage {
        return VaccineCoverage.fromCountryResponse(raw);
    }

    /**
     * Convert array of country responses to model array
     */
    static fromCountryResponses(rawList: VaccineCountryCoverageResponse[]): VaccineCoverage[] {
        return rawList.map((raw) => this.fromCountryResponse(raw));
    }
}

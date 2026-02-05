import type { ContinentResponse } from '~/types/api';
import { ContinentData } from '~/models';

/**
 * ContinentDataMapper
 * Transforms API response to ContinentData model
 */
export class ContinentDataMapper {
    /**
     * Convert raw response to model instance
     */
    static toModel(raw: ContinentResponse): ContinentData {
        return new ContinentData(raw);
    }

    /**
     * Convert array of raw responses to model array
     */
    static toModels(rawList: ContinentResponse[]): ContinentData[] {
        return rawList.map((raw) => this.toModel(raw));
    }

    /**
     * Sort continents by cases descending
     */
    static sortByCases(continents: ContinentData[]): ContinentData[] {
        return [...continents].sort((a, b) => b.cases - a.cases);
    }
}

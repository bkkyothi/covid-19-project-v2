import type { StateResponse } from '~/types/api';
import { StateData } from '~/models';

/**
 * StateDataMapper
 * Transforms API response to StateData model
 */
export class StateDataMapper {
    /**
     * Convert raw response to model instance
     */
    static toModel(raw: StateResponse): StateData {
        return new StateData(raw);
    }

    /**
     * Convert array of raw responses to model array
     */
    static toModels(rawList: StateResponse[]): StateData[] {
        return rawList.map((raw) => this.toModel(raw));
    }

    /**
     * Sort states by cases descending
     */
    static sortByCases(states: StateData[], limit?: number): StateData[] {
        const sorted = [...states].sort((a, b) => b.cases - a.cases);
        return limit ? sorted.slice(0, limit) : sorted;
    }
}

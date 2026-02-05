import type { GlobalSummaryResponse } from '~/types/api';
import { GlobalSummary } from '~/models';

/**
 * GlobalSummaryMapper
 * Transforms API response to GlobalSummary model
 */
export class GlobalSummaryMapper {
    /**
     * Convert raw response to model instance
     */
    static toModel(raw: GlobalSummaryResponse): GlobalSummary {
        return new GlobalSummary(raw);
    }

    /**
     * Convert array of raw responses to model array
     */
    static toModels(rawList: GlobalSummaryResponse[]): GlobalSummary[] {
        return rawList.map((raw) => this.toModel(raw));
    }
}

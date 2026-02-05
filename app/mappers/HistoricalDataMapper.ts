import type { HistoricalResponse } from '~/types/api';
import { HistoricalData } from '~/models';

/**
 * HistoricalDataMapper
 * Transforms API response to HistoricalData model
 */
export class HistoricalDataMapper {
    /**
     * Convert raw response to model instance
     */
    static toModel(raw: HistoricalResponse): HistoricalData {
        return new HistoricalData(raw);
    }
}

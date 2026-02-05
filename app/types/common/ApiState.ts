/**
 * Generic API state for async data fetching
 * Used throughout the application for consistent loading/error handling
 */
export interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

/**
 * Create initial API state
 */
export function createApiState<T>(initialData: T | null = null): ApiState<T> {
    return {
        data: initialData,
        loading: false,
        error: null,
    };
}

/**
 * Create loading API state
 */
export function createLoadingState<T>(): ApiState<T> {
    return {
        data: null,
        loading: true,
        error: null,
    };
}

/**
 * Create error API state
 */
export function createErrorState<T>(error: string): ApiState<T> {
    return {
        data: null,
        loading: false,
        error,
    };
}

/**
 * Create success API state
 */
export function createSuccessState<T>(data: T): ApiState<T> {
    return {
        data,
        loading: false,
        error: null,
    };
}

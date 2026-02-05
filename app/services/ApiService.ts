import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';

/**
 * ApiService
 * Central Axios instance with interceptors for API communication
 */
export class ApiService {
    private axiosInstance: AxiosInstance;
    private retryCount: number = 1;

    constructor() {
        // Create Axios instance with base configuration
        this.axiosInstance = axios.create({
            baseURL: 'https://disease.sh',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    /**
     * Setup request and response interceptors
     */
    private setupInterceptors(): void {
        // Request interceptor - logging in development
        this.axiosInstance.interceptors.request.use(
            (config) => {
                if (process.dev) {
                    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
                }
                return config;
            },
            (error) => {
                console.error('[API Request Error]', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor - error handling and retry
        this.axiosInstance.interceptors.response.use(
            (response) => {
                if (process.dev) {
                    console.log(`[API Response] ${response.status} ${response.config.url}`);
                }
                return response;
            },
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                // Handle network errors with retry
                if (!error.response && !originalRequest._retry) {
                    originalRequest._retry = true;
                    console.warn('[API] Network error, retrying...');

                    // Wait 1 second before retry
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return this.axiosInstance(originalRequest);
                }

                // Handle specific HTTP errors
                if (error.response) {
                    const status = error.response.status;

                    if (status >= 400 && status < 500) {
                        // Client errors (4xx)
                        console.error(`[API Error 4xx] ${status}: ${this.getErrorMessage(error)}`);
                    } else if (status >= 500) {
                        // Server errors (5xx)
                        console.error(`[API Error 5xx] ${status}: Server error`);

                        // Retry once for server errors
                        if (!originalRequest._retry) {
                            originalRequest._retry = true;
                            console.warn('[API] Server error, retrying...');
                            await new Promise((resolve) => setTimeout(resolve, 2000));
                            return this.axiosInstance(originalRequest);
                        }
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    /**
     * Extract error message from AxiosError
     */
    private getErrorMessage(error: AxiosError): string {
        if (error.response?.data) {
            const data = error.response.data as Record<string, unknown>;
            if (typeof data.message === 'string') return data.message;
            if (typeof data.error === 'string') return data.error;
        }
        return error.message || 'Unknown error';
    }

    /**
     * GET request with typed response
     */
    async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, { params });
        return response.data;
    }

    /**
     * POST request with typed response
     */
    async post<T>(url: string, data?: unknown): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data);
        return response.data;
    }

    /**
     * Get the underlying Axios instance
     */
    getInstance(): AxiosInstance {
        return this.axiosInstance;
    }
}

// Singleton instance
export const apiService = new ApiService();

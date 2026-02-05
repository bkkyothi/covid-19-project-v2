/**
 * Cache entry with data and expiration info
 */
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

/**
 * CacheService
 * In-memory cache with TTL support for API responses
 */
export class CacheService {
    private cache: Map<string, CacheEntry<unknown>> = new Map();
    private defaultTTL: number = 5 * 60 * 1000; // 5 minutes in milliseconds

    constructor(defaultTTLMs?: number) {
        if (defaultTTLMs) {
            this.defaultTTL = defaultTTLMs;
        }
    }

    /**
     * Get cached data if not expired
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;

        if (!entry) {
            return null;
        }

        // Check if cache entry has expired
        if (this.isExpired(entry)) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Store data in cache with optional TTL
     */
    set<T>(key: string, data: T, ttlMs?: number): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttlMs || this.defaultTTL,
        };

        this.cache.set(key, entry);
    }

    /**
     * Check if key exists and is not expired
     */
    has(key: string): boolean {
        const entry = this.cache.get(key);

        if (!entry) {
            return false;
        }

        if (this.isExpired(entry)) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /**
     * Remove specific key from cache
     */
    invalidate(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Clear expired entries
     */
    clearExpired(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (this.isExpired(entry)) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Get cache size
     */
    size(): number {
        return this.cache.size;
    }

    /**
     * Get all cache keys
     */
    keys(): string[] {
        return Array.from(this.cache.keys());
    }

    /**
     * Check if entry is expired
     */
    private isExpired(entry: CacheEntry<unknown>): boolean {
        return Date.now() - entry.timestamp > entry.ttl;
    }

    /**
     * Set default TTL
     */
    setDefaultTTL(ttlMs: number): void {
        this.defaultTTL = ttlMs;
    }

    /**
     * Get default TTL
     */
    getDefaultTTL(): number {
        return this.defaultTTL;
    }
}

// Singleton instance with 5 minute default TTL
export const cacheService = new CacheService();

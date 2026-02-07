export class StorageService {
    private prefix = 'covid-dashboard';

    private key(key: string) {
        return `${this.prefix}:${key}`;
    }

    get<T>(key: string): T | null {
        if (typeof window === 'undefined') return null;

        const raw = localStorage.getItem(this.key(key));
        if (!raw) return null;

        try {
            return JSON.parse(raw) as T;
        } catch {
            return null;
        }
    }

    set<T>(key: string, value: T): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.key(key), JSON.stringify(value));
    }

    remove(key: string): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.key(key));
    }
}

export const storageService = new StorageService();

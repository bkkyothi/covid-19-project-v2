import { defineStore } from 'pinia';
import { type ThemeMode } from '~/services/CacheService';
import { storageService } from '~/services/StorageService';

export const useThemeStore = defineStore('theme', {
    state: () => ({
        mode: 'system' as ThemeMode,
        _isDark: false // internal resolved, do not use directly
    }),

    getters: {
        isDark: (state) => state._isDark,
        currentMode: (state) => state.mode
    },

    actions: {
        init() {
            if (typeof window === 'undefined') return;

            const saved = storageService.get<ThemeMode>('theme-mode');
            if (saved) {
                this.mode = saved;
            }
            this.resolveTheme();

            // Watch system preference changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (this.mode === 'system') {
                    this._isDark = e.matches;
                }
            });
        },

        setMode(mode: ThemeMode) {
            this.mode = mode;
            if (typeof window !== 'undefined') {
                storageService.set('theme-mode', mode);
            }
            this.resolveTheme();
        },

        toggle() {
            const next: ThemeMode = this.isDark ? 'light' : 'dark';
            this.setMode(next);
        },

        resolveTheme() {
            if (typeof window === 'undefined') return;

            if (this.mode === 'system') {
                this._isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            } else {
                this._isDark = this.mode === 'dark';
            }
        }
    }
});

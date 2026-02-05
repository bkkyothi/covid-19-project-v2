/**
 * Nullable type wrapper
 */
export type Nullable<T> = T | null;

/**
 * Optional type wrapper
 */
export type Optional<T> = T | undefined;

/**
 * Maybe type (nullable and optional)
 */
export type Maybe<T> = T | null | undefined;

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

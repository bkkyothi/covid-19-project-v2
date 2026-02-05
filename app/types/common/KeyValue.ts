/**
 * Generic key-value pair type
 */
export interface KeyValue<T = string> {
    key: string;
    value: T;
}

/**
 * Labeled value for display purposes
 */
export interface LabeledValue<T = number> {
    label: string;
    value: T;
}

/**
 * Option item for dropdowns and selects
 */
export interface SelectOption<T = string> {
    label: string;
    value: T;
    disabled?: boolean;
}

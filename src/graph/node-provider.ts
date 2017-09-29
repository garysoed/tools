export type InstanceNodeProvider<T> = (newValue: T, context: {}) => Promise<void>;
export type StaticNodeProvider<T> = (newValue: T) => Promise<void>;

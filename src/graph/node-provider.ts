export type NodeProvider<T> = (newValue: T) => Promise<void>;

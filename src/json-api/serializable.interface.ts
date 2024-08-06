export interface SerializableInterface<T> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    serialize(): Record<string, any>;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    deserialize(data: Record<string, any>): T;
}

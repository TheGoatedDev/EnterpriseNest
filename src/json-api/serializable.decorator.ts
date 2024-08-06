export function Serializable<T>() {
    return (classConstructor: new () => T) => {
        if (
            !('serialize' in classConstructor.prototype) ||
            !('deserialize' in classConstructor.prototype)
        ) {
            throw new Error(
                `Class ${classConstructor.name} must implement Serializable interface`,
            );
        }
    };
}

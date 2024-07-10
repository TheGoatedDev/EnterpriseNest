import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

/* eslint-disable -- This is just annoying to type */
// TODO: Fix this

export function IsEqualToProperty(
    property: string,
    validationOptions?: ValidationOptions,
) {
    return function _(object: object, propertyName: string) {
        registerDecorator({
            name: 'isEqualToProperty',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;

                    const relatedValue = (
                        args.object as Record<string, unknown>
                    )[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${propertyName} does not match ${args.constraints[0]}`;
                },
            },
        });
    };
}

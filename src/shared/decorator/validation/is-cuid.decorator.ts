import { isCuid } from '@paralleldrive/cuid2';
import {
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
} from 'class-validator';

export function IsCuid(validationOptions?: ValidationOptions) {
    return function _(object: object, propertyName: string) {
        registerDecorator({
            name: 'isCuid',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                // biome-ignore lint/suspicious/noExplicitAny: Required by class-validator
                validate(value: any, args: ValidationArguments) {
                    return isCuid(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${propertyName} is not a valid CUID.`;
                },
            },
        });
    } as PropertyDecorator;
}

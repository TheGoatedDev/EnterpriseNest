import { isCuid } from '@paralleldrive/cuid2';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

/* eslint-disable -- This is just annoying to type */

export function IsCuid(validationOptions?: ValidationOptions) {
    return function _(object: object, propertyName: string) {
        registerDecorator({
            name: 'isCuid',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
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

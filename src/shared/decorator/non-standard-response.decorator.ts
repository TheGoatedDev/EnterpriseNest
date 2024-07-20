import { SetMetadata } from '@nestjs/common';

export const NonStandardResponseKey = Symbol('NonStandardResponse');

export const NonStandardResponse = () =>
    SetMetadata(NonStandardResponseKey, true);

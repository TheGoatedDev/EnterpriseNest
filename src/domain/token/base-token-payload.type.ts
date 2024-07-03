export type TokenType =
    | 'verification'
    | 'reset-password'
    | 'refresh-token'
    | 'access-token';

export interface BaseTokenPayload<Type extends TokenType, Data> {
    type: Type | string;
    data: Data;
}

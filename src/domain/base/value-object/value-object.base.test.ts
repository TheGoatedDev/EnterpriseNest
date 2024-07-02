import {
    DomainPrimitive,
    ValueObject,
} from '@/domain/base/value-object/value-object.base';

class TestValueObject extends ValueObject<string> {
    protected validate(props: DomainPrimitive<string>): void {
        if (!props.value) {
            throw new Error('Value cannot be empty');
        }
    }
    public getProps(): DomainPrimitive<string> {
        return this.props;
    }
}

describe('base value object', () => {
    it('should throw error when value is not provided', () => {
        const props = {} as DomainPrimitive<string>; // don't do this in your actual code
        expect(() => new TestValueObject(props)).toThrow(Error);
    });

    it('should properly set the props', () => {
        const props: DomainPrimitive<string> = { value: 'Test string' };
        const myValueObject = new TestValueObject(props);
        expect(myValueObject.getProps()).toEqual(props);
    });
});

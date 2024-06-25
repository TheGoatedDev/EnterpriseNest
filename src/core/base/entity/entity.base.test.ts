import type { DomainPrimitive } from '../value-object/value-object.base';
import { ValueObject } from '../value-object/value-object.base';
import type { CreateEntityProps } from './entity.base';
import { Entity } from './entity.base';

interface Person {
    name: string;
    age: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class PersonEntity extends Entity<Person> {
    public validate(): void {
        if (!this.data.name || !this.data.age) {
            throw new Error('Invalid PersonEntity');
        }
    }
}

describe('entity', () => {
    const entityProps: CreateEntityProps<Person> = {
        id: '1',
        data: {
            name: 'John',
            age: 18,
            createdAt: new Date(),
        },
    };

    it('should properly construct an entity', () => {
        const person = new PersonEntity(entityProps);

        expect(person.id).toEqual(entityProps.id);
        expect(person.createdAt).toBeInstanceOf(Date);
        expect(person.updatedAt).toBeInstanceOf(Date);
        expect(person.getData()).toEqual({
            ...entityProps.data,
            id: entityProps.id,
            createdAt: expect.any(Date) as Date,
            updatedAt: expect.any(Date) as Date,
        });
    });

    it('should update updatedAt when updated is called', async () => {
        const person = new PersonEntity(entityProps);
        const initialUpdatedAt = person.getData().updatedAt;

        await new Promise((resolve) => {
            setTimeout(resolve, 50);
        });

        person.updated();
        expect(person.getData().updatedAt.getTime()).not.toEqual(
            initialUpdatedAt.getTime(),
        );
    });

    it('should throw when validate is called on an invalid entity', () => {
        const invalidEntityProps: CreateEntityProps<Person> = {
            id: '2',
            data: {
                name: '',
                age: 21,
                createdAt: new Date(),
            },
        };

        expect(() => {
            const _invalidPerson = new PersonEntity(invalidEntityProps);
        }).toThrow('Invalid PersonEntity');
    });

    it('should be able to get _id', () => {
        const person = new PersonEntity(entityProps);
        expect(person.id).toEqual(entityProps.id);
    });

    it('should be able to get createdAt', () => {
        const entity: CreateEntityProps<Person> = {
            id: '1',
            data: {
                name: 'John',
                age: 18,
                createdAt: new Date(),
            },
        };
        const person = new PersonEntity(entity);
        expect(person.createdAt).toEqual(entity.data.createdAt);
    });

    it('should be able to get updatedAt', () => {
        const entity: CreateEntityProps<Person> = {
            id: '1',
            data: {
                name: 'John',
                age: 18,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        };
        const person = new PersonEntity(entity);
        expect(person.updatedAt).toEqual(entity.data.updatedAt);
    });
});

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

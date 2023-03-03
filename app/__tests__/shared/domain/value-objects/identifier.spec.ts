import { Identifier } from '@shared/domain/value-objects/Identifier';
import { v4 as uuid } from 'uuid';

describe('Identifier', () => {
  it('should be able to detect invalid identifiers', () => {
    expect(() => Identifier.create(null)).toThrowError();
    expect(() => Identifier.create(undefined)).toThrowError();
    expect(() => Identifier.create('')).toThrowError();
  });

  it('should be able to create an identifier from a uuid', () => {
    // use a static uuid for testing
    const identifier = Identifier.create(uuid());
    expect(identifier).toBeDefined();
  });

  it('should be able to create an identifier from a number', () => {
    const identifier = Identifier.create(1);
    expect(identifier).toBeDefined();
  });

  it('should be able to check if two identifiers are equal', () => {
    const _uuid = uuid();
    const identifier1 = Identifier.create(_uuid);
    const identifier2 = Identifier.create(_uuid);
    expect(identifier1.equals(identifier2)).toBeTruthy();
  });
});

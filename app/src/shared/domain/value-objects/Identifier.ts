import { isUuid } from '@shared/utils/helpers/uuid.helper';

/**
 * An identifier for a domain object or value object.
 *
 * @typeparam T The type of the identifier value.
 */
export class Identifier<T extends string | number> {
  /**
   * Creates a new instance of the identifier.
   *
   * @param {T} _value The value of the identifier.
   */
  constructor(private readonly _value: T) {}

  /**
   * Checks whether this identifier is equal to another identifier.
   *
   * @param identifier The identifier to compare to.
   *
   * @returns {boolean}
   */
  public equals(identifier?: Identifier<T>): boolean {
    if (!identifier || !(identifier instanceof this.constructor)) {
      return false;
    }
    return Object.is(this._value, identifier.value);
  }

  /**
   * Returns a string representation of the identifier value.
   *
   * @returns {string}
   */
  public toString(): string {
    return this._value?.toString() ?? '';
  }

  /**
   * Creates a new identifier from the given value.
   *
   * @param value
   * @param validate - Whether to validate the identifier value.
   *
   * @returns
   */
  public static create<T extends string | number>(
    value: T,
    validate: boolean = true
  ) {
    if (validate && !this.prototype.isValidIdentifier(value)) {
      throw new Error(`Invalid identifier value: ${value}`);
    }
    return new this(value);
  }

  /**
   * Checks whether the given value is a valid identifier.
   *
   * @param value
   *
   * @returns
   */
  protected isValidIdentifier(value: T): boolean {
    const isValidNumericIdentifier = value > 0;
    if (typeof value === 'number' && isValidNumericIdentifier) {
      return true;
    }

    return isUuid(String(value));
  }

  /**
   * Checks whether the identifier is empty.
   *
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    return !this._value;
  }

  /**
   * Gets the value of the identifier.
   */
  public get value(): T {
    return this._value;
  }
}

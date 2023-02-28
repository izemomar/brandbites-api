import { TValueObjectProps } from '@shared/domain/types';

/**
 * ValueObject is a base class for all value objects.
 *
 * @template T - The type of the value object properties.
 */
export abstract class ValueObject<T extends TValueObjectProps> {
  public readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(valueObject?: ValueObject<T>): boolean {
    if (valueObject === null || valueObject === undefined) {
      return false;
    }
    if (valueObject.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(valueObject.props);
  }

  /**
   * Validates the value object properties.
   *
   * @param props
   *
   * @typeparam K - The type of the value object properties.
   *
   * @returns {boolean}
   */
  abstract validate<K extends keyof T>(...props: K[]): boolean;
}

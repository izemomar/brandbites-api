import { ValueObject } from '@shared/domain/building-blocks/ValueObject';
import { TDateTimeValueObjectProps } from '@shared/domain/types';
import { DateTimeRule } from '../business-rules/DateTimeRule';
import { BusinessRuleFailureException } from '../exceptions/BusinessRuleFailureException';

/**
 * Represents a value object for date and time information.
 *
 * @remarks
 * The value is stored as a `Date` object internally, but can be accessed and created using
 * string representations of the date and time in the format 'YYYY-MM-DD' and 'HH:mm:ss' respectively.
 */
export class DateTimeValueObject extends ValueObject<TDateTimeValueObjectProps> {
  /**
   * Creates a new instance of `DateTimeValueObject`.
   *
   * @param {Date} dateObj - The `Date` object to create the `DateTimeValueObject` from.
   */
  constructor(dateObj: Date) {
    const date = dateObj.toISOString().substr(0, 10);
    const time = dateObj.toISOString().substr(11, 8);

    super({ date, time });
  }

  /**
   * Gets the date component of the DateTimeValueObject instance.
   *
   * @returns A string representing the date component of the DateTimeValueObject instance.
   */
  get date(): string {
    return this.props.date;
  }

  /**
   * Gets the time component of the DateTimeValueObject instance.
   *
   * @returns A string representing the time component of the DateTimeValueObject instance.
   */
  get time(): string {
    return this.props.time;
  }

  /**
   * Creates a new instance of `DateTimeValueObject` using the current date and time.
   *
   * @returns A new instance of `DateTimeValueObject` with the current date and time.
   */
  public static now(): DateTimeValueObject {
    const now = new Date();
    return new DateTimeValueObject(now);
  }

  /**
   * Creates a new instance of `DateTimeValueObject` from a `Date` object.
   *
   * @param {Date} dateObj - The `Date` object to create the `DateTimeValueObject` from.
   *
   * @returns A new instance of `DateTimeValueObject` created from the `Date` object.
   */
  public static from(dateObj: Date): DateTimeValueObject {
    return new DateTimeValueObject(dateObj);
  }

  /**
   * Creates a new instance of `DateTimeValueObject` using the provided date and time strings.
   *
   * @param {string} date - The date string in the format 'YYYY-MM-DD'.
   * @param {string} time - The time string in the format 'HH:mm:ss'.
   *
   * @returns A new instance of `DateTimeValueObject` created from the date and time strings.
   *
   * @throws An error if the date or time string is invalid.
   */
  public static create(date: string, time: string): DateTimeValueObject {
    this.prototype.checkBusinessRule(new DateTimeRule(date, time));
    return new DateTimeValueObject(new Date(`${date}T${time}Z`));
  }
}

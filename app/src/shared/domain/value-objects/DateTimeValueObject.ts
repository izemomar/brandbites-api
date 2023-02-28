import { ValueObject } from '@shared/domain/building-blocks/ValueObject';
import { TDateTimeValueObjectProps } from '@shared/domain/types';

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
  private constructor(dateObj: Date) {
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
    if (!this.prototype.validate(date, time)) {
      throw new Error('Invalid date or time');
    }

    return new DateTimeValueObject(new Date(`${date}T${time}Z`));
  }

  /**
   * Validates whether the provided date and time strings are in the correct format.
   *
   * @param {string} date - The date string to validate in the format 'YYYY-MM-DD'.
   * @param {string} time - The time string to validate in the format 'HH:mm:ss'.
   *
   * @returns {boolean}
   */
  public validate(date: string, time: string): boolean {
    if (!date || !time) {
      return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (!dateRegex.test(date) || !timeRegex.test(time)) {
      return false;
    }

    const dateTime = new Date(`${date}T${time}Z`);

    return !isNaN(dateTime.getTime());
  }
}

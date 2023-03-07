import { InvalidOperationException } from '@shared/utils/exceptions/InvalidOperationException';

export type ResultOptions<T> = {
  success: boolean;
  error?: T | string;
  value?: T;
};

/**
 * Represents the result of an operation that may succeed or fail.
 */
export class Result<T> {
  /**
   * Indicates whether the operation succeeded.
   */
  private _success: boolean;

  /**
   * Indicates whether the operation failed.
   */
  private _failure: boolean;

  /**
   * Contains the error message or value if the operation failed or succeeded, respectively.
   */
  private _error: T | string;

  /**
   * Contains the result value if the operation succeeded.
   */
  private _value: T;

  public constructor({ success, error, value }: ResultOptions<T>) {
    if (success && error) {
      throw new InvalidOperationException(
        'A result cannot be successful and contain an error'
      );
    }

    if (!success && !error) {
      throw new InvalidOperationException(
        'A failing result needs to contain an error message'
      );
    }

    this._success = success;
    this._failure = !success;
    this._error = error;
    this._value = value;
    Object.freeze(this);
  }

  /**
   * Gets a boolean value indicating whether the operation failed.
   *
   * @returns {boolean}
   */
  public get isFailure(): boolean {
    return this._failure;
  }

  /**
   * Gets a boolean value indicating whether the operation succeeded.
   *
   * @returns {boolean}
   */
  public get isSuccess(): boolean {
    return this._success;
  }

  /**
   * Gets the result value if the operation succeeded.
   *
   * @returns {T} The result value.
   *
   * @throws {Error} if the operation failed.
   */
  public get value(): T {
    if (this._failure) {
      throw new InvalidOperationException(
        'Cannot get the value of a failed result. Use `error` instead.'
      );
    }
    return this._value;
  }

  /**
   * Gets the error message or value if the operation failed.
   *
   * @returns {T} The error message or value.
   */
  public get error(): T | string {
    if (this._success) {
      throw new InvalidOperationException(
        'Cannot get the error of a successful result. Use `value` instead.'
      );
    }
    return this._error;
  }

  /**
   * Creates a new Result object indicating a successful operation.
   *
   * @param {U} [value] - The result value if the operation succeeded.
   *
   * @returns {Result<U>} The new Result object.
   */
  public static succeed<U>(value?: U): Result<U> {
    return new Result<U>({ success: true, value });
  }

  /**
   * Creates a new Result object indicating a failed operation.
   *
   * @param {string} error - The error message.
   *
   * @returns {Result<U>} The new Result object.
   */
  public static fail<U>(error: U | string): Result<U> {
    return new Result<U>({ success: false, error });
  }

  /**
   * Combines an array of Result objects into a single Result object.
   * If any of the Result objects indicate a failure, the first failure encountered
   * is returned; otherwise, a successful Result object is returned.
   *
   * @param {Result<any>[]} results - The array of Result objects to combine.
   *
   * @returns {Result<any>} The combined Result object.
   */
  public static combineResults(results: Result<any>[]): Result<any> {
    return results.find(result => result.isFailure) ?? Result.succeed();
  }
}

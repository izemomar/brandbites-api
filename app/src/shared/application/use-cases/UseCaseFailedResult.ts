import { UseCaseException } from '@shared/application/use-cases/UseCaseException';
import { Result } from '@shared/utils/helpers/result';

/**
 * A `Result` subclass representing a failed result of a use case.
 * This class wraps an instance of `UseCaseException` and provides a standard way of returning
 * errors from use cases.
 */
export class UseCaseFailedResult extends Result<UseCaseException> {
  /**
   * Creates a new instance of `UseCaseFailedResult`.
   *
   * @param error The error that caused the use case to fail. Can be an instance of `UseCaseException`, an `Error`
   * object, or a string describing the error.
   */
  constructor(error: Error | UseCaseException | string) {
    let theError: UseCaseException;

    if (error instanceof UseCaseException) {
      theError = error;
    } else if (typeof error === 'string') {
      theError = new UseCaseException(error);
    } else {
      theError = new UseCaseException(error.message);
    }

    super({
      success: false,
      error: theError
    });
  }

  /**
   * Creates a new failed `Result` with the given error.
   *
   * @param error The error that caused the use case to fail. Can be an instance of `UseCaseException`, an `Error`
   * object, or a string describing the error.
   *
   * @returns A new `Result` instance representing the failed result of the use case.
   */
  public static create(
    error: Error | UseCaseException | string
  ): Result<UseCaseException> {
    let theError: UseCaseException;

    if (error instanceof UseCaseException) {
      theError = error;
    } else if (typeof error === 'string') {
      theError = new UseCaseException(error);
    } else {
      theError = new UseCaseException(error.message);
    }

    return Result.fail(theError);
  }
}

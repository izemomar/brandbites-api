import { UseCaseException } from '@shared/application/use-cases/UseCaseException';

/**
 * A class representing a failed result of a use case.
 */
export class UseCaseFailedResult extends UseCaseException {
  constructor(error: Error | UseCaseException | string) {
    if (error instanceof UseCaseException) {
      super(error.message);
    } else if (typeof error === 'string') {
      super(error);
    } else {
      super(error.message);
    }
  }

  public static create(
    error: Error | UseCaseException | string
  ): UseCaseFailedResult {
    return new UseCaseFailedResult(error);
  }
}

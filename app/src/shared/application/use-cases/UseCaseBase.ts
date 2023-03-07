import { IUseCase } from '@shared/application/use-cases/IUseCase';
import { UseCaseFailedResult } from '@shared/application/use-cases/UseCaseFailedResult';
import { Either, fail, Result } from '@shared/utils/helpers/result';

// Define a type for the base response of a use case, which is either an instance of UseCaseFailedResult
// or a Result with a void value
export type TUseCaseResponseBase<F = unknown, S = unknown | void> = Either<
  UseCaseFailedResult | Result<F>,
  Result<S>
>;

/**
 * A base class for implementing use cases. A use case is an application-specific business logic that
 * performs some operation and returns a response. The use case is executed by calling the execute()
 * method, passing in a request object that contains input data for the operation. The response object
 * returned by the use case can be either a success or a failure result.
 */
export abstract class UseCaseBase<
  IRequest,
  IResponse extends TUseCaseResponseBase
> implements IUseCase<IRequest, IResponse>
{
  /**
   * Executes the use case with the given request object.
   *
   * @param request - The request object containing input data for the use case.
   *
   * @returns A promise that resolves to the response object of the use case.
   */
  execute(request: IRequest): Promise<IResponse> {
    try {
      // Delegate the request handling to the handle() method implemented by a derived class
      return this.handle(request);
    } catch (error) {
      // If an exception is thrown during request handling, return a failed result with the error information
      const failedResult = new UseCaseFailedResult(error);
      return Promise.resolve(fail(failedResult) as IResponse);
    }
  }

  /**
   * Handles the request object and returns the response object of the use case.
   *
   * @param requestDTO - The request object containing input data for the use case.
   *
   * @returns A promise that resolves to the response object of the use case.
   */
  protected abstract handle(requestDTO: IRequest): Promise<IResponse>;
}

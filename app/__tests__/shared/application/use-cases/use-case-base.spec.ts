import {
  UseCaseBase,
  TUseCaseResponseBase
} from '@shared/application/use-cases/UseCaseBase';
import { UseCaseFailedResult } from '@shared/application/use-cases/UseCaseFailedResult';
import {
  Either,
  Failure,
  succeed,
  Success,
  Result
} from '@shared/utils/helpers/result';
describe('UseCaseBase', () => {
  type Request = {
    id?: string;
  };

  class UseCaseBaseImpl extends UseCaseBase<Request, TUseCaseResponseBase> {
    protected handle(request: Request): Promise<TUseCaseResponseBase> {
      return Promise.resolve(null);
    }
  }

  let useCase: UseCaseBaseImpl;

  beforeEach(() => {
    useCase = new UseCaseBaseImpl();
  });

  it('should be defined', () => {
    expect(UseCaseBase).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(useCase).toBeInstanceOf(UseCaseBase);
  });

  it('should return a promise when executed', () => {
    const result = useCase.execute({});

    expect(result).toBeInstanceOf(Promise);
  });

  it('should resolve the promise to a Success instance when handle() method returns a Success instance', async () => {
    class UseCaseBaseImplWithSuccess extends UseCaseBaseImpl {
      protected handle(request: Request): Promise<TUseCaseResponseBase> {
        const result = new Result({
          success: true,
          value: { id: '123' }
        });

        return Promise.resolve(succeed(result));
      }
    }

    const useCase = new UseCaseBaseImplWithSuccess();
    const result = await useCase.execute({});

    expect.assertions(5);
    expect(result).toBeInstanceOf(Success);
    expect(result.isSuccess()).toBeTruthy();
    expect(result.isFailure()).toBeFalsy();
    expect(result.value).toBeInstanceOf(Result);
    expect(result.value.value).toEqual({ id: '123' });
  });

  it('should reject the promise with a Failure instance when an error is thrown from the handle() method', async () => {
    const error = new Error('Error');
    const useCase = new (class extends UseCaseBaseImpl {
      protected handle(request: Request): Promise<TUseCaseResponseBase> {
        throw error;
      }
    })();

    const result = await useCase.execute({});

    expect.assertions(4);
    expect(result).toBeInstanceOf(Failure);
    expect(result.isSuccess()).toBeFalsy();
    expect(result.isFailure()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UseCaseFailedResult);
  });
});

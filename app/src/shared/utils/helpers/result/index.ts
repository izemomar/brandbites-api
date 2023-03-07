export * from '@shared/utils/helpers/result/Result';

import { Failure } from '@shared/utils/helpers/result/Failure';
import { Success } from '@shared/utils/helpers/result/Success';

export type Either<F, S> = Failure<F, S> | Success<F, S>;

export const fail = <F, S>(f: F): Either<F, S> => {
  return new Failure(f);
};

export const succeed = <F, S>(s: S): Either<F, S> => {
  return new Success<F, S>(s);
};

export { Failure, Success };

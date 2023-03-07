import { Success } from '@shared/utils/helpers/result/Success';

export class Failure<F, S> {
  readonly value: F;

  constructor(value: F) {
    this.value = value;
  }

  isFailure(): this is Failure<F, S> {
    return true;
  }

  isSuccess(): this is Success<F, S> {
    return false;
  }
}

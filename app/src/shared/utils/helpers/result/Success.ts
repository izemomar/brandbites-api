import { Failure } from '@shared/utils/helpers/result/Failure';

export class Success<F, S> {
  readonly value: S;

  constructor(value: S) {
    this.value = value;
  }

  isFailure(): this is Failure<F, S> {
    return false;
  }

  isSuccess(): this is Success<F, S> {
    return true;
  }
}

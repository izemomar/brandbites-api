import { TValidationError } from '@shared/infrastructure/http/requests/types';

export class ValidationException extends Error {
  constructor(public readonly errors: TValidationError[]) {
    super('Validation failed');
    this.name = 'ValidationException';
  }
}

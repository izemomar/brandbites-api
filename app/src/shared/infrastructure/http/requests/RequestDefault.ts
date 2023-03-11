import { RequestBase } from '@shared/infrastructure/http/requests/RequestBase';
import { TRule } from '@shared/infrastructure/http/requests/types';
import { Request } from 'express';

export class RequestValidatorDefault extends RequestBase<{}> {
  rules(): TRule {
    return {};
  }
  queryRules(): TRule {
    return {};
  }

  constructor(request: Request) {
    super(request);
  }
}

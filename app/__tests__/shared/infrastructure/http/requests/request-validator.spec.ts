import { RequestValidator } from '@shared/infrastructure/http/requests/RequestValidator';
import { TRule } from '@shared/infrastructure/http/requests/types';
import { Failure } from '@shared/utils/helpers/result';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Request } from 'express';

class TestRequestValidator extends RequestValidator {
  queryRules(): TRule {
    return {
      include: [IsString(), IsNotEmpty()]
    };
  }
  request: Request;
  constructor() {
    super();
  }

  rules(): TRule {
    return {
      name: [IsString(), IsNotEmpty()],
      email: [IsString(), IsNotEmpty(), IsEmail()],
      password: [IsString(), IsNotEmpty()]
    };
  }

  validate(request: Request): void {
    this.request = request;
    return this.validateRequest(request);
  }

  get validatedBody(): Object {
    return this.getValidatedValues(undefined, this.request.body);
  }

  get validatedQuery(): Object {
    return this.getValidatedValues(undefined, this.request.query, 'query');
  }
}

describe('RequestValidator', () => {
  let requestValidator: TestRequestValidator;
  let request: Request;

  beforeEach(() => {
    requestValidator = new TestRequestValidator();

    request = {
      body: {
        name: 'test',
        email: '',
        password: 'test'
      },
      query: {
        include: 'tests,tests2'
      }
    } as unknown as Request;
  });

  it('should be defined', () => {
    expect(RequestValidator).toBeDefined();
  });

  it('should be extendable', () => {
    expect(requestValidator).toBeInstanceOf(TestRequestValidator);
  });

  it('should have errors property', () => {
    expect(requestValidator.errors).toBeDefined();
  });

  it('should validate the request body according to the specified rules', async () => {
    requestValidator.validate(request);
    expect(requestValidator.hasErrors).toBeTruthy();
    expect(requestValidator.isValidated).toBeTruthy();
  });

  it('should return the errors if the request is not valid', async () => {
    delete request.body.email;

    requestValidator.validate(request);
    expect(requestValidator.errors).toEqual([
      {
        field: 'email',
        messages: [
          'email must be a string',
          'email should not be empty',
          'email must be an email'
        ]
      }
    ]);
  });

  it('should return validated values if the request is valid', async () => {
    request.body.email = 'email@test.com';
    requestValidator.validate(request);

    expect(requestValidator.hasErrors).toBeFalsy();
    expect(requestValidator.isValidated).toBeTruthy();
    expect(requestValidator.validatedBody).toEqual({
      name: 'test',
      email: 'email@test.com',
      password: 'test'
    });

    expect(requestValidator.validatedQuery).toEqual({
      include: 'tests,tests2'
    });
  });
});

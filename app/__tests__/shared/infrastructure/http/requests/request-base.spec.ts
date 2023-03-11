import { RequestBase } from '@shared/infrastructure/http/requests/RequestBase';
import { TRule } from '@shared/infrastructure/http/requests/types';
import {
  Either,
  fail,
  Failure,
  succeed,
  Success
} from '@shared/utils/helpers/result';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Request } from 'express';

class TestRequest extends RequestBase {
  queryRules(): TRule {
    return {
      sortBy: [IsString(), IsNotEmpty()]
    };
  }
  authorize(): Either<false, true> {
    return fail(false);
  }

  rules(): TRule {
    return {
      name: [IsString(), IsNotEmpty()],
      email: [IsString(), IsNotEmpty(), IsEmail()],
      password: [IsString(), IsNotEmpty()]
    };
  }
}

describe('RequestBase', () => {
  let request: TestRequest;
  let expressRequest: Request;

  beforeEach(() => {
    expressRequest = {
      body: {
        name: 'test',
        email: '',
        password: 'test'
      }
    } as unknown as Request;

    request = new TestRequest(expressRequest);
  });

  it('should be defined', () => {
    expect(RequestBase).toBeDefined();
  });

  it('should be extendable and instantiable', () => {
    expect(request).toBeInstanceOf(TestRequest);
  });

  describe('validation', () => {
    it('should have errors property', () => {
      expect(request.errors).toBeDefined();
    });

    it('should validate the request body / query according to the specified rules', async () => {
      request.validate();

      expect(request.hasErrors).toBeTruthy();
      expect(request.isValidated).toBeTruthy();
    });

    it('should store validation errors', async () => {
      request.validate();

      expect(request.errors).toHaveLength(2);
      expect(request.errors[0].field).toBe('email');
      expect(request.errors[0].messages).toContain('email must be an email');

      expect(request.errors[1].field).toBe('sortBy');
      expect(request.errors[1].messages).toContain('sortBy must be a string');
      expect(request.errors[1].messages).toContain(
        'sortBy should not be empty'
      );
    });

    it('should throw an error if the request body / query is not valid', async () => {
      expect(() => request.validateOrFail()).toThrow();
    });

    it("should return the request's body / query if it is valid", async () => {
      expressRequest.body = {
        name: 'test',
        email: 'email@test.com',
        password: 'test'
      };

      expressRequest.query = {
        sortBy: '+name'
      };

      request = new TestRequest(expressRequest);

      const result = request.validate();

      expect(result.isSuccess()).toBeTruthy();
      expect(result.value).toEqual({
        ...expressRequest.body,
        ...expressRequest.query
      });
    });
  });

  describe('authorization', () => {
    it('should return Failure the request is not authorized', async () => {
      const result = request.authorize();

      expect(result).toBeInstanceOf(Failure);
      expect(result.isFailure()).toBeTruthy();
    });

    it('should throw an error if the request is not authorized', async () => {
      expect(() => request.authorizeOrFail()).toThrow();
    });

    it('should return true if the request is authorized', async () => {
      const request = new (class extends RequestBase {
        rules(): TRule {
          return {};
        }
        queryRules(): TRule {
          return {};
        }
        authorize(): Either<false, true> {
          return succeed(true);
        }
      })(expressRequest);

      const result = request.authorize();

      expect(result).toBeInstanceOf(Success);
      expect(result.isSuccess()).toBeTruthy();
      expect(result.value).toBeTruthy();
    });
  });
});

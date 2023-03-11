import { RouterWrapper } from '@shared/infrastructure/http/api/RouterWrapper';
import { ControllerBase } from '@shared/infrastructure/http/api/ControllerBase';
import { RequestBase } from '@shared/infrastructure/http/requests/RequestBase';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { TRule } from '@shared/infrastructure/http/requests/types';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiResponder } from '@shared/infrastructure/http/api/ApiResponder';
import { Either, fail } from '@shared/utils/helpers/result';

type mockDto = {
  name: string;
};

class TestRequest extends RequestBase<mockDto> {
  rules(): TRule {
    return {
      name: [IsString(), IsNotEmpty()]
    };
  }
  queryRules(): TRule {
    return {};
  }
  constructor(request: Request<ParamsDictionary, any, any, ParsedQs>) {
    super(request);
  }
}

class TestController extends ControllerBase<mockDto> {
  protected requestValidatorClass = TestRequest;

  public handle(request: RequestBase, response: Response): Promise<void> {
    response.status(200).send('Hello World!');
    return Promise.resolve();
  }
}

describe('RouterWrapper', () => {
  let routerWrapper: RouterWrapper;
  let response: Response;

  beforeEach(() => {
    routerWrapper = new RouterWrapper();

    response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      type: jest.fn().mockReturnThis()
    } as unknown as Response;
  });

  it('should be defined', () => {
    expect(RouterWrapper).toBeDefined();
  });

  it('should create a new instance', () => {
    const routerWrapper = new RouterWrapper();
    expect(routerWrapper).toBeDefined();
  });

  it("should register a new 'get' route", () => {
    routerWrapper.get('/test', TestController);

    expect(routerWrapper.router.stack).toHaveLength(1);
    expect(routerWrapper.router.stack[0].route.path).toBe('/test');
    expect(routerWrapper.router.stack[0].route.methods.get).toBeTruthy();
  });

  it("should register a new 'post' route", () => {
    routerWrapper.post('/test', TestController);

    expect(routerWrapper.router.stack).toHaveLength(1);
    expect(routerWrapper.router.stack[0].route.path).toBe('/test');
    expect(routerWrapper.router.stack[0].route.methods.post).toBeTruthy();
  });

  it("should register a new 'put' route", () => {
    routerWrapper.put('/test', TestController);

    expect(routerWrapper.router.stack).toHaveLength(1);
    expect(routerWrapper.router.stack[0].route.path).toBe('/test');
    expect(routerWrapper.router.stack[0].route.methods.put).toBeTruthy();
  });

  it("should register a new 'delete' route", () => {
    routerWrapper.delete('/test', TestController);

    expect(routerWrapper.router.stack).toHaveLength(1);
    expect(routerWrapper.router.stack[0].route.path).toBe('/test');
    expect(routerWrapper.router.stack[0].route.methods.delete).toBeTruthy();
  });

  it("should register a new 'patch' route", () => {
    routerWrapper.patch('/test', TestController);

    expect(routerWrapper.router.stack).toHaveLength(1);
    expect(routerWrapper.router.stack[0].route.path).toBe('/test');
    expect(routerWrapper.router.stack[0].route.methods.patch).toBeTruthy();
  });

  it('should add validate request middleware', () => {
    routerWrapper.post('/test', TestController);

    expect(routerWrapper.router.stack).toHaveLength(1);
    expect(routerWrapper.router.stack[0].route.path).toBe('/test');
    expect(routerWrapper.router.stack[0].route.methods.post).toBeTruthy();
    expect(routerWrapper.router.stack[0].route.stack).toHaveLength(2);
    expect(routerWrapper.router.stack[0].route.stack[0].name).toBe(
      'validateRequest'
    );
  });

  it('validation middleware should return 422 if validation fails', async () => {
    routerWrapper.post('/test', TestController);

    const request = {
      body: {}
    } as Request;

    await routerWrapper.router.stack[0].route.stack[0].handle(
      request,
      response
    );

    expect(response.status).toHaveBeenCalledWith(422);
    expect(response.json).toHaveBeenCalledWith({
      errors: [
        {
          field: 'name',
          messages: ['name must be a string', 'name should not be empty']
        }
      ],
      message: 'Validation failed'
    });
  });

  it('the validate request middleware should prevent unauthorized requests', async () => {
    class TestUnauthorizedRequest extends TestRequest {
      authorize(): Either<false, true> {
        return fail(false);
      }
    }

    class TestUnauthorizedController extends TestController {
      protected requestValidatorClass = TestUnauthorizedRequest;
    }

    routerWrapper.post('/test', TestUnauthorizedController);

    const request = {
      body: {
        name: 'test'
      }
    } as Request;

    await routerWrapper.router.stack[0].route.stack[0].handle(
      request,
      response
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Unauthorized request'
    });
  });
});

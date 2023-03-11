import { ApiResponder } from '@shared/infrastructure/http/api/ApiResponder';
import { ControllerBase } from '@shared/infrastructure/http/api/ControllerBase';
import {
  Router,
  RequestHandler,
  Request,
  NextFunction,
  Response
} from 'express';

type TRouteMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
type TController = new () => ControllerBase;

/**
 * A wrapper for the express router.
 * It provides a simple way to register routes.
 * It also provides a way to add validation middleware to the routes.
 * It also provides a way to add authorization middleware to the routes.
 */
export class RouterWrapper {
  private _router: Router;

  constructor() {
    this.router = Router();
  }

  get router(): Router {
    return this._router;
  }

  private set router(router: Router) {
    this._router = router;
  }

  /**
   * Validation middleware factory.
   *
   * @param controller
   * @returns
   */
  private createValidationMiddleware(controller: ControllerBase) {
    if (controller.validatorClass) {
      const validateRequest = (
        request: Request,
        response: Response,
        next: NextFunction
      ) => {
        const validator = new controller.validatorClass(request);

        try {
          validator.validateAndAuthorizeOrFail();
          next();
        } catch (error) {
          ApiResponder.sendError(response, error);
        }
      };

      return validateRequest;
    }

    return null;
  }

  /**
   * Creates the validation middleware and adds it to the list of middlewares.
   *
   * @param middlewares
   * @param controller
   * @returns
   */
  private prepareMiddlewares(
    middlewares: RequestHandler[],
    controller: ControllerBase
  ) {
    const validateRequest = this.createValidationMiddleware(controller);

    if (validateRequest) {
      middlewares = middlewares
        ? [validateRequest, ...middlewares]
        : [validateRequest];
    }

    if (!middlewares) {
      middlewares = [];
    }

    return middlewares;
  }

  /**
   * A callback factory that will be used to create the callback for the route.
   *
   * @param controller
   * @param request
   * @param response
   * @returns
   */
  private createRouteCallback(
    controller: ControllerBase,
    request: Request,
    response: Response
  ) {
    // TODO: make sure to pass validated request to the controller
    return controller.execute(new controller.validatorClass(request), response);
  }

  /**
   * Adds a route to the router.
   *
   * @param {TRouteMethod} method
   * @param {string} path
   * @param {TController} controller
   * @param {RequestHandler[]} [middlewares]
   * @memberof RouterWrapper
   * @private
   *
   */
  private addRoute(
    method: TRouteMethod,
    path: string,
    controller: TController,
    middlewares?: RequestHandler[]
  ): void {
    const _controller = new controller();

    middlewares = this.prepareMiddlewares(middlewares, _controller);
    this._router[method](
      path,
      middlewares,
      (request: Request, response: Response) =>
        this.createRouteCallback(_controller, request, response)
    );
  }

  /**
   * Adds a GET route to the router.
   *
   * @param path
   * @param controller
   * @param middlewares
   */
  public get(
    path: string,
    controller: TController,
    middlewares?: RequestHandler[]
  ): void {
    this.addRoute('get', path, controller, middlewares);
  }

  /**
   * Adds a POST route to the router.
   *
   * @param path
   * @param controller
   * @param middlewares
   */
  public post(
    path: string,
    controller: TController,
    middlewares?: RequestHandler[]
  ): void {
    this.addRoute('post', path, controller, middlewares);
  }

  /**
   * Adds a PUT route to the router.
   *
   * @param path
   * @param controller
   * @param middlewares
   */
  public put(
    path: string,
    controller: TController,
    middlewares?: RequestHandler[]
  ): void {
    this.addRoute('put', path, controller, middlewares);
  }

  /**
   * Adds a DELETE route to the router.
   *
   * @param path
   * @param controller
   * @param middlewares
   */
  public delete(
    path: string,
    controller: TController,
    middlewares?: RequestHandler[]
  ): void {
    this.addRoute('delete', path, controller, middlewares);
  }

  /**
   * Adds a PATCH route to the router.
   *
   * @param path
   * @param controller
   * @param middlewares
   */
  public patch(
    path: string,
    controller: TController,
    middlewares?: RequestHandler[]
  ): void {
    this.addRoute('patch', path, controller, middlewares);
  }
}

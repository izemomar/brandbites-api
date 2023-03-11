import { ApiResponder } from '@shared/infrastructure/http/api/ApiResponder';
import { RequestBase } from '@shared/infrastructure/http/requests/RequestBase';
import { RequestValidatorDefault } from '@shared/infrastructure/http/requests/RequestDefault';
import { Request, Response } from 'express';

export abstract class ControllerBase<DTO = Object, Query = Object> {
  /**
   * If true, the handle method will be executed in a worker thread.
   *
   * @protected
   * @type {boolean}
   * @memberof ControllerBase
   * @default false
   */
  protected useWorker: boolean = false;

  /**
   * The class that will be used to validate the request.
   * If not set, the default RequestValidatorDefault will be used.
   * To ignore both validation and authorization, simply don't override the default validator.
   *
   * @protected
   * @type {new (request: Request) => RequestBase<DTO>}
   * @memberof ControllerBase
   * @default RequestValidatorDefault
   *
   * @example
   * class MyController extends ControllerBase {
   *
   *  protected validatorClass = MyRequestValidator;
   *
   *  // or you can use the setter method instead
   * // this.validatorClass = MyRequestValidator;
   *
   * // ...
   * }
   *
   */
  protected requestValidatorClass: new (request: Request) => RequestBase<DTO> =
    RequestValidatorDefault as new (request: Request) => RequestBase<DTO>;

  get validatorClass(): new (request: Request) => RequestBase<DTO> {
    return this.requestValidatorClass;
  }

  private set validatorClass(
    requestValidatorClass: new (request: Request) => RequestBase<DTO>
  ) {
    this.requestValidatorClass = requestValidatorClass;
  }

  /**
   * Executes the handle method in a worker thread.
   *
   * @param {RequestBase<DTO, Query>} request
   * @param {Response} response
   * @private
   * */
  private executeInWorker(
    request: RequestBase<DTO, Query>,
    response: Response
  ): void {
    // TODO: to be implemented
  }

  /**
   * The handle method is the one that will be executed when the controller is called.
   *
   * @param {Request} request
   * @param {Response} response
   */
  protected abstract handle(
    request: RequestBase<DTO, Query>,
    response: Response
  ): Promise<void>;

  /**
   * Executes the handle method.
   *
   * @param {Request} request
   * @param {Response} response
   */
  public async execute(
    request: RequestBase<DTO, Query>,
    response: Response
  ): Promise<void> {
    try {
      if (this.useWorker) {
        this.executeInWorker(request, response);
      } else {
        await this.handle(request, response);
      }
    } catch (error) {
      ApiResponder.internalServerError(response);
    }
  }
}

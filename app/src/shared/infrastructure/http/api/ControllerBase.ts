import { ApiResponder } from '@shared/infrastructure/http/api/ApiResponder';
import { Request, Response } from 'express';

export abstract class ControllerBase {
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
   * The handle method is the one that will be executed when the controller is called.
   *
   * @param {Request} request
   * @param {Response} response
   */
  protected abstract handle(
    request: Request,
    response: Response
  ): Promise<void>;

  /**
   * Executes the handle method.
   *
   * @param {Request} request
   * @param {Response} response
   */
  public async execute(request: Request, response: Response): Promise<void> {
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

  /**
   * Executes the handle method in a worker thread.
   *
   * @param {Request} request
   * @param {Response} response
   * @private
   * */
  private executeInWorker(request: Request, response: Response): void {
    // TODO: to be implemented
  }
}

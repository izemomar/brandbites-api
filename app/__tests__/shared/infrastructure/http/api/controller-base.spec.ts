import { ApiResponder } from '@shared/infrastructure/http/api/ApiResponder';
import { Request, Response } from 'express';
import { ControllerBase } from '@shared/infrastructure/http/api/ControllerBase';
import { RequestBase } from '@shared/infrastructure/http/requests/RequestBase';
import { TRule } from '@shared/infrastructure/http/requests/types';
import { RouterWrapper } from '@shared/infrastructure/http/api/RouterWrapper';

type mockDto = {
  name: string;
};

class TestController extends ControllerBase<mockDto> {
  public handle(
    request: RequestBase<mockDto>,
    response: Response<any, Record<string, any>>
  ): Promise<void> {
    response.status(200).send('Hello World!');
    return Promise.resolve();
  }
}

describe('ControllerBase', () => {
  describe('Basic Functionalities', () => {
    let res: Response;
    let req: RequestBase<mockDto>;

    beforeEach(() => {
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn()
      } as unknown as Response;

      req = new (class extends RequestBase<mockDto> {
        queryRules(): TRule {
          return {};
        }
        rules(): TRule {
          return {};
        }
      })({
        body: {},
        query: {}
      } as unknown as Request);

      req.validate();
    });

    it('should call handle method when useWorker is false', async () => {
      // Arrange
      const controller = new TestController();

      jest.spyOn(controller as any, 'handle');

      // Act
      await controller.execute(req, res);

      // Assert
      expect(controller['handle']).toHaveBeenCalledWith(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Hello World!');
    });

    it('should call executeInWorker method when useWorker is true', async () => {
      // Arrange
      const controller = new (class extends TestController {
        protected useWorker = true;
      })();

      jest.spyOn(controller as any, 'executeInWorker');

      // Act
      await controller.execute(req, res);

      // Assert
      expect(controller['executeInWorker']).toHaveBeenCalledWith(req, res);
    });

    it('should catch and handle errors', async () => {
      // Arrange
      const controller = new TestController();

      jest.spyOn(controller, 'handle').mockImplementation(() => {
        throw new Error();
      });

      jest.spyOn(ApiResponder, 'internalServerError');

      // Act
      await controller.execute(req, res);

      // Assert
      expect(ApiResponder.internalServerError).toHaveBeenCalledWith(res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });
  });
});

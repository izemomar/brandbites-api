import { ApiResponder } from '@shared/infrastructure/http/api/ApiResponder';
import { Request, Response } from 'express';
import { ControllerBase } from '@shared/infrastructure/http/api/ControllerBase';

class TestController extends ControllerBase {
  public async handle(request: Request, response: Response): Promise<void> {
    response.status(200).send('Hello World!');
  }
}

describe('ControllerBase', () => {
  describe('execute', () => {
    let res: Response;

    beforeEach(() => {
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn()
      } as unknown as Response;
    });

    it('should call handle method when useWorker is false', async () => {
      // Arrange
      const controller = new TestController();
      const req = {} as Request;

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
      const req = {} as Request;

      jest.spyOn(controller as any, 'executeInWorker');

      // Act
      await controller.execute(req, res);

      // Assert
      expect(controller['executeInWorker']).toHaveBeenCalledWith(req, res);
    });

    it('should catch and handle errors', async () => {
      // Arrange
      const controller = new TestController();
      const req = {} as Request;

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

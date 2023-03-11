import { AuthorizationException } from '@shared/infrastructure/http/requests/AuthorizationException';
import { TValidationError } from '@shared/infrastructure/http/requests/types';
import { ValidationException } from '@shared/infrastructure/http/requests/ValidationException';
import { Response } from 'express';

export class ApiResponder {
  public static ok<T>(response: Response, data?: T): Response<T> {
    if (data) {
      response.type('application/json');
      return response.status(200).json(data);
    }
    return response.status(200).json();
  }

  public static created<T>(response: Response, data?: T): Response<T> {
    if (data) {
      response.type('application/json');
      return response.status(201).json(data);
    }
    return response.status(201).json();
  }

  public static noContent(response: Response): Response {
    return response.status(204).json();
  }

  public static badRequest(response: Response, message?: string): Response {
    return response.status(400).json({ message });
  }

  public static unauthorized(response: Response, message?: string): Response {
    return response.status(401).json({ message });
  }

  // validation error
  public static unprocessableEntity(
    response: Response,
    errors: TValidationError[],
    message?: string
  ): Response {
    response.type('application/json');
    return response.status(422).json({ message, errors });
  }

  public static internalServerError(
    response: Response,
    message: string = 'Internal Server Error'
  ): Response {
    return response.status(500).json({ message });
  }

  public static sendError(response: Response, error: Error): void {
    if (error instanceof ValidationException) {
      ApiResponder.unprocessableEntity(response, error.errors, error.message);
    } else if (error instanceof AuthorizationException) {
      ApiResponder.unauthorized(response, error.message);
    } else {
      ApiResponder.internalServerError(response);
    }
  }
}

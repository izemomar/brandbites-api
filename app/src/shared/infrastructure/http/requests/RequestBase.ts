import { Request } from 'express';
import { Either, succeed, fail } from '@shared/utils/helpers/result';
import { RequestValidator } from '@shared/infrastructure/http/requests/RequestValidator';
import { TValidationError } from '@shared/infrastructure/http/requests/types';
import { ValidationException } from '@shared/infrastructure/http/requests/ValidationException';
import { AuthorizationException } from '@shared/infrastructure/http/requests/AuthorizationException';

/**
 * Base class for all requests
 * It provides the basic functionality for validating and authorizing the request
 * It also provides the validated body of the request
 *
 * @export RequestBase
 * @class RequestBase
 * @extends {RequestValidator}
 * @template DTO
 * */
export abstract class RequestBase<
  DTO = Object,
  Query = Object
> extends RequestValidator {
  /**
   * The validated body of the request
   *
   * @private
   * @type {DTO}
   * @memberof RequestBase
   * @default {}
   */
  private _validatedBody: DTO = {} as DTO;
  private _validatedQuery: Query = {} as Query;

  constructor(private _request: Request) {
    super();
  }

  get body(): DTO {
    return this._request.body;
  }

  get query(): Query {
    return this._request.query as Query;
  }

  get validated(): DTO & Query {
    return { ...this._validatedBody, ...this._validatedQuery };
  }

  get validatedBody(): DTO {
    return this._validatedBody;
  }

  get validatedQuery(): Query {
    return this._validatedQuery;
  }

  private set validatedBody(value: DTO) {
    this._validatedBody = value;
  }

  private set validatedQuery(value: Query) {
    this._validatedQuery = value;
  }

  get request(): Request {
    return this._request;
  }

  /**
   * Validate the request and return the validated values or throw an exception if the request is not valid
   *
   * @returns
   */
  public validate(): Either<TValidationError[], DTO & Query> {
    if (this.isValidated) {
      return this.hasErrors ? fail(this.errors) : succeed(this.validated);
    }

    this.validateRequest(this._request);

    if (!this.hasErrors) {
      this.validatedBody = this.getValidatedValues<DTO>(undefined, this.body);
      this.validatedQuery = this.getValidatedValues<Query>(
        undefined,
        this.query,
        'query'
      );
    }

    // freeze the object to prevent any changes and ensure the integrity of validated values
    Object.freeze(this);

    return this.hasErrors ? fail(this.errors) : succeed(this.validated);
  }

  /**
   * Check if the request is authorized or not
   * the default implementation is to return true
   *
   * @returns {boolean}
   * @abstract
   */
  authorize(): Either<false, true> {
    return succeed(true);
  }

  /**
   * Authorize the request and throw an exception if the request is not authorized
   * the default implementation is to return true
   * @returns
   *
   * @throws {AuthorizationException} if the request is not authorized
   * */
  public authorizeOrFail(): void {
    const result = this.authorize();
    if (result.isFailure()) {
      throw new AuthorizationException();
    }
  }

  /**
   * Validate the request and throw an exception if the request is not valid
   *
   * @returns
   *
   * @throws {ValidationException} if the request is not valid
   * */
  public validateOrFail(): void {
    const result = this.validate();
    if (result.isFailure()) {
      throw new ValidationException(result.value);
    }
  }

  /**
   * Validate the request and authorize it or throw an exception if the request is not valid or not authorized
   *
   * @returns
   *
   * @throws {ValidationException} if the request is not valid
   * @throws {AuthorizationException} if the request is not authorized
   * */
  public validateAndAuthorizeOrFail(): void {
    this.validateOrFail();
    this.authorizeOrFail();
  }
}

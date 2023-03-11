import {
  TRule,
  TValidationError
} from '@shared/infrastructure/http/requests/types';
import { Type } from 'class-transformer';
import { ValidationError, Validator } from 'class-validator';
import { Request } from 'express';

export abstract class RequestValidator {
  protected validator: Validator;
  protected validationErrors: ValidationError[] = [];
  private hasBeenValidated = false;

  constructor() {
    this.validator = new Validator();
  }

  get errors(): TValidationError[] {
    return this.validationErrors.map(error => ({
      field: error.property,
      messages: Object.values(error.constraints)
    }));
  }

  get hasErrors(): boolean {
    return this.validationErrors?.length > 0;
  }

  get isValidated(): boolean {
    return this.hasBeenValidated;
  }

  /**
   * Validate the request body and query params
   * according to the rules specified in the rules() method
   *
   * @param request
   */
  protected validateRequest(request: Request): void {
    const rules = this.mergeRulesWithQueryRules();

    const dataToBeValidated = this.createTempClassToBeValidated(
      rules,
      this.mergeRequestWithQueryParams(request)
    );

    this.validationErrors = this.validator.validateSync(dataToBeValidated);
    this.hasBeenValidated = true;
  }

  /**
   * @param request
   * @returns
   */
  protected mergeRequestWithQueryParams(request: Request): Object {
    return { ...request.body, ...request.query };
  }

  protected mergeRulesWithQueryRules(): TRule {
    return { ...this.rules(), ...this.queryRules() };
  }

  /**
   * Pick the validated properties from the provided request data ( body or query params )
   *
   * @returns
   */
  protected getValidatedValues<DTO>(
    tempClass: Object,
    requestData: Object,
    source: 'body' | 'query' = 'body'
  ): DTO {
    const rules = source === 'body' ? this.rules() : this.queryRules();

    tempClass ??= this.createTempClassToBeValidated(rules, requestData);
    const validatedProperties = Object.keys(tempClass) as (keyof DTO)[];
    const validatedBodyOrQuery: { [key: string]: any } = {};
    console.log('validatedProperties: ', validatedProperties);
    for (const property of validatedProperties) {
      const propertyName = property.toString().replace('_', '');
      validatedBodyOrQuery[propertyName] =
        Object.getOwnPropertyDescriptors(requestData)[propertyName]?.value;
    }

    return validatedBodyOrQuery as DTO;
  }

  /**
   * Create a temp class to validate the request body and attach decorators to the properties
   * of the temp class then return an instance of the temp class
   *
   * @example
   * const userRules = {
   * name: [IsString(), IsNotEmpty()],
   * email: [IsString(), IsNotEmpty()],
   * password: [IsString(), IsNotEmpty()],
   * };
   *
   * these rules will be converted to this class
   *
   * class User {
   * @IsString()
   * @IsNotEmpty()
   * name: string;
   *
   * @IsString()
   * @IsNotEmpty()
   * email: string;
   *
   * @IsString()
   * @IsNotEmpty()
   * password: string;
   * }
   * @param rules
   * @returns
   */
  protected createTempClassToBeValidated(
    rules: TRule,
    requestData: Object
  ): Object {
    const tempClass = class {};

    for (const [key, value] of Object.entries(rules)) {
      let propertyDecorators: PropertyDecorator[] = [];
      let propertyType: any;

      if (Array.isArray(value)) {
        propertyDecorators = value as PropertyDecorator[];
      } else {
        propertyType = this.createTempClassToBeValidated(value, requestData);
      }

      Object.defineProperty(tempClass.prototype, key, {
        enumerable: true,
        get() {
          return this[`_${key}`];
        },
        set(value: any) {
          this[`_${key}`] = value;
        }
      });

      if (propertyDecorators.length > 0) {
        propertyDecorators.forEach(decorator => {
          decorator(tempClass.prototype, key);
        });
      } else if (propertyType) {
        Type(() => propertyType)(tempClass.prototype, key);
      }
    }

    // initialize the temp class with the request body based on the rules keys
    const tempClassInstance = new tempClass();
    Object.keys(rules).forEach(key => {
      (tempClassInstance as any)[key] = (requestData as any)[key];
    });
    return tempClassInstance;
  }

  /**
   * Define the validation rules for the request body
   *
   * @returns {TRule}
   * @memberof RequestValidator
   * @example
   * {
   * name: [IsString(), IsNotEmpty()],
   * email: [IsString(), IsNotEmpty()],
   * password: [IsString(), IsNotEmpty()],
   * }
   * */
  abstract rules(): TRule;

  /**
   * Define the validation rules for the query params
   *
   * @returns {TRule}
   * @memberof RequestValidator
   * @example
   * {
   * page: [IsNumber(), IsOptional()],
   * limit: [IsNumber(), IsOptional()],
   * }
   * */
  abstract queryRules(): TRule;
}

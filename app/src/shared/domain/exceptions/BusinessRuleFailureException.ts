import { IBusinessRule } from '@shared/domain/interfaces/IBusinessRule';

/**
 * @description This exception is thrown when a business rule is broken.
 */
export class BusinessRuleFailureException extends Error {
  constructor(public readonly brokenRule: IBusinessRule) {
    super(brokenRule.message);
  }
}

import { TValueObjectProps } from '@shared/domain/types';
import { BusinessRuleFailureException } from '@shared/domain/exceptions/BusinessRuleFailureException';
import { IBusinessRule } from '@shared/domain/interfaces/IBusinessRule';

/**
 * ValueObject is a base class for all value objects.
 *
 * @template T - The type of the value object properties.
 */
export abstract class ValueObject<T extends TValueObjectProps> {
  public readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  /**
   * Checks a business rule and throws an exception if the rule is broken.
   *
   * @param {IBusinessRule} rule - The business rule to check.
   *
   * @throws BusinessRuleFailureException if the rule is broken.
   */
  protected checkBusinessRule(rule: IBusinessRule) {
    if (rule.isBroken()) {
      throw new BusinessRuleFailureException(rule);
    }
  }

  public equals(valueObject?: ValueObject<T>): boolean {
    if (valueObject === null || valueObject === undefined) {
      return false;
    }
    if (valueObject.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(valueObject.props);
  }
}

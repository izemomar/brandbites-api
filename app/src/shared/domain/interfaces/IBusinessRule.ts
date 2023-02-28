/**
 * Interface representing a business rule.
 *
 * @interface
 * @name IBusinessRule
 */
export interface IBusinessRule {
  /**
   * The error message to display if the business rule is broken.
   *
   * @type {string}
   * @memberof IBusinessRule
   */
  message: string;

  /**
   * Checks if the business rule is broken.
   *
   * @returns {boolean} True if the business rule is broken, false otherwise.
   * @memberof IBusinessRule
   */
  isBroken(): boolean;
}

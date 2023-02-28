import { IEntityProps } from '@shared/domain/interfaces/IEntityProps';
import { UniqueUUID } from '@shared/domain/value-objects/UniqueUUID';
import { DateTimeValueObject } from '@shared/domain/value-objects/DateTimeValueObject';
import { IBusinessRule } from '@shared/domain/interfaces/IBusinessRule';
import { BusinessRuleFailureException } from '@shared/domain/exceptions/BusinessRuleFailureException';

/**
 * Base entity class that provides common properties and methods for all entities.
 * @template T - The interface that describes the properties of the entity.
 */
export abstract class Entity<T extends IEntityProps> {
  /**
   * The properties of the entity.
   */
  public readonly props: T;

  /**
   * Constructor for the base entity.
   * @param props - The properties of the entity.
   */
  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  /**
   * Checks if two entities are equal by comparing their properties.
   * @param entity - The entity to compare to.
   * @returns A boolean value indicating whether the entities are equal.
   */
  public equals(entity?: Entity<T>): boolean {
    if (!Entity.isEntity(entity) || entity === null || entity === undefined) {
      return false;
    }
    if (entity.props === undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(entity.props);
  }

  /**
   * Checks if an object is an instance of Entity.
   * @param obj - The object to check.
   * @returns A boolean value indicating whether the object is an instance of Entity.
   */
  public static isEntity(obj: any): obj is Entity<any> {
    return obj instanceof Entity;
  }

  /**
   * Gets the unique identifier of the entity.
   * @returns The unique identifier of the entity.
   */
  public get id(): UniqueUUID {
    return this.props.id;
  }

  /**
   * Gets the date and time the entity was created.
   * @returns A DateTimeValueObject representing the date and time the entity was created.
   */
  public get createdAt(): DateTimeValueObject | undefined {
    return this.props.createdAt;
  }

  public get updatedAt(): DateTimeValueObject | undefined {
    return this.props.updatedAt;
  }

  public get deletedAt(): DateTimeValueObject | undefined {
    return this.props.deletedAt;
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
}

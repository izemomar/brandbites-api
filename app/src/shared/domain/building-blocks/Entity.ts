import { IEntityProps } from '@shared/domain/interfaces/IEntityProps';
import { UniqueUUID } from '@shared/domain/value-objects/UniqueUUID';
import { DateTimeValueObject } from '@shared/domain/value-objects/DateTimeValueObject';
import { IBusinessRule } from '@shared/domain/interfaces/IBusinessRule';
import { BusinessRuleFailureException } from '@shared/domain/exceptions/BusinessRuleFailureException';

export abstract class Entity<T extends IEntityProps> {
  public readonly props: T;

  private constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    if (entity.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(entity.props);
  }

  public get id(): UniqueUUID {
    return this.props.id;
  }

  public get createdAt(): DateTimeValueObject | undefined {
    return this.props.createdAt;
  }

  public get updatedAt(): DateTimeValueObject | undefined {
    return this.props.updatedAt;
  }

  public get deletedAt(): DateTimeValueObject | undefined {
    return this.props.deletedAt;
  }

  protected checkBusinessRule(rule: IBusinessRule) {
    if (rule.isBroken()) {
      throw new BusinessRuleFailureException(rule);
    }
  }
}

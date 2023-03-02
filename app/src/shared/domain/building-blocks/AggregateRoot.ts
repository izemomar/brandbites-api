import { Entity } from '@shared/domain/building-blocks/Entity';
import { IDomainEvent } from '@shared/domain/building-blocks/IDomainEvent';
import { IEntityProps } from '@shared/domain/interfaces/IEntityProps';

export abstract class AggregateRoot<T extends IEntityProps> extends Entity<T> {
  private readonly _pendingDomainEvents = new Set<IDomainEvent>();

  public constructor(props: T) {
    super(props);
  }

  /**
   * Returns a read-only view of the pending domain events.
   */
  public get pendingDomainEvents(): ReadonlySet<IDomainEvent> {
    return this._pendingDomainEvents;
  }

  /**
   * Adds a domain event to the list of pending events.
   *
   * @param domainEvent The domain event to add.
   */
  protected raiseDomainEvent(domainEvent: IDomainEvent): void {
    this._pendingDomainEvents.add(domainEvent);
  }

  /**
   * Clears the list of pending domain events.
   */
  public clearPendingDomainEvents(): void {
    this._pendingDomainEvents.clear();
  }
}

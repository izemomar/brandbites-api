import { Entity } from '@shared/domain/building-blocks/Entity';
import { IEntityProps } from '@shared/domain/interfaces/IEntityProps';

/**
 * Mapper interface
 *
 * @interface IMapper
 *
 * @template E Entity
 * @template TPersistence Persistence
 * @template TDto Dto
 */
export interface IMapper<
  TEntity extends Entity<IEntityProps>,
  TPersistence,
  TDto = any
> {
  /**
   * Map entity to persistence object
   *
   * @param entity
   *
   * @returns {TPersistence}
   */
  toPersistence(entity: TEntity): TPersistence;

  /**
   * Map persistence object to a domain entity
   *
   * @param persistence
   *
   * @returns {E}
   */
  toDomain(persistence: TPersistence | Object): TEntity;

  /**
   * Map entity to dto object
   *
   * @param entity
   *
   * @returns {TDto}
   * */
  toDto(entity: TEntity): TDto;
}

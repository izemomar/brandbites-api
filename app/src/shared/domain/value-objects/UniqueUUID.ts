import { Identifier } from '@shared/domain/value-objects/Identifier';

// @external
import { v4 as uuid } from 'uuid';

export class UniqueUUID extends Identifier<string> {
  public constructor(id?: string) {
    super(id ?? uuid());
  }
}

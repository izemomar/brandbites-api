import { DateTimeValueObject } from './DateTimeValueObject';

export class DeletedAt extends DateTimeValueObject {
  public constructor(dateObj: Date) {
    super(dateObj);
  }
}

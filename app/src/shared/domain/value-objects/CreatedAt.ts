import { DateTimeValueObject } from './DateTimeValueObject';

export class CreatedAt extends DateTimeValueObject {
  public constructor(dateObj: Date) {
    super(dateObj);
  }
}

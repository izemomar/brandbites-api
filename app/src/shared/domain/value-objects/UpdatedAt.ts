import { DateTimeValueObject } from './DateTimeValueObject';

export class UpdatedAt extends DateTimeValueObject {
  public constructor(dateObj: Date) {
    super(dateObj);
  }
}

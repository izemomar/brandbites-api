import { IBusinessRule } from '@shared/domain/interfaces/IBusinessRule';

export class DateTimeRule implements IBusinessRule {
  message: string;

  constructor(private readonly date: string, private readonly time: string) {
    this.message = 'The date and time are invalid.';
  }

  isBroken(): boolean {
    if (!this.date || !this.time) {
      return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (!dateRegex.test(this.date) || !timeRegex.test(this.time)) {
      return false;
    }

    const dateTime = new Date(`${this.date}T${this.time}Z`);

    return isNaN(dateTime.getTime());
  }
}

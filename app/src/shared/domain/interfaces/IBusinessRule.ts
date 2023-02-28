export interface IBusinessRule {
  message: string;
  isBroken(): boolean;
}

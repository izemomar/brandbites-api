export class AuthorizationException extends Error {
  constructor(public readonly message: string = 'Unauthorized request') {
    super(message);
    this.name = 'AuthorizationException';
  }
}

export class OidcCallbackException extends Error {
  constructor() {
    super("A callback from the auth provider was unhandled.");
  }
}

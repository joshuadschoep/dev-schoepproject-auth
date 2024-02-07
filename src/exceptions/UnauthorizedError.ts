export class UnauthorizedError extends Error {
  constructor() {
    // https://github.com/Microsoft/TypeScript/issues/15875
    super("You are not authorized to view this content");
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
    this.name = "UnauthorizedError";
  }
}

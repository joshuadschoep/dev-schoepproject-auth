export class InternalServerError extends Error {
    constructor() {
        // https://github.com/Microsoft/TypeScript/issues/15875
        super("An internal server error has occured");
        Object.setPrototypeOf(this, InternalServerError.prototype);
        this.name = "InternalServerError"
    }
}

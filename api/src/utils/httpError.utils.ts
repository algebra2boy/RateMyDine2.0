export class HttpError extends Error {
    errorCode: number;
    constructor(
        errorCode: number,
        public readonly message: string | any,
    ) {
        super(message);
        this.errorCode = errorCode;
    }
}

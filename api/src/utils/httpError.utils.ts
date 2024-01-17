type ErrorMessage = { message: string };

export class HttpError extends Error {
    errorCode: number;
    public readonly error: ErrorMessage;

    constructor(errorCode: number, error: ErrorMessage) {
        super(error.message);
        this.errorCode = errorCode;
        this.error = error;
    }
}

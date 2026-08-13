export type ApiErrorBody = {
    message?: string;
    errors?: Record<string, string>;
};

export class ApiRequestError extends Error {
    status: number;
    fieldErrors: Record<string, string>;

    constructor(
        message: string,
        status: number,
        fieldErrors: Record<string, string> = {},
    ) {
        super(message);

        this.name = "ApiRequestError";
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

export function isApiErrorBody(body: unknown): body is ApiErrorBody {
    return typeof body === "object" && body !== null;
}



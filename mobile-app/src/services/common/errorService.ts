import {readResponseBody} from "@/src/services/common/helperService";

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

export function throwApiRequestError(
    status: number,
    body: unknown,
    fallbackMessage: string
): never {
    let message = fallbackMessage;
    let fieldErrors: Record<string, string> = {};

    if (isApiErrorBody(body)) {
        fieldErrors = body.errors ?? {};

        if (body.message?.trim()) {
            message = body.message;
        } else if (Object.keys(fieldErrors).length > 0) {
            message = "Controlla i campi evidenziati";
        }
    }

    console.error(
        `ERRORE FETCH | ${status} |`,
        body
    );

    throw new ApiRequestError(
        message,
        status,
        fieldErrors
    );
}

export function isApiErrorBody(
    body: unknown
): body is ApiErrorBody {
    if (
        typeof body !== "object" ||
        body === null
    ) {
        return false;
    }

    const candidate = body as ApiErrorBody;

    return (
        candidate.message === undefined ||
        typeof candidate.message === "string"
    ) && (
        candidate.errors === undefined ||
        (
            typeof candidate.errors === "object" &&
            candidate.errors !== null
        )
    );
}



//interfaccia e classe che rispecchiano il contratto del backend, permettendo il mapping 1:1
export interface ApiErrorResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    errors: Record<string, string[]>;
    path: string;
    traceId: string;
}

export class ApiRequestError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly code: string = "UNKNOWN_ERROR",
        public readonly errors: Record<string, string[]> = {},
        public readonly traceId?: string
    ) {
        super(message);
        this.name = "ApiRequestError";
    }
}


export function printApiRequestError(error : ApiRequestError){
    console.log("Status: " + error.status)
    console.log("Code: " + error.code)
    console.log("Errors: " + error.errors)
    console.log("Trace: " + error.traceId)
    console.log("Message: " + error.message)

}


//mapping delle response con errore, con fallback in caso di errore malformato/sconosciuto
//prende il body della response in input per verificare se si tratta di un errore
export function throwApiRequestError(
    status: number,
    body: unknown,
    fallbackMessage: string
): never {
    if (isApiErrorResponse(body)) {
        throw new ApiRequestError(
            body.message,
            body.status,
            body.code,
            body.errors,
            body.traceId
        );
    }

    throw new ApiRequestError(
        fallbackMessage,
        status
    );
}

//verifica se la response è un errore benformato
export function isApiErrorResponse(
    value: unknown
): value is ApiErrorResponse {
    if (
        value === null ||
        typeof value !== "object"
    ) {
        return false;
    }

    const response =
        value as Partial<ApiErrorResponse>;

    return (
        typeof response.status === "number" &&
        typeof response.code === "string" &&
        typeof response.message === "string" &&
        response.errors !== null &&
        typeof response.errors === "object" &&
        typeof response.path === "string" &&
        typeof response.traceId === "string"
    );
}

//trasforma errore imprevisti in ApiRequestError
export function normalizeApiRequestError(
    error: unknown,
    fallbackMessage =
        "Si è verificato un errore imprevisto"
): ApiRequestError {
    if (error instanceof ApiRequestError) {
        return error;
    }

    console.error(
        "Errore frontend imprevisto:",
        error
    );

    return new ApiRequestError(
        fallbackMessage,
        0,
        "UNEXPECTED_ERROR"
    );
}


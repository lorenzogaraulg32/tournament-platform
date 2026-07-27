const API_URL = process.env.EXPO_PUBLIC_API_URL;


export type RegisterRequest = {
    email: string;
    username: string;
    password: string;
};


export type RegisterResponse = {
    message: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};


export type LoginResponse = {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
};

type ApiErrorBody = {
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

function isApiErrorBody(body: unknown): body is ApiErrorBody {
    return typeof body === "object" && body !== null;
}

async function readResponseBody(
    response: Response,
): Promise<unknown> {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}


export async function loginUser(
    request: LoginRequest,
): Promise<LoginResponse> {
    if (!API_URL) {
        throw new Error("EXPO_PUBLIC_API_URL non configurata");
    }

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });


    const body = await readResponseBody(response);

    if (!response.ok) {
        if (typeof body === "string") {
            throw new ApiRequestError(
                body || "Errore durante il login",
                response.status,
            );
        }

        const fieldErrors =
            isApiErrorBody(body) && body.errors
                ? body.errors
                : {};

        const firstFieldError =
            Object.values(fieldErrors)[0];

        const message =
            isApiErrorBody(body) && body.message
                ? body.message
                : firstFieldError || "Errore durante il login";

        throw new ApiRequestError(
            message,
            response.status,
            fieldErrors,
        );
    }

    return body as LoginResponse;
}


export async function registerUser(
    request: RegisterRequest,
): Promise<RegisterResponse> {
    if (!API_URL) {
        throw new Error("EXPO_PUBLIC_API_URL non configurata");
    }

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });


    const body = await readResponseBody(response);

    if (!response.ok) {
        if (typeof body === "string") {
            throw new ApiRequestError(
                body || "Errore durante la registrazione",
                response.status,
            );
        }

        const fieldErrors =
            isApiErrorBody(body) && body.errors
                ? body.errors
                : {};

        const firstFieldError =
            Object.values(fieldErrors)[0];

        const message =
            isApiErrorBody(body) && body.message
                ? body.message
                : firstFieldError || "Errore durante la registrazione";

        throw new ApiRequestError(
            message,
            response.status,
            fieldErrors,
        );
    }

    return body as RegisterResponse;
}


import * as SecureStore from "expo-secure-store";
import {ApiRequestError, throwApiRequestError} from "@/src/services/common/errorService";
import {readResponseBody} from "@/src/services/common/helperService";
import {router} from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type RegisterRequest = {
    email: string;
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

export type AuthInfo = {
    id: string,
    email: string,
    enabled: boolean,
    globalRole: GlobalRole
}

export type GlobalRole = "ROLE_ADMIN" | "ROLE_USER"


export async function loginUser(
    request: LoginRequest
): Promise<LoginResponse> {
    if (!API_URL) {
        throw new Error(
            "EXPO_PUBLIC_API_URL non configurata"
        );
    }

    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }
    );

    const body = await readResponseBody(response);

    if (!response.ok) {
        throwApiRequestError(
            response.status,
            body,
            "Errore durante il login"
        );
    }

    return body as LoginResponse;
}

export async function registerUser(
    request: RegisterRequest
): Promise<RegisterResponse> {
    if (!API_URL) {
        throw new Error(
            "EXPO_PUBLIC_API_URL non configurata"
        );
    }

    const response = await fetch(
        `${API_URL}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }
    );

    const body = await readResponseBody(response);

    if (!response.ok) {
        throwApiRequestError(
            response.status,
            body,
            "Errore durante la registrazione"
        );
    }

    return body as RegisterResponse;
}

export async function handleLogout() {
    await clearSession()
    router.replace("/(auth)");
}

export async function loadCurrentUserId(): Promise<string> {
    const userInfo = await loadCurrentUserAuthInfo();
    return userInfo.id;
}

export async function loadCurrentUserAuthInfo() {

    const response = await authenticatedFetch(
        `${API_URL}/auth/me`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );


    return await response.json() as AuthInfo;


}

export async function loadUserAuthInfo(
    id: string
): Promise<AuthInfo> {
    const response = await authenticatedFetch(
        `${API_URL}/auth/${id}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as AuthInfo;
}

export async function authenticatedFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const authorization =
        await getAuthorizationHeader();

    const headers = new Headers(options.headers);
    headers.set("Authorization", authorization);

    let timeoutId:
        ReturnType<typeof setTimeout> | undefined;

    const timeoutPromise = new Promise<never>(
        (_, reject) => {
            timeoutId = setTimeout(() => {
                reject(
                    new ApiRequestError(
                        "La richiesta sta impiegando troppo tempo. Controlla la connessione.",
                        0
                    )
                );
            }, 10_000);
        }
    );

    let response: Response;

    try {
        response = await Promise.race([
            fetch(url, {
                ...options,
                headers,
            }),
            timeoutPromise,
        ]);
    } catch (error) {
        if (error instanceof ApiRequestError) {
            console.error(
                "ERRORE FETCH | TIMEOUT |",
                error
            );

            throw error;
        }

        console.error(
            "ERRORE FETCH | NETWORK |",
            error
        );

        throw new ApiRequestError(
            "Impossibile contattare il server. Controlla la connessione.",
            0
        );
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }

    if (!response.ok) {
        const body =
            await readResponseBody(response);

        if (response.status === 401) {
            await clearSession();
            router.replace("/(auth)");
        }

        throwApiRequestError(
            response.status,
            body,
            "Errore durante la richiesta"
        );
    }

    return response;
}

export async function getAuthorizationHeader(): Promise<string> {
    const [accessToken, tokenType] = await Promise.all([
        SecureStore.getItemAsync("accessToken"),
        SecureStore.getItemAsync("tokenType"),
    ]);

    if (!accessToken) {
        router.replace("/(auth)");

        throw new ApiRequestError(
            "Sessione non disponibile",
            401
        );
    }

    return `${tokenType ?? "Bearer"} ${accessToken}`;
}


export async function saveSession(
    accessToken: string,
    tokenType: string
) {
    await Promise.all([
        SecureStore.setItemAsync("accessToken", accessToken),
        SecureStore.setItemAsync("tokenType", tokenType),
    ]);
}


export async function clearSession(): Promise<void> {
    await Promise.all([
        SecureStore.deleteItemAsync("accessToken"),
        SecureStore.deleteItemAsync("tokenType"),
    ]);
}






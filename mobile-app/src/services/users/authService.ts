import * as SecureStore from "expo-secure-store";
import {ApiRequestError, isApiErrorBody} from "@/src/services/errorService";
import {readResponseBody} from "@/src/services/helperService";
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

export async function saveSession(
    accessToken: string,
    tokenType: string
) {
    await Promise.all([
        SecureStore.setItemAsync("accessToken", accessToken),
        SecureStore.setItemAsync("tokenType", tokenType),
    ]);
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


export async function getToken() {

    const accessToken =
        await SecureStore.getItemAsync(
            "accessToken"
        );

    const tokenType =
        await SecureStore.getItemAsync(
            "tokenType"
        );


    if (!accessToken) {
        return null;
    }

    return `${tokenType ?? "Bearer"} ${accessToken}`

}

export async function handleLogout() {
    await Promise.all([
        SecureStore.deleteItemAsync("accessToken"),
        SecureStore.deleteItemAsync("tokenType"),

    ]);
    router.replace("/(auth)");
}

export async function loadCurrentUserId(): Promise<string> {
    const userInfo = await loadCurrentUserAuthInfo();

    return userInfo.id;
}

export async function loadCurrentUserAuthInfo() {
    const accessToken =
        await SecureStore.getItemAsync("accessToken");

    const tokenType =
        await SecureStore.getItemAsync("tokenType");


    if (!accessToken) {
        router.replace("/(auth)");
        throw new Error("Access token non disponibile");
    }

    const response = await fetch(
        `${API_URL}/auth/me`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `${tokenType ?? "Bearer"} ${accessToken}`,
            },
        }
    );


    if (response.status === 401 || response.status === 403) {
        await Promise.all([
            SecureStore.deleteItemAsync("accessToken"),
            SecureStore.deleteItemAsync("tokenType"),
        ]);
        router.replace("/(auth)");
        throw new Error("Sessione scaduta o non autorizzata");
    }

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            errorBody || `Errore nel recupero utente: ${response.status}`
        );
    }

    return await response.json() as AuthInfo;


}

export async function loadUserAuthInfo(id : string){
    const accessToken =
        await SecureStore.getItemAsync("accessToken");

    const tokenType =
        await SecureStore.getItemAsync("tokenType");


    if (!accessToken) {
        router.replace("/(auth)");
        throw new Error("Access token non disponibile");
    }

    const response = await fetch(
        `${API_URL}/auth/`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `${tokenType ?? "Bearer"} ${accessToken}`,
            },
        }
    );


    if (response.status === 401 || response.status === 403) {
        await Promise.all([
            SecureStore.deleteItemAsync("accessToken"),
            SecureStore.deleteItemAsync("tokenType"),
        ]);
        router.replace("/(auth)");
        throw new Error("Sessione scaduta o non autorizzata");
    }

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            errorBody || `Errore nel recupero utente: ${response.status}`
        );
    }

    return await response.json() as AuthInfo;
}
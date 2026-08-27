import {throwApiRequestError} from "@/src/services/errorService";
import {router} from "expo-router";
import {authenticatedFetch, fetchWithTimeout, readResponseBody} from "@/src/services/fetchService";
import {clearSession} from "@/src/services/users/sessionService";

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

    const response = await fetchWithTimeout(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

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

    const response = await fetchWithTimeout(
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

export async function loadUserAuthInfo(id: string): Promise<AuthInfo> {
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





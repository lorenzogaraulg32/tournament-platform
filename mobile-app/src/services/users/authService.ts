import {throwApiRequestError} from "@/src/services/errorService";
import {router} from "expo-router";
import {authenticatedFetch, fetchWithTimeout, readResponseBody} from "@/src/services/fetchService";
import {clearSession} from "@/src/services/users/sessionService";
import {jwtDecode, JwtPayload} from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import {
    GoogleOneTapSignIn,
    isCancelledResponse,
    isNoSavedCredentialFoundResponse,
    isSuccessResponse
} from "react-native-nitro-google-signin";

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

export type ModUserAuthRequest = {
    email: string | null,
    newPassword: string | null
    oldPassword: string | null
};

export type AuthInfo = {
    id: string,
    email: string,
    enabled: boolean,
    hasLocalAuthentication: boolean;
    externalProvider: ExternalProvider | null;
}


export enum ExternalProvider {
    GOOGLE = "GOOGLE",
}

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


export async function modUserAuthInfo(
    request: ModUserAuthRequest
) {

    const response = await authenticatedFetch(
        `${API_URL}/auth/credentials`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }
    )
}


export async function authenticateWithGoogle(
    idToken: string
) {

    const response = await fetchWithTimeout(
        `${API_URL}/auth/external-provider`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                provider: "GOOGLE",
                idToken,
            }),
        }
    )

    const loginRes = await readResponseBody(response)

    if (!response.ok) {
        throwApiRequestError(
            response.status,
            loginRes,
            "Errore durante il login"
        );
    }


    return loginRes as LoginResponse


}

export async function linkWithGoogle(
    idToken: string
) {

    const response = await authenticatedFetch(
        `${API_URL}/auth/external-provider/link`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                provider: "GOOGLE",
                idToken,
            }),
        }
    )
}

export async function unLinkWithGoogle() {

    const response = await authenticatedFetch(
        `${API_URL}/auth/external-provider/link`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
}

export async function requestGoogleIdToken(): Promise<string | null> {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

    if (!webClientId) {
        throw new Error("Google Client ID non configurato");
    }

    GoogleOneTapSignIn.configure({
        webClientId,
    });

    await GoogleOneTapSignIn.checkPlayServices();

    const response = await GoogleOneTapSignIn.presentExplicitSignIn();

    if (isCancelledResponse(response)) {
        return null;
    }

    if (!isSuccessResponse(response)) {
        throw new Error("Autenticazione Google non riuscita");
    }

    const {idToken} = response.data;

    if (!idToken) {
        throw new Error("ID token Google assente");
    }

    return idToken;
}

export async function linkExistingAccountGoogle(
    idToken: string,
    accessToken: string,
    tokenType: string
) {

    const response = await fetchWithTimeout(
        `${API_URL}/auth/external-provider/link`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${tokenType} ${accessToken}`,
            },
            body: JSON.stringify({
                provider: "GOOGLE",
                idToken,
            }),
        }
    );

    const loginRes = await readResponseBody(response)

    if (!response.ok) {
        throwApiRequestError(
            response.status,
            loginRes,
            "Errore durante collegamento dell'account"
        );
    }

    return loginRes as LoginResponse


}

export async function handleLogout() {
    await clearSession()
    router.replace("/(auth)");
}

export async function loadCurrentUserId(): Promise<string | null> {

    const token = await SecureStore.getItemAsync("accessToken");

    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (!decoded.sub) {
            return null;
        }

        if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
            return null;
        }

        return decoded.sub;

    } catch (error) {
        console.error("Errore decodifica JWT:", error);
        return null;
    }
}

/*
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
*/


export async function fetchAuthInfo(id: string): Promise<AuthInfo> {
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





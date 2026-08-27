import * as SecureStore from "expo-secure-store";
import {router} from "expo-router";
import {ApiRequestError} from "@/src/services/errorService";

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

export async function handleExpiredSession(): Promise<never> {
    await clearSession();
    router.replace("/(auth)");

    throw new ApiRequestError(
        "La sessione è scaduta. Accedi nuovamente.",
        401
    );
}

export async function saveSession(accessToken: string, tokenType: string) {
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
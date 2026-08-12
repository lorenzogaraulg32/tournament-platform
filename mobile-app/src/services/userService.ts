import * as SecureStore from "expo-secure-store";
import {router} from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
//role è da aggiungere al backend, e sarebbe il ruolo in campo, per ora solo calcetto, ma sarà da espandere per tutti i tipi di torneo

export type UserInfo = {
    id: number,
    username: string,
    email: string,
    enabled: boolean,
    globalRole: GlobalRole
    profilePicUrl: string,
    role: string,
}

export type GlobalRole = "ROLE_ADMIN" | "ROLE_USER"

export type UserInfoRequest = {
    email: string;
    username: string;
    password: string;
};


export async function handleLogout() {
    await Promise.all([
        SecureStore.deleteItemAsync("accessToken"),
        SecureStore.deleteItemAsync("tokenType"),

    ]);
    router.replace("/(auth)");
}

export async function loadCurrentUserId(): Promise<number> {
    const userInfo = await loadUserInfo();
    return userInfo.id;
}


export async function loadUserInfo() {
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

    return await response.json() as UserInfo;


}
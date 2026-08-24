import * as SecureStore from "expo-secure-store";
import {File} from "expo-file-system";
import {fetch} from "expo/fetch";
import {ApiRequestError, isApiErrorBody} from "@/src/services/common/errorService";
import {readResponseBody} from "@/src/services/common/helperService";
import {SelectedLogo} from "@/src/components/common/images/LogoField";
import {router} from "expo-router";
import {Gender, GeoLocation, Sport, UserSportRole} from "@/src/services/users/userConstants";

const API_URL = process.env.EXPO_PUBLIC_API_URL;


export type UserEntity = {
    id: string
    userInfo: UserInfo
}


export async function completeOnBoarding(
    userData: UserOnBoardingInfo
): Promise<UserInfo> {

    const accessToken =
        await SecureStore.getItemAsync("accessToken");

    if (!accessToken) {
        throw new Error("Sessione scaduta");
    }


    if (!API_URL) {
        throw new Error("EXPO_PUBLIC_API_URL non configurata");
    }

    const response = await fetch(
        `${API_URL}/users/me`,
        {
            method: "POST",
            headers: {
                Authorization:
                    `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        }
    );


    const body = await readResponseBody(response);

    if (!response.ok) {
        let message =
            "Errore durante il completamento dell'onboarding";

        if (typeof body === "string") {
            message = body;
        } else if (isApiErrorBody(body)) {
            message =
                body.message ||
                Object.values(body.errors ?? {})[0] ||
                message;
        }

        throw new ApiRequestError(
            message,
            response.status,
        );
    }

    return body as UserInfo;
}

export async function uploadProfilePicture(
    logo: SelectedLogo
): Promise<void> {

    const accessToken =
        await SecureStore.getItemAsync("accessToken");

    if (!accessToken) {
        throw new Error("Sessione scaduta");
    }

    if (!API_URL) {
        throw new Error("EXPO_PUBLIC_API_URL non configurata");
    }

    const pictureFile = new File(logo.uri);

    if (!pictureFile.exists) {
        throw new Error(
            "L'immagine selezionata non è più disponibile"
        );
    }

    const formData = new FormData();

    formData.append(
        "file",
        pictureFile
    );

    const response = await fetch(
        `${API_URL}/users/me/profile-picture`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        throw new ApiRequestError(
            "Errore durante il caricamento della foto profilo",
            response.status
        );
    }
}


export async function loadUserInfo(
    id: string
): Promise<UserInfo> {
    const accessToken =
        await SecureStore.getItemAsync("accessToken");

    const tokenType =
        await SecureStore.getItemAsync("tokenType");


    if (!accessToken) {
        router.replace("/(auth)");
        throw new Error("Access token non disponibile");
    }

    const response = await fetch(
        `${API_URL}/users/${id}`,
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

        throw new ApiRequestError(
            errorBody || `Errore nel recupero utente: ${response.status}`,
            response.status
        );
    }

    return await response.json() as UserInfo;

}



export type UserOnBoardingInfo = {
    username: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    gender: Gender | null;
    sports: Sport[];
    roles: UserSportRole[];
    location: GeoLocation | null;
};


export type UserInfo = {
    username: string;
    firstName: string;
    lastName: string;
    birthDate: string | null;
    gender: Gender | null;
    sports: Sport[];
    roles: UserSportRole[];
    location: GeoLocation | null;
    profilePicUrl?: string,
};




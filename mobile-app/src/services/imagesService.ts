import * as SecureStore from "expo-secure-store";
import {File} from "expo-file-system";
import {fetch} from "expo/fetch";
import {ApiRequestError} from "@/src/services/errorService";

export type SelectedImage = {
    uri: string;
    fileName: string;
    mimeType: string;
    fileSize?: number;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function uploadProfilePicture(
    logo: SelectedImage
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






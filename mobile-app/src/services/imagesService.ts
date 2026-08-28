import {File} from "expo-file-system";
import {authenticatedFetch} from "@/src/services/fetchService";

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

    void await authenticatedFetch(
        `${API_URL}/users/me/profile-picture`,
        {
            method: "POST",
            headers: {},
            body: formData,
        }
    );
}






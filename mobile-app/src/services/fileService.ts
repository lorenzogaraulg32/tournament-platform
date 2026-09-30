import {authenticatedFetch} from "@/src/services/fetchService";
import {File as ExpoFile} from "expo-file-system";

export type SelectedImage = {
    uri: string;
    fileName: string;
    mimeType: string;
    fileSize?: number;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function uploadProfilePicture(
    image: SelectedImage
): Promise<void> {
    const formData = new FormData();
    const imageFile = new ExpoFile(image.uri);

    formData.append("file", imageFile, image.fileName);

    await authenticatedFetch(
        `${API_URL}/users/me/profile-picture`,
        {
            method: "POST",
            body: formData,
        }
    );

}

export type SelectedDocument = {
    uri: string;
    fileName: string;
    mimeType: string;
    fileSize?: number;
};

function isPdf(file: SelectedDocument): boolean {
    return file.mimeType === "application/pdf"
        || file.fileName.toLowerCase().endsWith(".pdf");
}





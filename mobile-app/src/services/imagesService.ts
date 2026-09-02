import {authenticatedFetch} from "@/src/services/fetchService";

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

    formData.append(
        "file",
        {
            uri: image.uri,
            name: image.fileName,
            type: image.mimeType,
        } as unknown as Blob
    );

    await authenticatedFetch(
        `${API_URL}/users/me/profile-picture`,
        {
            method: "POST",
            body: formData,
        }
    );
}





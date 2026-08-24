import * as SecureStore from "expo-secure-store";
import {fetch} from "expo/fetch";
import {File, Paths} from "expo-file-system";

export type RecruitmentStatus = "OPEN" | "CLOSED";

export type TeamLocationRequest = {
    label: string;
    latitude: number;
    longitude: number;
};

export type TeamCreationRequest = {
    name: string;
    description?: string;
    status: RecruitmentStatus;
    location?: TeamLocationRequest;
};

export type TeamLogoUpload = {
    uri: string;
    fileName: string;
    mimeType: string;
    fileSize?: number;
};

export type TeamCreationResponse = {
    id: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createTeam(
    request: TeamCreationRequest,
    logo?: TeamLogoUpload | null
): Promise<TeamCreationResponse> {
    const accessToken =
        await SecureStore.getItemAsync("accessToken");

    if (!accessToken) {
        throw new Error("Sessione scaduta");
    }

    if (!API_URL) {
        throw new Error(
            "L'indirizzo del server non è configurato"
        );
    }

    const teamFile = new File(
        Paths.cache,
        `team-${Date.now()}.json`
    );

    try {
        teamFile.create({
            overwrite: true,
        });

        teamFile.write(
            JSON.stringify(request)
        );

        const formData = new FormData();

        formData.append(
            "team",
            teamFile
        );

        if (logo) {
            const logoFile = new File(logo.uri);

            console.log("Picture da inviare:", {
                uri: logoFile.uri,
                exists: logoFile.exists,
                size: logoFile.size,
                type: logoFile.type,
                name: logoFile.name,
            });

            if (!logoFile.exists) {
                throw new Error(
                    "L'immagine selezionata non è più disponibile"
                );
            }

            formData.append(
                "logo",
                logoFile
            );
        }

        const response = await fetch(
            `${API_URL}/teams`,
            {
                method: "POST",
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                },
                body: formData,
            }
        );

        const body = await response
            .json()
            .catch(() => null);

        if (!response.ok) {
            throw new Error(
                body?.message ??
                "Errore durante la creazione della squadra"
            );
        }

        return body as TeamCreationResponse;

    } catch (error) {
        console.error(
            "Errore durante la creazione della squadra:",
            error
        );

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            "Errore imprevisto durante la creazione della squadra"
        );

    } finally {
        if (teamFile.exists) {
            teamFile.delete();
        }
    }
}
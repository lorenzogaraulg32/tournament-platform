import {File, Paths} from "expo-file-system";
import {authenticatedFetch} from "@/src/services/fetchService";


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

        const response = await authenticatedFetch(
            `${API_URL}/teams`,
            {
                method: "POST",
                body: formData,
            }
        );

        return await response.json() as TeamCreationResponse;

    } finally {
        if (teamFile.exists) {
            teamFile.delete();
        }
    }
}
import {File, Paths} from "expo-file-system";
import {authenticatedFetch} from "@/src/services/fetchService";
import {LocationRequest} from "@/src/services/common";


export type RecruitmentStatus = "OPEN" | "CLOSED";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type TeamCreationRequest = {
    name: string;
    description?: string;
    status: RecruitmentStatus;
    location?: LocationRequest;
};

export type TeamUpdateRequest = {
    name?: string;
    description?: string;
    status?: RecruitmentStatus;
    location?: LocationRequest | null;
    logoUrl?: "REMOVE";
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

export async function checkTeamNameAlreadyExists(teamName: string): Promise<string>{

    const response = await authenticatedFetch(
        `${API_URL}/teams/name/${encodeURIComponent(teamName)}`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        }
    );
    return await response.text();
}




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

        formData.append("team", teamFile, teamFile.name);

        if (logo) {
            const logoFile = new File(logo.uri);

            formData.append("logo", logoFile, logo.fileName);
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


export async function editTeam(
    teamId: string,
    request: TeamUpdateRequest,
    logo?: TeamLogoUpload | null
): Promise<void> {
    const teamFile = new File(
        Paths.cache,
        `team-update-${Date.now()}.json`
    );

    try {
        teamFile.create({overwrite: true});
        teamFile.write(JSON.stringify(request));

        const formData = new FormData();

        // File reale, non un oggetto convertito tramite cast.
        formData.append("team", teamFile, teamFile.name);

        if (logo) {
            const logoFile = new File(logo.uri);

            formData.append(
                "logo",
                logoFile,
                logo.fileName
            );
        }

        await authenticatedFetch(
            `${API_URL}/teams/${encodeURIComponent(teamId)}`,
            {
                method: "PATCH",
                body: formData,
            }
        );

        // 204 No Content: nessun response.json().
    } finally {
        if (teamFile.exists) {
            teamFile.delete();
        }
    }
}
import * as SecureStore from "expo-secure-store";

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
    location: TeamLocationRequest;
};

export type TeamCreationResponse = {
    id: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createTeam(
    request: TeamCreationRequest
): Promise<TeamCreationResponse> {
    const accessToken =
        await SecureStore.getItemAsync("accessToken");

    if (!accessToken) {
        throw new Error("Sessione scaduta");
    }

    const response = await fetch(`${API_URL}/teams`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            body?.message ??
            "Errore durante la creazione della squadra"
        );
    }

    return body;
}
import {authenticatedFetch} from "@/src/services/fetchService";


const API_URL = process.env.EXPO_PUBLIC_API_URL;


export type TeamInfo = {
    id: number;
    name: string;
    logoUrl: string | null;
    numberOfPlayers: number;
};


export type TeamDetails = {
    id: number;
    name: string;
    description: string;
    locationLabel: string;
    logoUrl?: string | null;
    creatorId: string;
    playerIds: string[];
    adminIds: string[];
    invitationCode: string;
};


export async function getCurrentUserTeams(): Promise<TeamInfo[]> {
    const response = await authenticatedFetch(
        `${API_URL}/teams/my-teams`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as TeamInfo[];
}

export async function loadUserTeams(userId: string): Promise<TeamInfo[]> {
    const response = await authenticatedFetch(
        `${API_URL}/teams/user/${encodeURIComponent(userId)}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as TeamInfo[];
}

export async function addCurrentUserToTeamViaCode(
    code: string
): Promise<TeamDetails> {
    const response = await authenticatedFetch(
        `${API_URL}/teams/players/${encodeURIComponent(code)}`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as TeamDetails;
}

export async function refreshCode(
    teamId: number
): Promise<TeamDetails> {
    const response = await authenticatedFetch(
        `${API_URL}/teams/${teamId}/change_code`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as TeamDetails;
}

export async function getTeamDetails(id: string): Promise<TeamDetails> {
    const response = await authenticatedFetch(
        `${API_URL}/teams/${encodeURIComponent(id)}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as TeamDetails;
}
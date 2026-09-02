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

function requireApiUrl(): string {
    if (!API_URL) {
        throw new Error(
            "EXPO_PUBLIC_API_URL non configurata"
        );
    }

    return API_URL;
}

export async function getCurrentUserTeams(): Promise<TeamInfo[]> {
    const response = await authenticatedFetch(
        `${requireApiUrl()}/teams/my-teams`,
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
        `${requireApiUrl()}/teams/user/${encodeURIComponent(userId)}`,
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
        `${requireApiUrl()}/teams/players/${encodeURIComponent(code)}`,
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
        `${requireApiUrl()}/teams/${teamId}/change_code`,
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
        `${requireApiUrl()}/teams/${encodeURIComponent(id)}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as TeamDetails;
}
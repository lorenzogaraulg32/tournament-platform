import * as SecureStore from "expo-secure-store";
import {handleLogout, loadCurrentUserId} from "@/src/services/users/authService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;


export type TeamInfo = {
    id: number,
    name: string,
    logoUrl: string | null;
    numberOfPlayers: number
}


export type TeamDetails = {
    id: number;
    name: string;
    description: string,
    locationLabel: string,
    logoUrl?: string | null;
    creatorId: string;
    playerIds: string[];
    adminIds: string[];
    invitationCode: string
};


export async function getCurrentUserTeams(): Promise<TeamInfo[]> {

    const accessToken =
        await SecureStore.getItemAsync("accessToken");

    const tokenType =
        await SecureStore.getItemAsync("tokenType");

    if (!accessToken) {
        throw new Error("Access token non disponibile");
    }

    const response = await fetch(
        `${API_URL}/teams/my-teams`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `${tokenType ?? "Bearer"} ${accessToken}`,
            },
        }
    );

    if (response.status === 401 || response.status === 403) {
        await handleLogout();
        throw new Error("Sessione scaduta o accesso non autorizzato");
    }


    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            errorBody || `Errore nel recupero delle squadre: ${response.status}`
        );
    }

    return await response.json() as TeamInfo[];

}

export async function getUserTeams(userId: string): Promise<TeamInfo[]> {

    const accessToken =
        await SecureStore.getItemAsync("accessToken");

    const tokenType =
        await SecureStore.getItemAsync("tokenType");

    if (!accessToken) {
        throw new Error("Access token non disponibile");
    }

    const response = await fetch(
        `${API_URL}/teams/user/${userId}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `${tokenType ?? "Bearer"} ${accessToken}`,
            },
        }
    );

    if (response.status === 401 || response.status === 403) {
        await handleLogout();
        throw new Error("Sessione scaduta o accesso non autorizzato");
    }


    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            errorBody || `Errore nel recupero delle squadre: ${response.status}`
        );
    }

    return await response.json() as TeamInfo[];

}


export async function addCurrentUserToTeamViaCode(code: string) {

    const accessToken = await SecureStore.getItemAsync("accessToken");

    const tokenType = await SecureStore.getItemAsync("tokenType");

    if (!accessToken) {
        throw new Error("Access token non disponibile");
    }

    const response = await fetch(
        `${API_URL}/teams/players/${code}`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `${tokenType ?? "Bearer"} ${accessToken}`,
            },
        }
    );

    if (response.status === 401 || response.status === 403) {
        console.log("Non autorizzato al refresh del codice")
    }


    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            errorBody || `Errore nel cambio del codice: ${response.status}`
        );
    }

    return await response.json() as TeamDetails;


}

export async function refreshCode(teamId: number) {

    const accessToken =
        await SecureStore.getItemAsync("accessToken");

    const tokenType =
        await SecureStore.getItemAsync("tokenType");

    if (!accessToken) {
        throw new Error("Access token non disponibile");
    }

    const response = await fetch(
        `${API_URL}/teams/${teamId}/change_code`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `${tokenType ?? "Bearer"} ${accessToken}`,
            },
        }
    );

    if (response.status === 401 || response.status === 403) {
        console.log("Non autorizzato al refresh del codice")
    }


    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            errorBody || `Errore nel cambio del codice: ${response.status}`
        );
    }

    return await response.json() as TeamDetails;


}

async function patchTeam() {

}


export async function getTeamDetails(id: string): Promise<TeamDetails> {

    const accessToken =
        await SecureStore.getItemAsync("accessToken");

    const tokenType =
        await SecureStore.getItemAsync("tokenType");

    if (!accessToken) {
        throw new Error("Access token non disponibile");
    }

    const response = await fetch(
        `${API_URL}/teams/${id}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `${tokenType ?? "Bearer"} ${accessToken}`,
            },
        }
    );

    if (response.status === 401 || response.status === 403) {
        await handleLogout();
        throw new Error("Sessione scaduta o accesso non autorizzato");
    }


    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            errorBody || `Errore nel recupero della squadra: ${response.status}`
        );
    }

    return await response.json() as TeamDetails;

}
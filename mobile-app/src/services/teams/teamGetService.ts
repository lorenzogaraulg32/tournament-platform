import {handleLogout} from "@/src/services/userService";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;


export type TeamInfo = {
    id: number,
    name: string,
    logoUrl: string | null;
    numberOfPlayers : number
}


export type TeamDetails = {
    id: number;
    name: string;
    logoUrl?: string | null;
    creatorId: string;
    playerIds: string[];
    adminIds: string[];
};


export async function getUserTeams(): Promise<TeamInfo[]> {

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


export async function getTeamDetails(id : string): Promise<TeamDetails> {

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
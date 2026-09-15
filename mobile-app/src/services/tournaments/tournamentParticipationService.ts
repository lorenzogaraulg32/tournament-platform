import {authenticatedFetch} from "@/src/services/fetchService";

export async function leaveTournament(teamId: string, tournamentId: string) {

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    await authenticatedFetch(
        `${API_URL}/tournaments/leave/${encodeURIComponent(tournamentId)}/${encodeURIComponent(teamId)}`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
        }
    );

}
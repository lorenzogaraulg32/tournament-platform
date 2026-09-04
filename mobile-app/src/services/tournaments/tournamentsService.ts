import {CreateTournamentRequest, UserTournamentsResponse} from "@/src/services/tournaments/tournamentsDTO";
import {authenticatedFetch} from "@/src/services/fetchService";
import {getCurrentUserTeams} from "@/src/services/teams/teamService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;


export async function createTournament(tournament: CreateTournamentRequest) {


}


export async function getCurrentUserTournaments(): Promise<UserTournamentsResponse> {

    const myTeams = await getCurrentUserTeams();

    const queryParams = new URLSearchParams();

    myTeams.forEach((team) => {
        queryParams.append("myTeamIds", String(team.id));
    });

    const query = queryParams.toString();

    const response = await authenticatedFetch(
        `${API_URL}/tournaments/my-tournaments${
            query ? `?${query}` : ""
        }`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return (await response.json()) as UserTournamentsResponse;
}


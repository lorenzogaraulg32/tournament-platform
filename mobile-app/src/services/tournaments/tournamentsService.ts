import {
    TournamentCreationRequest,
    TournamentDetails,
    TournamentFormat,
    TournamentStatus,
    UserTournamentsResponse
} from "@/src/services/tournaments/tournamentsConst";
import {authenticatedFetch} from "@/src/services/fetchService";
import {fetchUserTeams} from "@/src/services/teams/teamService";
import {loadCurrentUserId} from "@/src/services/users/authService";
import {SelectedDocument, SelectedImage} from "@/src/services/fileService";
import {RecruitmentStatus} from "@/src/services/common";

const API_URL = process.env.EXPO_PUBLIC_API_URL;


export async function createTournament(
    request: TournamentCreationRequest,
    logo?: SelectedImage | null,
    rules?: SelectedDocument | null
) : Promise<TournamentDetails> {
    //todo: Implementare il fetch creazione torneo
    return {
        adminsId: [],
        createdAt: "",
        createdById: "",
        description: "",
        endDate: "",
        format: TournamentFormat.GROUPS,
        id: "",
        invitationCode: "",
        location: undefined,
        logoUrl: undefined,
        maxTeams: 0,
        minTeams: 0,
        name: "",
        registeredTeamIds: [],
        rulesUrl: "",
        startDate: "",
        status: TournamentStatus.CREATED,
        updatedAt: "",
        recruitmentStatus: "CLOSED"
    }
}


export async function refreshCodeTournament(
    teamId: string
): Promise<TournamentDetails> {
    const response = await authenticatedFetch(
        `${API_URL}/tournaments/${teamId}/change_code`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as TournamentDetails;
}


export async function getCurrentUserTournaments(): Promise<UserTournamentsResponse> {

    const myTeams = await fetchUserTeams(await loadCurrentUserId());

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


export async function loadTournamentDetails(id: string): Promise<TournamentDetails> {
    const response = await authenticatedFetch(
        `${API_URL}/tournaments/${id}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return (await response.json()) as TournamentDetails;
}


export async function checkTournamentNameAlreadyExists(trimmedName: string) {
    const response = await authenticatedFetch(
        `${API_URL}/tournaments/nameCheck/${trimmedName}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

}

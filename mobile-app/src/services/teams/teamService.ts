import {authenticatedFetch} from "@/src/services/fetchService";
import {RecruitmentStatus} from "@/src/services/teams/teamCreationService";
import {leaveTournament} from "@/src/services/tournaments/tournamentParticipationService";
import {Sport} from "@/src/services/users/userConstants";


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
    status: RecruitmentStatus;
    locationLabel: string;
    latitude: number;
    longitude: number;
    logoUrl?: string | null;
    creatorId: string;
    playerIds: string[];
    adminIds: string[];
    invitationCode: string;
    sport: Sport;
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

export async function refreshCodeTeam(teamId: number): Promise<TeamDetails> {
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

export function teamDetailsToTeamInfo(team: TeamDetails): TeamInfo {
    return {
        id: team.id,
        name: team.name,
        logoUrl: team.logoUrl ? team.logoUrl : null,
        numberOfPlayers: team.playerIds.length,
    }
}

export async function removeTeamPlayer(
    teamId: string,
    userId: string
): Promise<void> {
    await authenticatedFetch(
        `${API_URL}/teams/${encodeURIComponent(teamId)}/players/${encodeURIComponent(userId)}`,
        {
            method: "DELETE",
        }
    );
}

export async function removeTeamAdmin(
    teamId: string,
    userId: string
): Promise<void> {
    await authenticatedFetch(
        `${API_URL}/teams/${encodeURIComponent(teamId)}/admins/${encodeURIComponent(userId)}`,
        {
            method: "DELETE",
        }
    );
}


export async function leaveTeam(teamId: string) {
    await authenticatedFetch(
        `${API_URL}/teams/leave/${encodeURIComponent(teamId)}`,
        {
            method: "DELETE",
        }
    );
}


export async function deleteTeam(teamId: string) {
    const tournamentIds = await canDeleteTeam(teamId);

    if (tournamentIds.length > 0) {
        for (const tournamentId of tournamentIds) {
            await leaveTournament(teamId, tournamentId);
        }
    }
    await authenticatedFetch(
        `${API_URL}/teams/${encodeURIComponent(teamId)}`,
        {
            method: "DELETE",
        }
    );
}


export async function canDeleteTeam(teamId: string): Promise<string[]> {
    const response = await authenticatedFetch(
        `${API_URL}/tournaments/can_delete_team/${encodeURIComponent(teamId)}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as string[];
}
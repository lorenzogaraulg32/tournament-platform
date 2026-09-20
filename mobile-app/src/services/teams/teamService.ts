import {authenticatedFetch} from "@/src/services/fetchService";
import {leaveTournament} from "@/src/services/tournaments/tournamentParticipationService";
import {TeamCreationRequest, TeamDetails, TeamUpdateRequest} from "@/src/services/teams/teamsConst";
import {SelectedImage} from "@/src/services/imagesService";
import {File, Paths} from "expo-file-system";
import {API_URL} from "@/src/services/common";


/* CRUD */
export async function fetchTeam(teamId: string): Promise<TeamDetails> {
    const response = await authenticatedFetch(
        `${API_URL}/teams/${encodeURIComponent(teamId)}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as TeamDetails;
}


export async function createTeam(
    request: TeamCreationRequest,
    logo?: SelectedImage | null
): Promise<TeamDetails> {


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

        return await response.json() as TeamDetails;
    } finally {
        if (teamFile.exists) {
            teamFile.delete();
        }
    }
}


export async function editTeam(
    teamId: string,
    request: TeamUpdateRequest,
    logo?: SelectedImage | null
): Promise<TeamDetails> {
    const teamFile = new File(
        Paths.cache,
        `team-update-${Date.now()}.json`
    );

    try {
        teamFile.create({overwrite: true});
        teamFile.write(JSON.stringify(request));

        const formData = new FormData();

        formData.append("team", teamFile, teamFile.name);

        if (logo) {
            const logoFile = new File(logo.uri);

            formData.append(
                "logo",
                logoFile,
                logo.fileName
            );
        }

        const response = await authenticatedFetch(
            `${API_URL}/teams/${encodeURIComponent(teamId)}`,
            {
                method: "PATCH",
                body: formData,
            }
        );

        return await response.json() as TeamDetails;

    } finally {
        if (teamFile.exists) {
            teamFile.delete();
        }
    }
}


export async function fetchUserTeams(
    userId: string
): Promise<TeamDetails[]> {
    const response = await authenticatedFetch(
        `${API_URL}/teams/user/${encodeURIComponent(userId)}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as TeamDetails[];
}

export async function addPlayer(
    invitationCode: string
): Promise<TeamDetails> {
    const response = await authenticatedFetch(
        `${API_URL}/teams/players/${encodeURIComponent(invitationCode)}`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        }
    );

    return await response.json() as TeamDetails;
}

export async function refreshInvitationCode(teamId: string): Promise<TeamDetails> {
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


/* utils endpoints */

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


export async function checkTeamNameAlreadyExists(teamName: string): Promise<string> {

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



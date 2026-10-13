import {authenticatedFetch} from "@/src/services/fetchService";
import {leaveTournament} from "@/src/services/tournaments/tournamentParticipationService";
import {TeamCreationRequest, TeamDetails, TeamFormation, TeamUpdateRequest} from "@/src/services/teams/teamDTO";
import {File, Paths} from "expo-file-system";
import {API_URL, getLocalDateTime} from "@/src/services/common";
import {throwApiRequestError} from "@/src/services/errorService";
import {postActivity} from "@/src/services/activities/activityService";
import {Action, EntityType} from "@/src/services/activities/ActivityDTO";
import {fetchUser, requestUserActor} from "@/src/services/users/userService";
import {fetchTournament} from "@/src/services/tournaments/tournamentService";


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

    const team: TeamDetails = await response.json() as TeamDetails;

    return enrichTeamMedia(team);

}


export async function createTeam(
    request: TeamCreationRequest,
): Promise<TeamDetails> {

    const {logo, ...teamRequest} = request;

    const teamFile = new File(
        Paths.cache,
        `team-${Date.now()}.json`
    );

    try {
        teamFile.create({overwrite: true});

        teamFile.write(
            JSON.stringify(teamRequest)
        );

        const formData = new FormData();

        formData.append("team", teamFile, teamFile.name);

        if (logo !== undefined && logo !== null) {
            const logoFile = new File(logo.uri);

            formData.append(
                "logo",
                logoFile,
                logo.fileName ?? logoFile.name
            );
        }

        const response = await authenticatedFetch(
            `${API_URL}/teams`,
            {
                method: "POST",
                body: formData,
            }
        );

        const createdTeam = await response.json() as TeamDetails;


        await postActivity({
            issuedAt: getLocalDateTime(),
            actor: await requestUserActor(),
            subject: {
                id: createdTeam.id,
                entityName: createdTeam.name,
                type: EntityType.TEAM
            },
            context: undefined,
            action: Action.CREATED_TEAM,
            details: undefined
        })

        return createdTeam

    } finally {
        if (teamFile.exists) {
            teamFile.delete();
        }
    }
}


export async function editTeam(
    teamId: string,
    request: TeamUpdateRequest,
): Promise<TeamDetails> {

    const {logo, ...teamRequest} = request;

    const requestBody = {
        ...teamRequest,
        removeLogo: logo === null,
    };

    const teamFile = new File(
        Paths.cache,
        `team-update-${Date.now()}.json`
    );

    try {
        teamFile.create({overwrite: true});
        teamFile.write(
            JSON.stringify(requestBody)
        );

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

        const newTeam = await response.json() as TeamDetails;


        await postActivity({
            issuedAt: getLocalDateTime(),
            actor: await requestUserActor(),
            subject: {
                id: newTeam.id,
                entityName: newTeam.name,
                type: EntityType.TEAM
            },
            context: undefined,
            action: Action.MODIFIED_TEAM,
            details: undefined
        })


        return enrichTeamMedia(newTeam);

    } finally {
        if (teamFile.exists) {
            teamFile.delete();
        }
    }
}


export async function deleteTeam(teamDetails: TeamDetails) {

    const tournamentIds = await canDeleteTeam(teamDetails.id);

    if (tournamentIds.length > 0) {
        for (const tournamentId of tournamentIds) {
            const tournament = await fetchTournament(tournamentId)
            await leaveTournament(teamDetails, tournament);
        }
    }
    await authenticatedFetch(
        `${API_URL}/teams/${encodeURIComponent(teamDetails.id)}`,
        {
            method: "DELETE",
        }
    );

    await postActivity({
        issuedAt: getLocalDateTime(),
        actor: await requestUserActor(),
        subject: {
            id: teamDetails.id,
            entityName: teamDetails.name,
            type: EntityType.TEAM
        },
        context: undefined,
        action: Action.DELETED_TEAM,
        details: undefined
    })
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

    const teams = await response.json() as TeamDetails[];

    return teams.map(enrichTeamMedia);
}


export async function updateTeamFormation(
    team: TeamDetails,
    formation: TeamFormation
): Promise<TeamFormation> {


    const response = await authenticatedFetch(
        `${API_URL}/teams/${encodeURIComponent(team.id)}/formation`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formation),
        }
    );

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);

        throwApiRequestError(
            response.status,
            errorBody,
            "Errore impostazione della formazione"
        );
    }

    await postActivity({
        issuedAt: getLocalDateTime(),
        actor: await requestUserActor(),
        subject: {
            id: team.id,
            entityName: team.name,
            type: EntityType.TEAM
        },
        context: undefined,
        action: Action.MODIFIED_LINEUP,
        details: undefined
    })


    return (await response.json()) as TeamFormation;
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


    const team = await response.json() as TeamDetails
    const actor = await requestUserActor();

    await postActivity({
        issuedAt: getLocalDateTime(),
        actor: actor,
        subject: actor,
        context: {
            id: team.id,
            entityName: team.name,
            type: EntityType.TEAM
        },
        action: Action.JOINED_TEAM,
        details: undefined
    })

    return team
}

export async function refreshInvitationCode(teamId: string): Promise<TeamDetails> {
    const response = await authenticatedFetch(
        `${API_URL}/teams/${encodeURIComponent(teamId)}/change_code`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        }
    );

    const team = await response.json() as TeamDetails

    await postActivity({
        issuedAt: getLocalDateTime(),
        actor: await requestUserActor(),
        subject: {
            id: team.id,
            entityName: team.name,
            type: EntityType.TEAM
        },
        context: undefined,
        action: Action.REFRESHED_INVITATION_TEAM,
        details: undefined
    })

    return team
}


export async function removeTeamPlayer(
    team: TeamDetails,
    userId: string
): Promise<void> {
    await authenticatedFetch(
        `${API_URL}/teams/${encodeURIComponent(team.id)}/players/${encodeURIComponent(userId)}`,
        {
            method: "DELETE",
        }
    );

    const removedUser = await fetchUser(userId)

    await postActivity({
        issuedAt: getLocalDateTime(),
        actor: await requestUserActor(),
        subject: {
            id: removedUser.id,
            entityName: removedUser.username,
            type: EntityType.USER
        },
        context: {
            id: team.id,
            entityName: team.name,
            type: EntityType.TEAM
        },
        action: Action.REMOVED_FROM_TEAM,
        details: undefined
    })

}

export async function removeTeamAdmin(
    team: TeamDetails,
    userId: string
): Promise<void> {

    const removedAdmin = await fetchUser(userId)

    await authenticatedFetch(
        `${API_URL}/teams/${encodeURIComponent(team.id)}/admins/${encodeURIComponent(userId)}`,
        {
            method: "DELETE",
        }
    );

    await postActivity({
        issuedAt: getLocalDateTime(),
        actor: await requestUserActor(),
        subject: {
            id: removedAdmin.id,
            entityName: removedAdmin.username,
            type: EntityType.USER
        },
        context: {
            id: team.id,
            entityName: team.name,
            type: EntityType.TEAM
        },
        action: Action.DEMOTED_ADMIN,
        details: undefined
    })

}


export async function leaveTeam(team: TeamDetails) {
    await authenticatedFetch(
        `${API_URL}/teams/leave/${encodeURIComponent(team.id)}`,
        {
            method: "DELETE",
        }
    );

    const actor = await requestUserActor()
    await postActivity({
        issuedAt: getLocalDateTime(),
        actor: actor,
        subject: actor,
        context: {
            id: team.id,
            entityName: team.name,
            type: EntityType.TEAM
        },
        action: Action.LEFT_TEAM,
        details: undefined
    })

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


export async function checkTeamNameAlreadyExists(teamName: string) {

    const response = await authenticatedFetch(
        `${API_URL}/teams/name/${encodeURIComponent(teamName)}`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        }
    );
}


function enrichTeamMedia(team: TeamDetails): TeamDetails {
    const teamId = encodeURIComponent(String(team.id));

    return {
        ...team,
        logo: {
            uri: `${API_URL}/teams/${teamId}/logo`,
        },
    };
}

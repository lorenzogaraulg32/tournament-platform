import {authenticatedFetch} from "@/src/services/fetchService";
import {postActivity} from "@/src/services/activities/activityService";
import {getLocalDateTime} from "@/src/services/common";
import {Action, EntityType} from "@/src/services/activities/ActivityDTO";
import {TeamDetails} from "@/src/services/teams/teamDTO";
import {TournamentDetails} from "@/src/services/tournaments/tournamentDTO";
import {normalizeApiRequestError, printApiRequestError} from "@/src/services/errorService";

export async function leaveTournament(team: TeamDetails, tournament: TournamentDetails) {

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const response = await authenticatedFetch(
        `${API_URL}/tournaments/leave/${encodeURIComponent(tournament.id)}/${encodeURIComponent(team.id)}`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
        }
    );


    if (!response.ok) {
        printApiRequestError(normalizeApiRequestError(response))
    }


    await postActivity({
        issuedAt: getLocalDateTime(),
        actor: {
            id: team.id,
            entityName: team.name,
            type: EntityType.TEAM
        },
        subject: {
            id: team.id,
            entityName: team.name,
            type: EntityType.TEAM
        },
        context: {
            id: tournament.id,
            entityName: tournament.name,
            type: EntityType.TOURNAMENT
        },
        action: Action.LEFT_TOURNAMENT,
        details: undefined
    })


}
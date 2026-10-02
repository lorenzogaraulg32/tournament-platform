import {
    TournamentCreationRequest,
    TournamentDetails,
    UserTournamentsResponse
} from "@/src/services/tournaments/tournamentDTO";
import {authenticatedFetch} from "@/src/services/fetchService";
import {fetchUserTeams} from "@/src/services/teams/teamService";
import {loadCurrentUserId} from "@/src/services/users/authService";
import {File, Paths} from "expo-file-system";

const API_URL = process.env.EXPO_PUBLIC_API_URL;


export async function createTournament(
    request: TournamentCreationRequest,
): Promise<TournamentDetails> {

    const {logo, rules, ...tournamentRequest} = request


    const tournamentFile = new File(
        Paths.cache,
        `tournament-${Date.now()}.json`
    );

    try {
        tournamentFile.create({overwrite: true});

        tournamentFile.write(
            JSON.stringify(tournamentRequest)
        );

        const formData = new FormData();

        formData.append("team", tournamentFile, tournamentFile.name);

        if (logo !== undefined && logo !== null) {
            const logoFile = new File(logo.uri);

            formData.append(
                "logo",
                logoFile,
                logo.fileName ?? logoFile.name
            );
        }

        if (rules !== undefined && rules !== null) {
            const rulesFile = new File(rules.uri);

            formData.append(
                "rules",
                rulesFile,
                rules.fileName ?? rulesFile.name
            );
        }
        const response = await authenticatedFetch(
            `${API_URL}/teams`,
            {
                method: "POST",
                body: formData,
            }
        );

        return await response.json() as TournamentDetails;
    } finally {
        if (tournamentFile.exists) {
            tournamentFile.delete();
        }
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


export async function getCurrentUserTournaments():
    Promise<UserTournamentsResponse> {

    const myTeams =
        await fetchUserTeams(await loadCurrentUserId());

    const queryParams = new URLSearchParams();

    myTeams.forEach(team => {
        queryParams.append(
            "myTeamIds",
            String(team.id)
        );
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

    const tournaments =
        await response.json() as UserTournamentsResponse;

    return {
        ...tournaments,

        managed: tournaments.managed.map(
            enrichTournamentMedia
        ),

        participating: tournaments.participating.map(
            enrichTournamentMedia
        ),
    };
}


export async function loadTournamentDetails(
    id: string
): Promise<TournamentDetails> {

    const response = await authenticatedFetch(
        `${API_URL}/tournaments/${id}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    const tournament =
        await response.json() as TournamentDetails;

    return enrichTournamentMedia(tournament);
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



function enrichTournamentMedia(
    tournament: TournamentDetails
): TournamentDetails {
    const tournamentId = encodeURIComponent(String(tournament.id));

    return {
        ...tournament,
        logo: {
            uri: `${API_URL}/tournaments/${tournamentId}/logo`,
        },
        rules: {
            uri: `${API_URL}/tournaments/${tournamentId}/rules`,
        },
    };
}
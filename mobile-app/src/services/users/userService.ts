import {UserCreationRequest, UserInfo, UserModRequest} from "@/src/services/users/userDTO";
import {authenticatedFetch} from "@/src/services/fetchService";
import {File, Paths} from "expo-file-system";
import {API_URL, getLocalDateTime} from "@/src/services/common";
import {Action, ActivityResponse, EntityReference, EntityType} from "@/src/services/activities/ActivityDTO";
import {AuthInfo, fetchAuthInfo, loadCurrentUserId} from "@/src/services/users/authService";
import {fetchActivities, postActivity} from "@/src/services/activities/activityService";
import type {TeamDetails} from "@/src/services/teams/teamDTO";
import {TournamentDetails} from "@/src/services/tournaments/tournamentDTO";
import {router} from "expo-router";
import {fetchUserTeams} from "@/src/services/teams/teamService";
import {fetchUserTournaments} from "@/src/services/tournaments/tournamentService";


export type ProfileData = {
    user: UserInfo;
    auth: AuthInfo;
    teams: TeamDetails[];
    activities: ActivityResponse[];
    managedTournaments: TournamentDetails[];
    isOwnProfile: boolean;
};

export async function fetchUserProfileData(profileId: string | undefined) : Promise <ProfileData | null> {

    const currentUserId = await loadCurrentUserId();

    if (currentUserId === null || currentUserId === undefined) {
        router.replace("/(auth)");
        return null;
    }

    const userId = profileId ?? String(currentUserId);
    const isOwnProfile = userId === String(currentUserId);

    const [teams, user, authInfo] = await Promise.all([
        fetchUserTeams(userId),
        fetchUser(userId),
        fetchAuthInfo(userId),
    ]);

    const tournaments = await fetchUserTournaments(teams, userId);

    //fetch attività, con fail gestito autonomamente
    let activities: ActivityResponse[] = [];
    try {
        activities = await fetchActivities(userId, EntityType.USER)
    } catch (activitiesError) {
        console.log("Errore recupero attività utente")
        console.log(activitiesError)
    }

    return {
        user: user,
        auth: authInfo,
        teams: teams,
        activities: activities,
        managedTournaments: tournaments.managed,
        isOwnProfile: isOwnProfile,
    }
}


export async function createUser(
    request: UserCreationRequest
): Promise<UserInfo> {

    const {avatar, ...userRequest} = request;

    const userFile = new File(
        Paths.cache,
        `user-${Date.now()}.json`
    );

    try {
        userFile.create({overwrite: true});

        userFile.write(
            JSON.stringify(userRequest)
        );

        const formData = new FormData();

        formData.append("user", userFile, userFile.name);

        if (avatar !== undefined && avatar !== null) {
            const avatarFile = new File(avatar.uri);

            formData.append(
                "avatar",
                avatarFile,
                avatar.fileName ?? avatarFile.name
            );
        }

        const response = await authenticatedFetch(
            `${API_URL}/users/me`,
            {
                method: "POST",
                body: formData,
            }
        );

        return await response.json() as UserInfo;

    } finally {
        if (userFile.exists) {
            userFile.delete();
        }
    }
}

export async function checkUsernameAlreadyExists(trimmedName: string) {
    const response = await authenticatedFetch(
        `${API_URL}/users/nameCheck/${trimmedName}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

}

export async function fetchUser(
    id: string
): Promise<UserInfo> {

    const response = await authenticatedFetch(
        `${API_URL}/users/${id}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        }
    );

    const user: UserInfo = await response.json() as UserInfo;


    return {
        ...user,
        avatar: {
            uri: `${API_URL}/users/${encodeURIComponent(user.id)}/avatar`,
        }
    }
}

export async function modUser(request: UserModRequest): Promise<UserInfo> {

    const {avatar, ...userRequest} = request;


    const requestBody = {
        ...userRequest,
        removeAvatar: avatar === null,
    };


    const userFile = new File(
        Paths.cache,
        `user-update-${Date.now()}.json`
    );


    try {
        userFile.create({overwrite: true});

        userFile.write(
            JSON.stringify(requestBody)
        );

        const formData = new FormData();

        formData.append("user", userFile, userFile.name);


        if (avatar !== undefined && avatar !== null) {
            const avatarFile = new File(avatar.uri);

            formData.append(
                "avatar",
                avatarFile,
                avatar.fileName
            );
        }

        const response = await authenticatedFetch(
            `${API_URL}/users/me`,
            {
                method: "PATCH",
                body: formData,
            }
        );

        const user = await response.json() as UserInfo;

        const actor = {
            id: user.id,
            entityName: user.username,
            type: EntityType.USER
        };

        await postActivity({
            issuedAt: getLocalDateTime(),
            actor: actor,
            subject: actor,
            context: undefined,
            action: Action.MODIFIED_PROFILE,
            details: undefined
        });

        return user;

    } finally {
        if (userFile.exists) {
            userFile.delete();
        }
    }
}

export async function deleteUser() {

    await authenticatedFetch(
        `${API_URL}/users/me`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
        }
    );


}

export async function requestUserActor(): Promise<EntityReference> {
    const currentUserId = await loadCurrentUserId();

    if (currentUserId === null) {
        router.replace("/(auth)");
        throw new Error("Utente non autenticato");
    }
    const currentUser = await fetchUser(currentUserId);

    return {
        id: currentUserId,
        entityName: currentUser.username,
        type: EntityType.USER
    };
}
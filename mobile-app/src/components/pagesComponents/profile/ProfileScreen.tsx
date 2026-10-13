import {useCallback, useRef, useState} from "react";
import {router, useFocusEffect, useLocalSearchParams,} from "expo-router";


import {AuthInfo, handleLogout, loadCurrentUserId, loadUserAuthInfo,} from "@/src/services/users/authService";
import {fetchUser} from "@/src/services/users/userService";
import {fetchUserTeams, leaveTeam} from "@/src/services/teams/teamService";
import type {TeamDetails} from "@/src/services/teams/teamDTO";
import {normalizeApiRequestError} from "@/src/services/errorService";
import BackButton from "@/src/components/common/buttons/BackButton";
import OptionsMenu from "@/src/components/common/OptionsMenu";
import ProfilePage from "@/src/components/pagesComponents/profile/ProfilePage";
import {UserInfo} from "@/src/services/users/userDTO";
import {useToast} from "@/src/components/common/Toast/ToastProvider";
import showAlert from "@/src/components/common/errors/Alert";
import {fetchActivities} from "@/src/services/activities/activityService";
import {ActivityResponse, EntityType} from "@/src/services/activities/ActivityDTO";
import {TournamentDetails} from "@/src/services/tournaments/tournamentDTO";

export type ProfileData = {
    user: UserInfo;
    auth: AuthInfo;
    teams: TeamDetails[];
    activities: ActivityResponse[];
    tournaments: TournamentDetails[];
    isOwnProfile: boolean;
};

export default function ProfileScreen() {

    const {showToast} = useToast();
    const params = useLocalSearchParams<{ profileId?: string }>();

    const profileId = params.profileId;

    const requestIdRefProfile = useRef(0);


    const [profile, setProfile] = useState<ProfileData | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    /*todo: fetch tornei dell'utente
       * In base alle squadre dell'utente recuperiamo i tornei a cui sono iscritte le squadre
     * */
    const loadProfile = useCallback(async () => {
        const requestId = ++requestIdRefProfile.current;

        setIsLoading(true);
        setError("");
        setProfile(null);

        try {
            const currentUserId = await loadCurrentUserId();

            if (requestId !== requestIdRefProfile.current) {
                return;
            }

            if (currentUserId === null || currentUserId === undefined) {
                router.replace("/(auth)");
                return;
            }

            const userId = profileId ?? String(currentUserId);
            const isOwnProfile = userId === String(currentUserId);

            const [user, teams, auth,] = await Promise.all([
                fetchUser(userId),
                fetchUserTeams(userId),
                loadUserAuthInfo(userId),

            ]);

            if (requestId !== requestIdRefProfile.current) {
                return;
            }

            setProfile({
                user,
                auth,
                teams,
                tournaments: [],
                activities: [],
                isOwnProfile
            });

            try {
                const activities = await fetchActivities(userId, EntityType.USER)
                setProfile(prev => {
                    if (prev === null) return null;

                    return {
                        ...prev,
                        activities: activities,
                    }
                });

            } catch (activitiesError) {
                if (requestId !== requestIdRefProfile.current) {
                    return;
                }

                console.log("Errore recupero attività utente")
                console.log(activitiesError)
            }

        } catch (error) {
            if (requestId !== requestIdRefProfile.current) {
                return;
            }

            const apiError = normalizeApiRequestError(error);
            setError(apiError.message)

        } finally {
            if (requestId === requestIdRefProfile.current) {
                setIsLoading(false);
            }
        }
    }, [profileId]);


    useFocusEffect(
        useCallback(() => {
            void loadProfile();

            return () => {
                requestIdRefProfile.current++;
            };
        }, [loadProfile]),
    );

    function onBack() {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(app)/home");
        }
    }

    function onMod() {
        if (!profile?.isOwnProfile) {
            return;
        }

        router.push({
            pathname: "/profile/modify",
            params: {
                profile: JSON.stringify(profile.user),
            },
        });
    }

    function onDelete() {
        if (!profile?.isOwnProfile) {
            return;
        }

        router.push({
            pathname: "/profile/delete",
        });
    }

    function canLeaveTeam(team: TeamDetails): boolean {

        if (!profile) {
            return false;
        }

        const isOwner = String(team.creatorId) === String(profile.user.id);

        const isPlayer = profile.teams.some(
            currentTeam => String(currentTeam.id) === String(team.id)
        );

        return !isOwner && isPlayer
    }

    async function leaveUserTeam(team: TeamDetails) {

        if (!profile) {
            return
        }
        try {
            await leaveTeam(team)


            setProfile(previous => {
                if (!previous) {
                    return previous;
                }

                return {
                    ...previous,
                    teams: previous.teams.filter(
                        currentTeam =>
                            String(currentTeam.id) !== String(team.id)
                    ),
                };
            });

            showToast("Hai abbandonato la squadra", true)
        } catch (error) {
            const apiError = normalizeApiRequestError(error)
            showAlert(
                "Impossibile abbandonare la squadra",
                apiError.message
            );
        }
    }


    return (
        <>
            {profileId !== undefined && (
                <BackButton onPress={onBack}/>
            )}

            {profile?.isOwnProfile && (
                <OptionsMenu
                    onEdit={onMod}
                    onDelete={onDelete}/>
            )}

            <ProfilePage
                variant="profile"
                profile = {profile}
                isOwnProfile={profile?.isOwnProfile}
                onLogout={handleLogout}
                error={error}
                loading={isLoading}
                onErrorRetry={loadProfile}
                canLeaveTeam={(team: TeamDetails) => canLeaveTeam(team)}
                leaveTeam={(team: TeamDetails) => leaveUserTeam(team)}
            />
        </>
    );
}



import {useCallback, useRef, useState} from "react";
import {router, useFocusEffect, useLocalSearchParams,} from "expo-router";


import {AuthInfo, handleLogout, loadCurrentUserId, loadUserAuthInfo,} from "@/src/services/users/authService";
import {fetchUser} from "@/src/services/users/userService";
import {fetchUserTeams} from "@/src/services/teams/teamService";
import type {TeamDetails} from "@/src/services/teams/teamDTO";
import {normalizeApiRequestError} from "@/src/services/errorService";
import BackButton from "@/src/components/common/buttons/BackButton";
import OptionsMenu from "@/src/components/common/OptionsMenu";
import ProfilePage from "@/src/components/pagesComponents/profile/ProfilePage";
import {UserInfo} from "@/src/services/users/userDTO";
import {useToast} from "@/src/components/common/Toast/ToastProvider";
import {fetchActivities} from "@/src/services/activities/activityService";
import {ActivityResponse, EntityType} from "@/src/services/activities/ActivityDTO";
import {TournamentDetails} from "@/src/services/tournaments/tournamentDTO";
import {fetchUserTournaments} from "@/src/services/tournaments/tournamentService";

export type ProfileData = {
    user: UserInfo;
    auth: AuthInfo;
    teams: TeamDetails[];
    activities: ActivityResponse[];
    //i tornei nella sezione profilo sono quelli gestiti dall'utente, non quelli a cui partecipa, quelli sono nella squadra
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

            const teams = await fetchUserTeams(userId);

            const [user, auth, tournaments] = await Promise.all([
                fetchUser(userId),
                loadUserAuthInfo(userId),
                fetchUserTournaments(teams, userId)
            ]);

            if (requestId !== requestIdRefProfile.current) {
                return;
            }

            setProfile({
                user,
                auth,
                teams,
                tournaments: tournaments.managed,
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

    function onModAuth() {
        if (!profile?.isOwnProfile) {
            return;
        }

        router.push({
            pathname: "/profile/modify-auth",
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


    return (
        <>
            {profileId !== undefined && (
                <BackButton onPress={onBack}/>
            )}

            {profile?.isOwnProfile && (
                <OptionsMenu
                    onEdit={onMod}
                    onEditAuth={onModAuth}
                    onDelete={onDelete}/>
            )}

            <ProfilePage
                variant="profile"
                profile={profile}
                isOwnProfile={profile?.isOwnProfile}
                onLogout={handleLogout}
                error={error}
                loading={isLoading}
                onErrorRetry={loadProfile}
            />
        </>
    );
}



import {useCallback, useRef, useState} from "react";
import {router, useFocusEffect, useLocalSearchParams,} from "expo-router";

import {handleLogout, loadCurrentUserId,} from "@/src/services/users/authService";
import {loadUserInfo, type UserInfo,} from "@/src/services/users/userService";
import {fetchUserTeams} from "@/src/services/teams/teamService";
import type {TeamDetails} from "@/src/services/teams/teamsConst";
import {normalizeApiRequestError} from "@/src/services/errorService";

import LoadingScreen from "@/src/components/common/loading/LoadingScreen";
import ErrorScreen from "@/src/components/common/errors/ErrorScreen";
import BackButton from "@/src/components/common/buttons/BackButton";
import OptionsMenu from "@/src/components/common/OptionsMenu";
import ProfilePage from "@/src/components/pagesComponents/profile/ProfilePage";

type ProfileData = {
    user: UserInfo;
    teams: TeamDetails[];
    isOwnProfile: boolean;
};

export default function ProfileScreen() {
    const params = useLocalSearchParams<{ profileId?: string }>();

    const profileId = params.profileId;

    const requestIdRef = useRef(0);

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProfile = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        setIsLoading(true);
        setError("");
        setProfile(null);

        try {
            const currentUserId = await loadCurrentUserId();

            if (requestId !== requestIdRef.current) {
                return;
            }

            if (currentUserId === null || currentUserId === undefined) {
                router.replace("/(auth)");
                return;
            }

            const userId = profileId ?? String(currentUserId);
            const isOwnProfile = userId === String(currentUserId);

            const [user, teams] = await Promise.all([
                loadUserInfo(userId),
                isOwnProfile
                    ? Promise.resolve<TeamDetails[]>([])
                    : fetchUserTeams(userId),
            ]);

            if (requestId !== requestIdRef.current) {
                return;
            }

            setProfile({
                user,
                teams,
                isOwnProfile,
            });
        } catch (error) {
            if (requestId !== requestIdRef.current) {
                return;
            }

            const apiError = normalizeApiRequestError(error);

            if (apiError.status !== 401) {
                setError(apiError.message);
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setIsLoading(false);
            }
        }
    }, [profileId]);

    useFocusEffect(
        useCallback(() => {
            void loadProfile();

            return () => {
                requestIdRef.current++;
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
        });
    }

    if (isLoading) {
        return <LoadingScreen message="Caricamento profilo..."/>;
    }

    if (error) {
        return (
            <ErrorScreen
                title="Impossibile caricare il profilo"
                message={error}
                onRetry={loadProfile}
                isRetrying={isLoading}
            />
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <>
            {profileId !== undefined && (
                <BackButton onPress={onBack}/>
            )}

            {profile.isOwnProfile && (
                <OptionsMenu onEdit={onMod}/>
            )}

            <ProfilePage
                variant="profile"
                user={profile.user}
                userTeams={profile.teams}
                isOwnProfile={profile.isOwnProfile}
                onLogout={handleLogout}
            />
        </>
    );
}
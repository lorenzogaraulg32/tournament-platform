import {useCallback, useRef, useState} from "react";
import {router, useFocusEffect, useLocalSearchParams,} from "expo-router";


import {handleLogout, loadCurrentUserId,} from "@/src/services/users/authService";
import {fetchUser} from "@/src/services/users/userService";
import {fetchUserTeams} from "@/src/services/teams/teamService";
import type {TeamDetails} from "@/src/services/teams/teamDTO";
import {normalizeApiRequestError} from "@/src/services/errorService";
import BackButton from "@/src/components/common/buttons/BackButton";
import OptionsMenu from "@/src/components/common/OptionsMenu";
import ProfilePage from "@/src/components/pagesComponents/profile/ProfilePage";
import {UserInfo} from "@/src/services/users/userDTO";

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
                fetchUser(userId),
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
            setError(apiError.message)

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
                    onDelete={onDelete}/>
            )}

            <ProfilePage
                variant="profile"
                user={profile?.user}
                userTeams={profile?.teams}
                isOwnProfile={profile?.isOwnProfile}
                onLogout={handleLogout}
                error={error}
                loading={isLoading}
                onErrorRetry={loadProfile}
            />
        </>
    );
}



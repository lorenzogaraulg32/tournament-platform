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

type ProfileData = {
    user: UserInfo;
    auth: AuthInfo;
    teams: TeamDetails[];
    isOwnProfile: boolean;
};

export default function ProfileScreen() {

    const {showToast} = useToast();
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

            const [user, teams, auth] = await Promise.all([
                fetchUser(userId),
                fetchUserTeams(userId),
                loadUserAuthInfo(userId)

            ]);

            if (requestId !== requestIdRef.current) {
                return;
            }

            setProfile({
                user,
                auth,
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
            await leaveTeam(team.id)


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
                user={profile?.user}
                auth={profile?.auth}
                userTeams={profile?.teams}
                isOwnProfile={profile?.isOwnProfile}
                onLogout={handleLogout}
                error={error}
                loading={isLoading}
                onErrorRetry={loadProfile}
                canLeaveTeam={(team : TeamDetails) => canLeaveTeam(team)}
                leaveTeam={(team : TeamDetails) => leaveUserTeam(team)}
            />
        </>
    );
}



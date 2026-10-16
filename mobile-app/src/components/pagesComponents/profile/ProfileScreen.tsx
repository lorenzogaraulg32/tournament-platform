import {useCallback, useRef, useState} from "react";
import {router, useFocusEffect, useLocalSearchParams,} from "expo-router";


import {handleLogout,} from "@/src/services/users/authService";
import {fetchUserProfileData, ProfileData} from "@/src/services/users/userService";
import {normalizeApiRequestError} from "@/src/services/errorService";
import BackButton from "@/src/components/common/buttons/BackButton";
import OptionsMenu from "@/src/components/common/OptionsMenu";
import ProfilePage from "@/src/components/pagesComponents/profile/ProfilePage";


export default function ProfileScreen() {

    const params = useLocalSearchParams<{ profileId?: string }>();

    const profileId = params.profileId;

    const requestIdRefProfile = useRef(0);


    const [profile, setProfile] = useState<ProfileData | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");


    const loadProfile = useCallback(async () => {
        const requestId = ++requestIdRefProfile.current;

        setIsLoading(true);
        setError("");
        setProfile(null);

        try {
            const profileData = await fetchUserProfileData(profileId);

            if (requestId !== requestIdRefProfile.current) {
                return;
            }

            setProfile(profileData);
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
                auth: JSON.stringify(profile.auth),
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



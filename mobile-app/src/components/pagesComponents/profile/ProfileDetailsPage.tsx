import {useCallback, useEffect, useRef, useState} from "react";
import {loadCurrentUserId} from "@/src/services/users/authService";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {Alert} from "react-native";
import {Redirect, router, useLocalSearchParams} from "expo-router";
import LoadingScreen from "@/src/components/common/loading/LoadingScreen";
import ProfilePage from "@/src/components/pagesComponents/profile/ProfilePage";

export default function ProfileDetailsPage() {
    const {profileId: userId} = useLocalSearchParams<{ profileId: string }>();
    const [isLoadingUserInfo, setLoadingUserInfo] = useState<boolean>(true)
    const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false)
    const requestIdRef = useRef(0);

    const loadUserInfo = useCallback(async () => {

        setLoadingUserInfo(true)
        const requestId = ++requestIdRef.current;

        try {
            const currentUserId = await loadCurrentUserId();

            // La richiesta non è più valida
            if (requestId !== requestIdRef.current) {
                return;
            }

            setIsOwnProfile(String(currentUserId) === userId);

            setLoadingUserInfo(false);
        } catch (error) {
            // Il componente è stato smontato o è partita un'altra richiesta
            if (requestId !== requestIdRef.current) {
                return;
            }

            const apiError = normalizeApiRequestError(error);

            // Redirect già gestito
            if (apiError.status === 401) {
                return;
            }

            Alert.alert(
                "Impossibile caricare l’utente",
                apiError.message,
                [
                    {
                        text: "Riprova",
                        onPress: () => void loadUserInfo(),
                    },
                    {
                        text: "Annulla",
                        style: "cancel",
                        onPress: () =>
                            router.replace("/(app)/home"),
                    },
                ],
                {
                    cancelable: false,
                },
            );
        }
    }, [userId]);

    useEffect(() => {
        void loadUserInfo();

        return () => {
            requestIdRef.current++;
        };
    }, [loadUserInfo]);


    if (isLoadingUserInfo) {
        return <LoadingScreen message="Caricamento profilo..."/>;
    }

    if (!userId) {
        return <Redirect href="/(app)/home"/>;
    }


    return <ProfilePage userId={userId} isOwnProfile={isOwnProfile} canBack={true}/>
}

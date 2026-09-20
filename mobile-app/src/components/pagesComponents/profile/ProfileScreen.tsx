import {useCallback, useEffect, useRef, useState} from "react";
import {loadCurrentUserId} from "@/src/services/users/authService";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {Redirect} from "expo-router";
import LoadingScreen from "@/src/components/common/loading/LoadingScreen";
import ProfilePage from "@/src/components/pagesComponents/profile/ProfilePage";
import showAlert from "@/src/components/common/errors/Alert";

export default function ProfileScreen() {

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
            if (!(apiError.status === 401)) {
                showAlert(
                    "Impossibile caricare l’utente",
                    apiError.message,
                    () => void loadUserInfo(),
                )
            }
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


    return <ProfilePage userId={userId} isOwnProfile={isOwnProfile}/>
}

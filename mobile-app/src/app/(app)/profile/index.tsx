import {loadCurrentUserId} from "@/src/services/users/authService";
import {useCallback, useEffect, useRef, useState} from "react";
import ProfilePage from "@/src/components/pagesComponents/profile/ProfilePage";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {Redirect} from "expo-router";
import LoadingScreen from "@/src/components/common/loading/LoadingScreen";
import showAlert from "@/src/components/common/errors/Alert";

export default function Index() {

    const [userId, setUserId] = useState<string>("")
    const [isLoadingUserId, setLoadingUserId] = useState<boolean>(true)

    const requestIdRef = useRef(0);


    const loadId = useCallback(async () => {

        setLoadingUserId(true)
        const requestId = ++requestIdRef.current;

        try {
            const currentUserId = await loadCurrentUserId();

            // La richiesta non è più valida
            if (requestId !== requestIdRef.current) {
                return;
            }

            setUserId(String(currentUserId));
            setLoadingUserId(false);
        } catch (error) {
            // Il componente è stato smontato o è partita un'altra richiesta
            if (requestId !== requestIdRef.current) {
                return;
            }

            const apiError = normalizeApiRequestError(error);


            if (!(apiError.status === 401)) {
                showAlert(
                    "Impossibile caricare l'id dell’utente",
                    apiError.message,
                    () => void loadId(),
                )
            }
        }
    }, []);

    useEffect(() => {
        void loadId();

        return () => {
            requestIdRef.current++;
        };
    }, [loadId]);

    if (isLoadingUserId) {
        return <LoadingScreen message="Caricamento profilo..."/>;
    }

    if (!userId) {
        return <Redirect href="/(app)/home"/>;
    }

    return <ProfilePage userId={userId} isOwnProfile={true}/>;


}

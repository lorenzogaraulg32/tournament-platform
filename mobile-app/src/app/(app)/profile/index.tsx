import {loadCurrentUserId} from "@/src/services/users/authService";
import {useCallback, useEffect, useRef, useState} from "react";
import ProfilePage from "@/src/components/pagesComponents/profile/ProfilePage";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {Alert} from "react-native";
import {router} from "expo-router";

export default function Index() {

    const [userId, setUserId] = useState<string>("")
    const requestIdRef = useRef(0);


    const loadId = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        try {
            const currentUserId = await loadCurrentUserId();

            // La richiesta non è più valida
            if (requestId !== requestIdRef.current) {
                return;
            }

            setUserId(currentUserId);
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
                        onPress: () => void loadId(),
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
    }, []);

    useEffect(() => {
        void loadId();

        return () => {
            requestIdRef.current++;
        };
    }, [loadId]);

    if (!userId) {
        router.replace("/(app)/home")
    }

    return (
        <ProfilePage userId={userId} isOwnProfile={true}/>
    );


}

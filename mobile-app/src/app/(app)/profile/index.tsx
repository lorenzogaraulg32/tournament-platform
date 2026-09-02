import {loadCurrentUserId} from "@/src/services/users/authService";
import {useEffect, useState} from "react";
import ProfilePage from "@/src/components/pagesComponents/profile/ProfilePage";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {Alert} from "react-native";
import {router} from "expo-router";

export default function Index() {

    const [userId, setUserId] = useState<string>("")

    useEffect(() => {

        let isActive = true;


        async function loadId() {
            try {
                const currentUserId =
                    await loadCurrentUserId();

                if (isActive) {
                    setUserId(currentUserId);
                }
            } catch (error) {
                const apiError = normalizeApiRequestError(error)

                //assorbe l'errore già gestito e rilanciato
                if (apiError.status === 401) {
                    return;
                }

                if (isActive) {
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
            }
        }

        void loadId();

        return () => {
            isActive = false;
        };
    }, []);

    if (!userId) {
        return null;
    }

    return (
        <ProfilePage userId={userId}  isOwnProfile={true}/>
    );


}

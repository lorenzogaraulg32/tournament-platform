import {router} from "expo-router";
import {Alert} from "react-native";
import DeleteScreen from "@/src/components/common/DeleteScreen";
import {deleteUser} from "@/src/services/users/userService";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {clearSession} from "@/src/services/users/sessionService";


export default function DeleteUserPage() {

    async function handleDelete(): Promise<void> {
        try {
            await deleteUser();

            // cancella token/sessione locale
            await clearSession()

            router.replace("/(auth)");

        } catch (error) {
            const apiError = normalizeApiRequestError(error);

            if (apiError.status !== 401) {
                Alert.alert(
                    "Errore",
                    apiError.message || "Impossibile eliminare l'account."
                );
            }
        }
    }

    return (
        <DeleteScreen
            message="Vuoi eliminare il tuo profilo? Questa operazione non può essere annullata."
            onDelete={handleDelete}
            variant={"profile"}/>
    );
}
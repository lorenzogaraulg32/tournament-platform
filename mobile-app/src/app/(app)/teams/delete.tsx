import {router, useLocalSearchParams} from "expo-router";
import {Text} from "react-native";
import DeleteScreen from "@/src/components/common/DeleteScreen";
import {deleteTeam} from "@/src/services/teams/teamService";


export default function DeleteTeamPage() {
    const {teamId} = useLocalSearchParams<{
        teamId?: string | string[];
    }>();

    const id = Array.isArray(teamId) ? teamId[0] : teamId;

    async function handleDelete(): Promise<void> {
        if (!id) {
            throw new Error("ID della squadra mancante");
        }

        await deleteTeam(id);

        router.replace("/(app)/teams");
    }

    if (!id) {
        return <Text>ID della squadra mancante.</Text>;
    }

    return (
        <DeleteScreen
            message="Vuoi eliminare la squadra? Questa operazione non può essere annullata."
            onDelete={handleDelete}
            variant={"teams"}/>
    );
}